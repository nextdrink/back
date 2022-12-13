import {
  Controller,
  Post,
  Get,
  Body,
  Delete,
  Param,
  Patch,
  Response,
  // UseGuards,
} from '@nestjs/common';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { CocktailsService } from './cocktails.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Cocktails } from './cocktails.model';
import { DeleteCocktailDto, UpdateCocktailDto } from './dto/actions-cocktail.dto';
import { languages, defaultLang } from '../constants';

@ApiTags('Cocktails')
@Controller(`:lang(${languages.join('|')})?/cocktails`)
export class CocktailsController {
  constructor(private cocktailsService: CocktailsService) {}

  // Admin routes bellow
  @ApiOperation({ summary: 'Create new cocktail' })
  @ApiResponse({ status: 200, type: Cocktails })
  @Post()
  create(@Body() cocktailDto: CreateCocktailDto) {
    return this.cocktailsService.createCocktail(cocktailDto);
  }

  // @UseGuards(JwtAuthGuard)
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

  @ApiOperation({ summary: 'Update cocktail' })
  @ApiResponse({ status: 200, type: UpdateCocktailDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() cocktailDto: CreateCocktailDto) {
    return this.cocktailsService.updateCocktail(id, cocktailDto);
  }

  @ApiOperation({ summary: 'Delete cocktail' })
  @ApiResponse({ status: 200, type: DeleteCocktailDto })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.cocktailsService.deleteCocktail(id);
  }
}
