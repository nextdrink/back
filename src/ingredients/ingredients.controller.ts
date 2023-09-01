import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Put,
  Response,
  UseGuards,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
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
  @ApiOkResponse({ type: [Ingredients] })
  @Get()
  getIngredients(@Param('lang') lang = defaultLang) {
    return this.ingredientsService.getAllIngredients(lang);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get ingredient with all info' })
  @ApiOkResponse({ type: Ingredients })
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

  @Post('/admin')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  @ApiOperation({ summary: 'Create new ingredient' })
  @ApiOkResponse({ type: Ingredients })
  @UsePipes(ValidationPipe)
  create(@Body() ingredientDto: CreateIngredientDto) {
    return this.ingredientsService.createIngredient(ingredientDto);
  }

  @Get('/admin/all')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  @ApiOperation({ summary: 'Get ingredients for admin section' })
  @ApiOkResponse({ type: [Ingredients] })
  async get() {
    const ingredients = await this.ingredientsService.getAllIngredients(defaultLang);

    return ingredients.map(({ id, name }) => {
      return { id, name };
    });
  }

  @Get('/admin/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  @ApiOperation({ summary: 'Get ingredient for admin section' })
  @ApiOkResponse({ type: Ingredients })
  async getAdminIngredient(@Param('id') id, @Response() res) {
    const ingredient = await this.ingredientsService.getIngredientById(id);

    if (!ingredient) {
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).send(`Ingredient with id ${id} not found`);
    }

    return res.json(ingredient);
  }

  @Put('/admin/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  @ApiOperation({ summary: 'Update ingredient' })
  @ApiOkResponse({ type: Ingredients })
  edit(@Param('id') id: string, @Body() ingredientDto: CreateIngredientDto) {
    return this.ingredientsService.updateIngredient(id, ingredientDto);
  }

  @Delete('/admin/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  @ApiOperation({ summary: 'Delete ingredient' })
  @ApiOkResponse({ type: Ingredients })
  deleteIngredient(@Param('id') id: string) {
    return this.ingredientsService.deleteIngredient(id);
  }
}
