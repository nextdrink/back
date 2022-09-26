import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { Ingredients } from './ingredients.model';

@ApiTags('Ingredients')
@Controller('/ingredients')
export class IngredientsController {
  constructor(private ingredientsService: IngredientsService) {}

  @ApiOperation({ summary: 'Create new cocktail' })
  @ApiResponse({ status: 200, type: Ingredients })
  @Post()
  create(@Body() ingredientDto: CreateIngredientDto) {
    return this.ingredientsService.createIngredient(ingredientDto);
  }

  @ApiOperation({ summary: 'Get ingredient with all info' })
  @ApiResponse({ status: 200, type: [Ingredients] })
  @Get(':id')
  getIngredient(@Param('id') id: string) {
    return this.ingredientsService.getAllIngredientInfo(id);
  }
}
