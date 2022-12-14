import { Body, Controller, Param, Post, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { AddCocktailDto } from './dto/add-cocktail.dto';
import { CocktailsService } from '../cocktails/cocktails.service';
import { IngredientsService } from '../ingredients/ingredients.service';
import { AddIngredientDto } from './dto/add-ingredient.dto';
import { languages, defaultLang } from '../constants';

@Controller(`:lang(${languages.join('|')})?/users`)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private cocktailsRepository: CocktailsService,
    private ingredientsRepository: IngredientsService,
  ) {}

  @Post('/addCocktail')
  addFavoriteCocktail(@Body() dto: AddCocktailDto) {
    return this.usersService.addCocktail(dto);
  }

  @Post('/getCocktails')
  getCocktails(@Param('lang') lang = defaultLang, @Body() { userId }) {
    return this.cocktailsRepository.getCocktailsByUserId(userId, lang);
  }

  @Delete('/removeCocktail')
  removeFavoriteCocktail(@Body() dto: AddCocktailDto) {
    return this.usersService.removeCocktail(dto);
  }

  @Post('/addIngredient')
  addIngredient(@Body() dto: AddIngredientDto) {
    return this.usersService.addIngredient(dto);
  }

  @Post('/getIngredients')
  getIngredients(@Param('lang') lang = defaultLang, @Body() { userId }) {
    return this.ingredientsRepository.getIngredientsByUserId(userId, lang);
  }

  @Delete('/removeIngredient')
  removeIngredient(@Body() dto: AddIngredientDto) {
    return this.usersService.removeIngredient(dto);
  }

  @Post('/myBar')
  async myBar(@Body() dto: AddIngredientDto, @Param('lang') lang = defaultLang) {
    return this.cocktailsRepository.myBar(dto.userId, lang);
  }
}
