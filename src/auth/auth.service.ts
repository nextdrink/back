import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import dayjs from 'dayjs';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { IngredientsService } from '../ingredients/ingredients.service';
import { CocktailsService } from '../cocktails/cocktails.service';
import { TokenService } from '../token/token.service';
import { MailService } from '../mail/mail.service';
import { statusEnum } from '../users/enums/status.enum';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  private readonly clientAppUrl: string;
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private ingredientsRepository: IngredientsService,
    private cocktailsRepository: CocktailsService,
    private tokenService: TokenService,
    private mailService: MailService,
    private readonly configService: ConfigService,
  ) {
    this.clientAppUrl = this.configService.get<string>('FE_APP_URL');
  }

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    // TODO: check user status
    const { id, status } = user;

    const accessToken = await this.generateToken(user);
    const roles = user.toJSON().roles.map(({ value }) => value);
    const usersIngredientsIds = await this.ingredientsRepository.getIngredientsIdsByUserId(id);
    const usersCocktailsIds = await this.cocktailsRepository.getCocktailsIdsByUserId(id);

    return {
      accessToken,
      status,
      roles,
      usersIngredientsIds,
      usersCocktailsIds,
    };
  }

  async registration(userDto: CreateUserDto) {
    const candidate = await this.usersService.getUserByEmail(userDto.email);

    if (candidate) {
      throw new HttpException(`User with email ${userDto.email} already exists`, HttpStatus.BAD_REQUEST);
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.usersService.createUser({
      ...userDto,
      password: hashPassword,
      status: statusEnum.pending,
    });
    const token = await this.generateToken(user);
    await this.saveToken(token, user.id);
    await this.sendConfirmationEmailLink(user, token);
    return token;
  }

  async confirm(token: string): Promise<any> {
    const data = await this.verifyToken(token);
    const { email, sub: userId } = data;

    await this.tokenService.delete(userId, token);

    const user = await this.usersService.getUserByEmail(email);
    if (user?.status === statusEnum.pending) {
      user.status = statusEnum.active;
      await user.save();

      return true;
    }

    throw new BadRequestException('Confirmation error');
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.usersService.getUserByEmail(forgotPasswordDto.email);
    if (!user) {
      throw new HttpException(`User with email ${forgotPasswordDto.email} not found`, HttpStatus.BAD_REQUEST);
    }

    const token = await this.generateToken(user);

    // TODO: check if token exist for user
    await this.saveToken(token, user.id);

    await this.sendChangePassLink(user.email, token);
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    const data = await this.verifyToken(changePasswordDto.token);
    const { sub: userId } = data;

    await this.tokenService.delete(userId, changePasswordDto.token);
    const hashPassword = await bcrypt.hash(changePasswordDto.password, 5);
    await this.usersService.updateUser({ password: hashPassword }, userId);
  }

  private async generateToken(user) {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload, { expiresIn: '30d' });
  }

  async validateUser({ email, password }): Promise<any> {
    const user = await this.usersService.getUserWithRolesByEmail(email);
    if (user) {
      const passwordEquals = await bcrypt.compare(password, user.password);
      // TODO: refactor
      if (passwordEquals) {
        if (user.status !== statusEnum.active) {
          throw new HttpException('Forbidden resource', HttpStatus.FORBIDDEN);
        }
        return user;
      }
    }

    throw new UnauthorizedException({ message: 'wrong user data' });
  }

  private async saveToken(token: string, userId: number) {
    const tokenPayload = {
      userId,
      token,
      expireAt: dayjs().add(1, 'day').toISOString(),
    };
    await this.tokenService.create(tokenPayload);
  }

  private async verifyToken(token) {
    try {
      const data = this.jwtService.verify(token);
      const tokenExists = await this.tokenService.exists(data.sub, token);

      if (tokenExists) {
        return data;
      }
      throw new UnauthorizedException();
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  private async sendConfirmationEmailLink(user, token) {
    const confirmLink = `${this.clientAppUrl}/auth/confirm?token=${token}`;
    await this.mailService.send({
      from: this.configService.get<string>('JS_CODE_MAIL'),
      to: user.email,
      subject: 'Verify User',
      text: `
                Hello there!
                Please use this ${confirmLink} to confirm your account
            `,
    });
  }

  private async sendChangePassLink(email, token) {
    const confirmLink = `${this.clientAppUrl}/auth/reset?token=${token}`;
    await this.mailService.send({
      from: this.configService.get<string>('JS_CODE_MAIL'),
      to: email,
      subject: 'Verify User',
      text: `
                Hello there!
                Please use this ${confirmLink} to reset your password
            `,
    });
  }
}
