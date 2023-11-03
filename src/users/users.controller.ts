import { Body, Controller, Param, Get, Post, Delete, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AddCocktailDto } from './dto/add-cocktail.dto';
import { CocktailsService } from '../cocktails/cocktails.service';
import { IngredientsService } from '../ingredients/ingredients.service';
import { AddIngredientDto } from './dto/add-ingredient.dto';
import { languages, defaultLang, ROLES } from '../constants';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from '../auth/roles-auth.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RemoveIngredientsDto } from './dto/remove-ingredients.dto';
import { RemoveCocktailsDto } from './dto/remove-cocktails.dto';

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
  addFavoriteCocktail(@Request() req, @Body() dto: AddCocktailDto) {
    // TODO: use GetUser decorator
    dto.userId = req?.user?.userId;
    return this.usersService.addCocktail(dto);
  }

  @Get('/getCocktails')
  @UseGuards(JwtGuard)
  getCocktails(@Request() req, @Param('lang') lang = defaultLang) {
    // TODO: use GetUser decorator
    const userId = req?.user?.userId;
    return this.cocktailsRepository.getCocktailsByUserId(userId, lang);
  }

  @Delete('/removeCocktails')
  @UseGuards(JwtGuard)
  removeFavoriteCocktail(@Request() req, @Body() dto: RemoveCocktailsDto) {
    // TODO: use GetUser decorator
    dto.userId = req?.user?.userId;
    return this.usersService.removeCocktails(dto);
  }

  @Post('/addIngredient')
  @UseGuards(JwtGuard)
  addIngredient(@Request() req, @Body() dto: AddIngredientDto) {
    // TODO: use GetUser decorator
    dto.userId = req?.user?.userId;
    return this.usersService.addIngredient(dto);
  }

  @Get('/getIngredients')
  @UseGuards(JwtGuard)
  getIngredients(@Request() req, @Param('lang') lang = defaultLang) {
    // TODO: use GetUser decorator
    const userId = req?.user?.userId;
    return this.ingredientsRepository.getIngredientsByUserId(userId, lang);
  }

  @Delete('/removeIngredients')
  @UseGuards(JwtGuard)
  removeIngredients(@Request() req, @Body() dto: RemoveIngredientsDto) {
    // TODO: use GetUser decorator
    dto.userId = req?.user?.userId;
    return this.usersService.removeIngredients(dto);
  }

  @Get('/myBar')
  @UseGuards(JwtGuard)
  async myBar(@Request() req, @Param('lang') lang = defaultLang) {
    // TODO: use GetUser decorator
    const userId = req?.user?.userId;
    return this.cocktailsRepository.getCocktailsFromMyIngredients(userId, lang);
  }
}
