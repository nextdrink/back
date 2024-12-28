import { forwardRef, Module } from '@nestjs/common';
import { IngredientsController } from './ingredients.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Cocktails } from '../cocktails/cocktails.model';
import { IngredientsService } from './ingredients.service';
import { Ingredients } from './ingredients.model';
import { IngredientCocktails } from '../cocktails/ingredient-cocktails.model';
import { UserIngredients } from './user-ingredients.model';
import { UsersModule } from '../users/users.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  controllers: [IngredientsController],
  providers: [IngredientsService],
  imports: [
    CloudinaryModule,
    SequelizeModule.forFeature([Ingredients, Cocktails, IngredientCocktails, UserIngredients]),
    forwardRef(() => UsersModule),
  ],
  exports: [IngredientsService],
})
export class IngredientsModule {}
