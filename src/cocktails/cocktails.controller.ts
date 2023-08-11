import {
  Controller,
  Post,
  Get,
  Body,
  Delete,
  Param,
  Put,
  Response,
  UseGuards,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { CocktailsService } from './cocktails.service';
import { S3Service } from '../aws-s3/s3.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Cocktails } from './cocktails.model';
import { DeleteCocktailDto, UpdateCocktailDto } from './dto/actions-cocktail.dto';
import { languages, defaultLang, ROLES } from '../constants';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles-auth.decorator';
import { GetAllAdminCocktailsDto } from './dto/get-all-admin-cocktails.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@ApiTags('Cocktails')
@Controller(`:lang(${languages.join('|')})?/cocktails`)
export class CocktailsController {
  constructor(private cocktailsService: CocktailsService, private s3Service: S3Service) {}

  @ApiOperation({ summary: 'Get all cocktails' })
  @ApiOkResponse({ type: [Cocktails] })
  @Get()
  getAll(@Param('lang') lang = defaultLang) {
    return this.cocktailsService.getAllCocktails(lang);
  }

  @ApiOperation({ summary: 'Get cocktail' })
  @ApiOkResponse({ type: Cocktails })
  @Get(':id')
  async getCocktail(@Param('id') id, @Param('lang') lang = defaultLang, @Response() res) {
    const cocktailObjectDB = await this.cocktailsService.getCocktailById(id);
    const cocktail = cocktailObjectDB?.toJSON();

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
  @ApiOperation({ summary: 'Get all cocktails for the admin panel' })
  @ApiOkResponse({ type: [GetAllAdminCocktailsDto] })
  @Get('/admin/all')
  async getAdminAll(@Param('lang') lang = defaultLang) {
    return this.cocktailsService.getAllAdminCocktails(lang);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  @ApiOperation({ summary: 'Get a cocktail for editing in the admin panel' })
  @ApiOkResponse({ type: CreateCocktailDto })
  @Get('/admin/:id')
  async getAdminCocktail(@Param('id') id, @Response() res) {
    const cocktailObjectDB = await this.cocktailsService.getCocktailById(id);
    const cocktail = cocktailObjectDB?.toJSON();

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

  // @UseGuards(JwtGuard, RolesGuard)
  // @Roles(ROLES.ADMIN)
  @ApiOperation({ summary: 'Create new cocktail' })
  @ApiOkResponse({ type: Cocktails })
  @Post('/admin')
  create(@Body() cocktailDto: CreateCocktailDto) {
    return this.cocktailsService.createCocktail(cocktailDto);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  @ApiOperation({ summary: 'Update cocktail' })
  @ApiOkResponse({ type: UpdateCocktailDto })
  @Put('/admin/:id')
  update(@Param('id') id: string, @Body() cocktailDto: CreateCocktailDto) {
    return this.cocktailsService.updateCocktail(id, cocktailDto);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  @ApiOperation({ summary: 'Delete cocktail' })
  @ApiOkResponse({ type: DeleteCocktailDto })
  @Delete('admin/:id')
  delete(@Param('id') id: string) {
    return this.cocktailsService.deleteCocktail(id);
  }

  // @UseGuards(JwtGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('/admin/upload-file')
  async addImageToRecipe(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return await this.s3Service.uploadFile(file, file.originalname);
  }
}
