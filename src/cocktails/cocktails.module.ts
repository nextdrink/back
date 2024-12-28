import { forwardRef, Module } from '@nestjs/common';
import { CocktailsService } from './cocktails.service';
import { CocktailsController } from './cocktails.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Cocktails } from './cocktails.model';
import { UserCocktails } from './user-cocktails.model';
import { Users } from '../users/users.model';
import { Ingredients } from '../ingredients/ingredients.model';
import { IngredientCocktails } from './ingredient-cocktails.model';
import { IngredientsModule } from '../ingredients/ingredients.module';
import { UsersModule } from '../users/users.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  providers: [CocktailsService],
  controllers: [CocktailsController],
  imports: [
    IngredientsModule,
    CloudinaryModule,
    SequelizeModule.forFeature([Cocktails, Users, UserCocktails, Ingredients, IngredientCocktails]),
    forwardRef(() => UsersModule),
  ],
  exports: [CocktailsService],
})
export class CocktailsModule {}
