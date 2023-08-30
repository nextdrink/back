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

  @UseGuards(JwtGuard)
  @Post('/addCocktail')
  addFavoriteCocktail(@Request() req, @Body() dto: AddCocktailDto) {
    dto.userId = req?.user?.userId;
    return this.usersService.addCocktail(dto);
  }

  @UseGuards(JwtGuard)
  @Get('/getCocktails')
  getCocktails(@Request() req, @Param('lang') lang = defaultLang) {
    const userId = req?.user?.userId;
    return this.cocktailsRepository.getCocktailsByUserId(userId, lang);
  }

  @UseGuards(JwtGuard)
  @Delete('/removeCocktails')
  removeFavoriteCocktail(@Request() req, @Body() dto: RemoveCocktailsDto) {
    dto.userId = req?.user?.userId;
    return this.usersService.removeCocktails(dto);
  }

  @UseGuards(JwtGuard)
  @Post('/addIngredient')
  addIngredient(@Request() req, @Body() dto: AddIngredientDto) {
    dto.userId = req?.user?.userId;
    return this.usersService.addIngredient(dto);
  }

  @UseGuards(JwtGuard)
  @Get('/getIngredients')
  getIngredients(@Request() req, @Param('lang') lang = defaultLang) {
    const userId = req?.user?.userId;
    return this.ingredientsRepository.getIngredientsByUserId(userId, lang);
  }

  @UseGuards(JwtGuard)
  @Delete('/removeIngredients')
  removeIngredients(@Request() req, @Body() dto: RemoveIngredientsDto) {
    dto.userId = req?.user?.userId;
    return this.usersService.removeIngredients(dto);
  }

  @UseGuards(JwtGuard)
  @Get('/myBar')
  async myBar(@Request() req, @Param('lang') lang = defaultLang) {
    const userId = req?.user?.userId;
    return this.cocktailsRepository.getCocktailsFromMyIngredients(userId, lang);
  }
}
