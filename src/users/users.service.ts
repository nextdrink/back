import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Users } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { CocktailsService } from '../cocktails/cocktails.service';
import { AddFavoriteCocktailDto } from './dto/add-favorite-cocktail.dto';
import { IngredientsService } from '../ingredients/ingredients.service';
import { AddIngredientDto } from './dto/add-ingredient.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users)
    private usersRepository: typeof Users,
    private cocktailsRepository: CocktailsService,
    private ingredientsRepository: IngredientsService,
  ) {}

  async createUser(dto: CreateUserDto) {
    return await this.usersRepository.create(dto);
  }

  async getUserByEmail(email: string) {
    return await this.usersRepository.findOne({ where: { email } });
  }

  // TODO remove "favorite" word
  async addCocktail(dto: AddFavoriteCocktailDto) {
    const { userId, cocktailId } = dto;
    const user = await this.usersRepository.findByPk(userId);
    const cocktail = await this.cocktailsRepository.getCocktailById(cocktailId);

    if (cocktail && user) {
      await user.$add('cocktails', cocktailId);
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
}
