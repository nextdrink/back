import { Express } from 'express';
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
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { CocktailsService } from './cocktails.service';
import { GoogleCloudService } from '../google-cloud/google-cloud.service';
import { Cocktails } from './cocktails.model';
import { DeleteCocktailDto, DeleteCocktailImgDto, UpdateCocktailDto } from './dto/actions-cocktail.dto';
import { languages, defaultLang, ROLES, MEDIA_STORAGE_FOLDERS } from '../constants';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles-auth.decorator';
import { GetAllAdminCocktailsDto } from './dto/get-all-admin-cocktails.dto';

@ApiTags('Cocktails')
@Controller(`:lang(${languages.join('|')})?/cocktails`)
export class CocktailsController {
  constructor(private cocktailsService: CocktailsService, private googleCloudService: GoogleCloudService) {}

  @ApiOperation({ summary: 'Get all cocktails' })
  @ApiOkResponse({ type: [Cocktails] })
  @Get()
  getAll(@Param('lang') lang = defaultLang) {
    return this.cocktailsService.getAllCocktails(lang);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get cocktail' })
  @ApiOkResponse({ type: Cocktails })
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

  @Get('/admin/all')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  @ApiOperation({ summary: 'Get all cocktails for the admin panel' })
  @ApiOkResponse({ type: [GetAllAdminCocktailsDto] })
  async getAdminAll(@Param('lang') lang = defaultLang) {
    return this.cocktailsService.getAllAdminCocktails(lang);
  }

  @Get('/admin/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  @ApiOperation({ summary: 'Get a cocktail for editing in the admin panel' })
  @ApiOkResponse({ type: CreateCocktailDto })
  async getAdminCocktail(@Param('id') id, @Response() res) {
    const cocktailObjectDB = await this.cocktailsService.getCocktailById(id);
    const cocktail = cocktailObjectDB?.toJSON();

    if (!cocktail) {
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).send(`Cocktails with id ${id} not found`);
    }

    // @ts-ignore
    const ingredients = cocktail.ingredients.map(({ id, value: { amount, required, unit } }) => {
      return { id, amount, required, unit };
    });

    const cocktailModifiedIngredients = {
      ...cocktail,
      ingredients,
    };

    return res.json(cocktailModifiedIngredients);
  }

  @Post('/admin')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  @ApiOperation({ summary: 'Create new cocktail' })
  @ApiOkResponse({ type: Cocktails })
  create(@Body(new ValidationPipe()) cocktailDto: CreateCocktailDto) {
    return this.cocktailsService.createCocktail(cocktailDto);
  }

  @Put('/admin/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  @ApiOperation({ summary: 'Update cocktail' })
  @ApiOkResponse({ type: UpdateCocktailDto })
  update(@Param('id') id: string, @Body(new ValidationPipe()) cocktailDto: CreateCocktailDto) {
    return this.cocktailsService.updateCocktail(id, cocktailDto);
  }

  @Delete('admin/id/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  @ApiOperation({ summary: 'Delete cocktail' })
  @ApiOkResponse({ type: DeleteCocktailDto })
  delete(@Param('id') id: string) {
    return this.cocktailsService.deleteCocktail(id);
  }

  @Post('/admin/upload-file')
  // @UseGuards(JwtGuard, RolesGuard)
  // @Roles(ROLES.ADMIN)
  @ApiOkResponse({ description: 'https://test.com/mops-pes.png' })
  @ApiOperation({ summary: 'Upload image for cocktail' })
  @UseInterceptors(FileInterceptor('file'))
  async addImageToCocktail(@UploadedFile() file: Express.Multer.File) {
    return await this.googleCloudService.uploadFile(MEDIA_STORAGE_FOLDERS.COCKTAILS, file);
  }

  @Delete('/admin/delete-file')
  // @UseGuards(JwtGuard, RolesGuard)
  // @Roles(ROLES.ADMIN)
  @ApiOkResponse({
    description: "Successfully removed https://test.com/mops-pes.png or file doesn't exist",
  })
  @ApiOperation({ summary: 'Delete cocktail image' })
  async deleteImageFromCocktail(@Body() deleteCocktailImageDto: DeleteCocktailImgDto) {
    const { fileName } = deleteCocktailImageDto;
    return await this.googleCloudService.deleteFile(`${MEDIA_STORAGE_FOLDERS.COCKTAILS}/${fileName}`);
  }
}
