import {
  Controller,
  Post,
  Get,
  Body,
  Delete,
  Param,
  Patch,
  Response,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { CocktailsService } from './cocktails.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Cocktails } from './cocktails.model';
import { DeleteCocktailDto, UpdateCocktailDto } from './dto/actions-cocktail.dto';
import { languages, defaultLang, ROLES } from '../constants';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles-auth.decorator';

@ApiTags('Cocktails')
@Controller(`:lang(${languages.join('|')})?/cocktails`)
export class CocktailsController {
  constructor(private cocktailsService: CocktailsService) {}

  @ApiOperation({ summary: 'Get all cocktails' })
  @ApiResponse({ status: 200, type: [Cocktails] })
  @Get()
  getAll(@Param('lang') lang = defaultLang) {
    return this.cocktailsService.getAllCocktails(lang);
  }

  @ApiOperation({ summary: 'Get cocktail' })
  @ApiResponse({ status: 200, type: Cocktails })
  @Get(':id')
  async getCocktail(@Param('id') id, @Param('lang') lang = defaultLang, @Response() res) {
    const cocktail = await this.cocktailsService.getCocktailById(id);
    if (!cocktail) {
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).send(`Cocktails with id ${id} not found`);
    }

    const { name, description, recipe, ingredients } = cocktail;

    const ingredientsOneLang = ingredients.map((ingredient) => {
      const { name, description } = ingredient;
      return { ...ingredient, name: name[lang], description: description[lang] };
    });

    const cocktailOneLang = {
      ...cocktail,
      name: name[lang],
      description: description[lang],
      recipe: recipe[lang],
      ingredients: ingredientsOneLang,
    };

    return res.json(cocktailOneLang);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  @ApiOperation({ summary: 'Get a cocktail for editing in the admin panel' })
  @ApiResponse({ status: 200, type: UpdateCocktailDto })
  @Get('/admin/all')
  async getAdminAll(@Param('lang') lang = defaultLang) {
    return this.cocktailsService.getAllAdminCocktails(lang);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  @ApiOperation({ summary: 'Get a cocktail for editing in the admin panel' })
  @ApiResponse({ status: 200, type: UpdateCocktailDto })
  @Get('/admin/:id')
  async getAdminCocktail(@Param('id') id, @Response() res) {
    const cocktail = await this.cocktailsService.getCocktailById(id);
    if (!cocktail) {
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).send(`Cocktails with id ${id} not found`);
    }

    // @ts-ignore
    const ingredients = cocktail.ingredients.map(({ id, value: { amount } }) => {
      return { id, amount };
    });

    const cocktailModifiedIngredients = {
      ...cocktail,
      ingredients,
    };

    return res.json(cocktailModifiedIngredients);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  @ApiOperation({ summary: 'Create new cocktail' })
  @ApiResponse({ status: 200, type: Cocktails })
  @Post('/admin')
  create(@Body() cocktailDto: CreateCocktailDto) {
    return this.cocktailsService.createCocktail(cocktailDto);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  @ApiOperation({ summary: 'Update cocktail' })
  @ApiResponse({ status: 200, type: UpdateCocktailDto })
  @Patch('/admin/:id')
  update(@Param('id') id: string, @Body() cocktailDto: CreateCocktailDto) {
    return this.cocktailsService.updateCocktail(id, cocktailDto);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  @ApiOperation({ summary: 'Delete cocktail' })
  @ApiResponse({ status: 200, type: DeleteCocktailDto })
  @Delete('admin/:id')
  delete(@Param('id') id: string) {
    return this.cocktailsService.deleteCocktail(id);
  }
}
