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
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { Ingredients } from './ingredients.model';
import { languages, defaultLang, ROLES, MEDIA_STORAGE_FOLDERS } from '../constants';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles-auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { DeleteIngredientImgDto } from './dto/actions-ingredients.dto';

@ApiTags('Ingredients')
@Controller(`:lang(${languages.join('|')})?/ingredients`)
export class IngredientsController {
  constructor(private ingredientsService: IngredientsService, private cloudinaryService: CloudinaryService) {}

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
  create(@Body(new ValidationPipe()) ingredientDto: CreateIngredientDto) {
    return this.ingredientsService.createIngredient(ingredientDto);
  }

  @Get('/admin/all')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  @ApiOperation({ summary: 'Get ingredients for admin section' })
  @ApiOkResponse({ type: [Ingredients] })
  async get() {
    const ingredients = await this.ingredientsService.getAllIngredients(defaultLang);

    return ingredients.map(({ id, name, img }) => {
      return { id, name, img };
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
  edit(@Param('id') id: string, @Body(new ValidationPipe()) ingredientDto: CreateIngredientDto) {
    return this.ingredientsService.updateIngredient(id, ingredientDto);
  }

  @Delete('/admin/id/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  @ApiOperation({ summary: 'Delete ingredient' })
  @ApiOkResponse({ type: Ingredients })
  deleteIngredient(@Param('id') id: string) {
    return this.ingredientsService.deleteIngredient(id);
  }

  @Post('/admin/upload-file')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  @ApiOkResponse({ description: 'https://test.com/mops-pes.png' })
  @ApiOperation({ summary: 'Upload image for ingredient' })
  @UseInterceptors(FileInterceptor('file'))
  async addImageToIngredient(@UploadedFile() file: Express.Multer.File) {
    return await this.cloudinaryService.uploadFile(MEDIA_STORAGE_FOLDERS.INGREDIENTS, file);
  }

  @Delete('/admin/delete-file')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  @ApiOkResponse({
    description: "Successfully removed https://test.com/mops-pes.png or file doesn't exist",
  })
  @ApiOperation({ summary: 'Delete ingredient image' })
  async deleteImageFromIngredient(@Body() deleteCocktailImageDto: DeleteIngredientImgDto) {
    const { fileName } = deleteCocktailImageDto;
    return await this.cloudinaryService.deleteFile(`${MEDIA_STORAGE_FOLDERS.INGREDIENTS}/${fileName}`);
  }
}
