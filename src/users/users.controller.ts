import { Body, Controller, Param, Get, Post, Delete, UseGuards, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { AddCocktailDto } from './dto/add-cocktail.dto';
import { CocktailsService } from '../cocktails/cocktails.service';
import { IngredientsService } from '../ingredients/ingredients.service';
import { AddIngredientDto } from './dto/add-ingredient.dto';
import { languages, defaultLang, ROLES } from '../constants';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { Roles } from '../auth/roles-auth.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RemoveIngredientsDto } from './dto/remove-ingredients.dto';
import { RemoveCocktailsDto } from './dto/remove-cocktails.dto';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller(`:lang(${languages.join('|')})?/users`)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private cocktailsRepository: CocktailsService,
    private ingredientsRepository: IngredientsService,
  ) {}

  @Get()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Post('/addCocktail')
  @UseGuards(JwtGuard)
  addFavoriteCocktail(
    @GetUser('userId') userId: number,
    @Body(new ValidationPipe()) dto: AddCocktailDto,
  ): Promise<AddCocktailDto> {
    return this.usersService.addCocktail(userId, dto);
  }

  @Get('/getCocktails')
  @UseGuards(JwtGuard)
  getCocktails(@GetUser('userId') userId: number, @Param('lang') lang = defaultLang) {
    return this.cocktailsRepository.getCocktailsByUserId(userId, lang);
  }

  @Delete('/removeCocktails')
  @UseGuards(JwtGuard)
  removeFavoriteCocktail(@GetUser('userId') userId: number, @Body(new ValidationPipe()) dto: RemoveCocktailsDto) {
    return this.usersService.removeCocktails(userId, dto);
  }

  @Post('/addIngredient')
  @UseGuards(JwtGuard)
  addIngredient(@GetUser('userId') userId: number, @Body(new ValidationPipe()) dto: AddIngredientDto) {
    return this.usersService.addIngredient(userId, dto);
  }

  @Get('/getIngredients')
  @UseGuards(JwtGuard)
  getIngredients(@GetUser('userId') userId: number, @Param('lang') lang = defaultLang) {
    return this.ingredientsRepository.getIngredientsByUserId(userId, lang);
  }

  @Delete('/removeIngredients')
  @UseGuards(JwtGuard)
  removeIngredients(@GetUser('userId') userId: number, @Body(new ValidationPipe()) dto: RemoveIngredientsDto) {
    return this.usersService.removeIngredients(userId, dto);
  }

  @Get('/myBar')
  @UseGuards(JwtGuard)
  async myBar(@GetUser('userId') userId: number, @Param('lang') lang = defaultLang) {
    return this.cocktailsRepository.getCocktailsFromMyIngredients(userId, lang);
  }

  @Get('/cocktail-check-like/:id')
  @UseGuards(JwtGuard)
  async isCocktailLiked(@GetUser('userId') userId: number, @Param('id') id) {
    return this.usersService.checkLikedCocktail(userId, id);
  }

  @Get('/ingredient-check-add/:id')
  @UseGuards(JwtGuard)
  async isIngredientAdded(@GetUser('userId') userId: number, @Param('id') id) {
    return this.usersService.checkAddedIngredient(userId, id);
  }
}
