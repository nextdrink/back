import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Patch,
  Response,
  UseGuards,
} from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { Ingredients } from './ingredients.model';
import { languages, defaultLang, ROLES } from '../constants';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles-auth.decorator';

@ApiTags('Ingredients')
@Controller(`:lang(${languages.join('|')})?/ingredients`)
export class IngredientsController {
  constructor(private ingredientsService: IngredientsService) {}

  @ApiOperation({ summary: 'Get all ingredients' })
  @ApiResponse({ status: 200, type: [Ingredients] })
  @Get()
  getIngredients(@Param('lang') lang = defaultLang) {
    return this.ingredientsService.getAllIngredients(lang);
  }

  @ApiOperation({ summary: 'Get ingredient with all info' })
  @ApiResponse({ status: 200, type: Ingredients })
  @Get('/:id')
  async getIngredient(@Param('id') id: string, @Param('lang') lang = defaultLang, @Response() res) {
    const ingredient = await this.ingredientsService.getAllIngredientInfo(id);
    const { name, description, cocktails } = ingredient;

    const cocktailsOneLang = cocktails.map((cocktail) => ({
      ...cocktail,
      name: cocktail.name[lang],
    }));

    const ingredientOneLang = {
      ...ingredient,
      name: name[lang],
      description: description[lang],
      cocktails: cocktailsOneLang,
    };

    return res.json(ingredientOneLang);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  @ApiOperation({ summary: 'Create new ingredient' })
  @ApiResponse({ status: 200, type: Ingredients })
  @Post('/admin')
  create(@Body() ingredientDto: CreateIngredientDto) {
    return this.ingredientsService.createIngredient(ingredientDto);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  @ApiOperation({ summary: 'Get ingredients for admin section' })
  @ApiResponse({ status: 200, type: Ingredients })
  @Get('/admin/all')
  async get() {
    const ingredients = await this.ingredientsService.getAllIngredients(defaultLang);

    return ingredients.map(({ id, name }) => {
      return { id, name };
    });
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  @ApiOperation({ summary: 'Update ingredient' })
  @ApiResponse({ status: 200, type: Ingredients })
  @Patch('/admin/:id')
  edit(@Param('id') id: string, @Body() ingredientDto: CreateIngredientDto) {
    return this.ingredientsService.updateIngredient(id, ingredientDto);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  @ApiOperation({ summary: 'Delete ingredient' })
  @ApiResponse({ status: 200, type: Ingredients })
  @Delete('/admin/:id')
  deleteIngredient(@Param('id') id: string) {
    return this.ingredientsService.deleteIngredient(id);
  }
}
