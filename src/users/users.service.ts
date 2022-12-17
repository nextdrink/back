import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Users } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { CocktailsService } from '../cocktails/cocktails.service';
import { AddCocktailDto } from './dto/add-cocktail.dto';
import { IngredientsService } from '../ingredients/ingredients.service';
import { AddIngredientDto } from './dto/add-ingredient.dto';
import { RolesService } from '../roles/roles.service';
import { Roles } from '../roles/roles.model';
import { ROLES } from '../constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users)
    private usersRepository: typeof Users,
    private cocktailsRepository: CocktailsService,
    private ingredientsRepository: IngredientsService,
    private rolesRepository: RolesService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.usersRepository.create(dto);
    const role = await this.rolesRepository.getRoleByValue(ROLES.USER);
    await user.$set('roles', [role.id]);

    return user;
  }

  async getAllUsers() {
    return await this.usersRepository.findAll({
      include: {
        model: Roles,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        through: {
          attributes: [],
        },
      },
    });
  }

  async getUserByEmail(email: string) {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async getUserRolesById(id: number) {
    const user = await this.usersRepository.findByPk(id, { include: { model: Roles } });
    return user.toJSON().roles.map(({ value }) => value);
  }

  async addCocktail(dto: AddCocktailDto) {
    const { userId, cocktailId } = dto;
    const user = await this.usersRepository.findByPk(userId);
    const cocktail = await this.cocktailsRepository.getCocktailById(cocktailId);

    if (cocktail && user) {
      await user.$add('cocktails', cocktailId);
      return dto;
    }
    throw new HttpException('User or cocktail not found', HttpStatus.NOT_FOUND);
  }

  async removeCocktail(dto: AddCocktailDto) {
    const { userId, cocktailId } = dto;
    const user = await this.usersRepository.findByPk(userId);
    const cocktail = await this.cocktailsRepository.getCocktailById(cocktailId);

    if (cocktail && user) {
      await user.$remove('cocktails', cocktailId);
      return dto;
    }
    throw new HttpException('User or cocktail not found', HttpStatus.NOT_FOUND);
  }

  async addIngredient(dto: AddIngredientDto) {
    const { userId, ingredientId } = dto;
    const user = await this.usersRepository.findByPk(userId);
    const ingredient = await this.ingredientsRepository.getIngredientById(ingredientId);

    if (user && ingredient) {
      await user.$add('ingredients', ingredientId);
      return dto;
    }
    throw new HttpException('User or ingredient not found', HttpStatus.NOT_FOUND);
  }

  async removeIngredient(dto: AddIngredientDto) {
    const { userId, ingredientId } = dto;
    const user = await this.usersRepository.findByPk(userId);
    const ingredient = await this.ingredientsRepository.getIngredientById(ingredientId);

    if (user && ingredient) {
      await user.$remove('ingredients', ingredientId);
      return dto;
    }
    throw new HttpException('User or ingredient not found', HttpStatus.NOT_FOUND);
  }
}
