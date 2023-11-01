import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import dayjs from 'dayjs';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { IngredientsService } from '../ingredients/ingredients.service';
import { CocktailsService } from '../cocktails/cocktails.service';
import { TokenService } from '../token/token.service';
import { MailService } from '../mail/mail.service';
import { statusEnum } from '../users/enums/status.enum';

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
      throw new HttpException(
        `User with email ${userDto.email} already exist`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.usersService.createUser({
      ...userDto,
      password: hashPassword,
      status: statusEnum.pending,
    });
    const token = await this.generateToken(user);
    await this.sendConfirmation(user, token);
    return token;
  }

  private async generateToken(user) {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
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

  private async sendConfirmation(user, token) {
    const tokenPayload = {
      userId: user.id,
      token,
      expireAt: dayjs().add(1, 'day').toISOString(),
    };
    await this.tokenService.create(tokenPayload);

    const confirmLink = `${this.clientAppUrl}/auth/confirm?token=${token}`;
    await this.mailService.send({
      from: this.configService.get<string>('JS_CODE_MAIL'),
      to: user.email,
      subject: 'Verify User',
      text: `
                Hello ${user.firstName}!
                Please use this ${confirmLink}
            `,
    });
  }

  async validateUser({ email, password }): Promise<any> {
    const user = await this.usersService.getUserWithRolesByEmail(email);
    if (user) {
      const passwordEquals = await bcrypt.compare(password, user.password);
      if (passwordEquals) return user;
    }

    throw new UnauthorizedException({ message: 'wrong user data' });
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
}
