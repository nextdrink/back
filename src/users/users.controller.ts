import { Body, Controller, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { AddFavoriteCocktailDto } from './dto/add-favorite-cocktail.dto';
import { CocktailsService } from '../cocktails/cocktails.service';
import { AddIngredientDto } from './dto/add-ingredient.dto';

@Controller(':lang?/users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private cocktailsRepository: CocktailsService,
  ) {}

  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.usersService.createUser(userDto);
  }

  @Post('/addCocktail')
  addFavoriteCocktail(@Body() dto: AddFavoriteCocktailDto) {
    return this.usersService.addCocktail(dto);
  }

  @Post('/getCocktails')
  getFavoriteCocktails(@Param('lang') lang = 'en', @Body() { userId }) {
    console.log(lang);
    return this.cocktailsRepository.getCocktailsByUserId(userId);
  }

  @Post('/addIngredient')
  addIngredient(@Body() dto: AddIngredientDto) {
    return this.usersService.addIngredient(dto);
  }

  @Post('/getIngredients')
  getIngredients(@Body() { userId }) {
    return this.cocktailsRepository.getCocktailsByUserId(userId);
  }
}
