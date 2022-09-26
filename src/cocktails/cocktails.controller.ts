import { Controller, Post, Get, Body, Delete, Param, UseGuards } from '@nestjs/common';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { CocktailsService } from './cocktails.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Cocktails } from './cocktails.model';
import { RemoveCocktailDto } from './dto/remove-cocktail.dto';
const languages = ['en', 'uk', 'ru'];
const defaultLang = languages[0];

@ApiTags('Cocktails')
@Controller(`:lang(${languages.join('|')})?/cocktails`)
export class CocktailsController {
  constructor(private cocktailsService: CocktailsService) {}

  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all cocktails' })
  @ApiResponse({ status: 200, type: [Cocktails] })
  @Get()
  async getAll(@Param('lang') lang = defaultLang) {
    // TODO refactor this shit
    const cocktails = JSON.stringify(await this.cocktailsService.getAllCocktails(lang));

    return JSON.parse(cocktails).map((cocktail) => {
      return { ...cocktail, name: cocktail.name[lang] };
    });
  }

  @ApiOperation({ summary: 'Get cocktail' })
  @ApiResponse({ status: 200, type: Cocktails })
  @Get(':id')
  getCocktail(@Param('id') id, @Param('lang') lang = defaultLang) {
    console.log(lang);
    return this.cocktailsService.getCocktailById(id);
  }

  // Admin routes bellow
  @ApiOperation({ summary: 'Create new cocktail' })
  @ApiResponse({ status: 200, type: Cocktails })
  @Post()
  create(@Body() cocktailDto: CreateCocktailDto) {
    return this.cocktailsService.createCocktail(cocktailDto);
  }

  @ApiOperation({ summary: 'Remove cocktails' })
  @ApiResponse({ status: 200, type: RemoveCocktailDto })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cocktailsService.removeCocktail(id);
  }
}
