import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { IngredientsService } from '../ingredients/ingredients.service';
import { CocktailsService } from '../cocktails/cocktails.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private ingredientsRepository: IngredientsService,
    private cocktailsRepository: CocktailsService,
  ) {}

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);

    const accessToken = await this.generateToken(user);
    const roles = user.toJSON().roles.map(({ value }) => value);
    const usersIngredientsIds = await this.ingredientsRepository.getIngredientsIdsByUserId(user.id);
    const usersCocktailsIds = await this.cocktailsRepository.getCocktailsIdsByUserId(user.id);

    return {
      accessToken,
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
    });
    return this.generateToken(user);
  }

  private async generateToken(user) {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }

  async validateUser({ email, password }): Promise<any> {
    const user = await this.usersService.getUserWithRolesByEmail(email);
    if (user) {
      const passwordEquals = await bcrypt.compare(password, user.password);
      if (passwordEquals) return user;
    }

    throw new UnauthorizedException({ message: 'wrong user data' });
  }
}
