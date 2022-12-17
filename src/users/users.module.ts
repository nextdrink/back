import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Users } from './users.model';
import { Cocktails } from '../cocktails/cocktails.model';
import { UserCocktails } from '../cocktails/user-cocktails.model';
import { CocktailsModule } from '../cocktails/cocktails.module';
import { UserIngredients } from '../ingredients/user-ingredients.model';
import { IngredientsModule } from '../ingredients/ingredients.module';
import { Roles } from '../roles/roles.model';
import { RolesModule } from '../roles/roles.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    CocktailsModule,
    IngredientsModule,
    SequelizeModule.forFeature([Users, Cocktails, UserCocktails, UserIngredients, Roles]),
    RolesModule,
  ],
  exports: [UsersService],
})
export class UsersModule {}
