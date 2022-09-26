import { Module } from '@nestjs/common';
import { IngredientsController } from './ingredients.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Cocktails } from '../cocktails/cocktails.model';
import { IngredientsService } from './ingredients.service';
import { Ingredients } from './ingredients.model';
import { IngredientCocktails } from '../cocktails/ingredient-cocktails.model';
import { UserIngredients } from './user-ingredients.model';

@Module({
  controllers: [IngredientsController],
  providers: [IngredientsService],
  imports: [
    SequelizeModule.forFeature([Ingredients, Cocktails, IngredientCocktails, UserIngredients]),
  ],
  exports: [IngredientsService],
})
export class IngredientsModule {}
