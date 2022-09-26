import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { CocktailsModule } from './cocktails/cocktails.module';
import { Cocktails } from './cocktails/cocktails.model';
import { Users } from './users/users.model';
import { IngredientsModule } from './ingredients/ingredients.module';
import { AuthModule } from './auth/auth.module';
import { UserCocktails } from './cocktails/user-cocktails.model';
import { Ingredients } from './ingredients/ingredients.model';
import { IngredientCocktails } from './cocktails/ingredient-cocktails.model';
import { UserIngredients } from './ingredients/user-ingredients.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRESS_HOST,
      port: Number(process.env.POSTGRESS_PORT),
      username: process.env.POSRTGRESS_USER,
      password: process.env.POSRTGRESS_PASSWORD,
      database: process.env.POSRTGRESS_DB,
      models: [
        Cocktails,
        Users,
        UserCocktails,
        Ingredients,
        IngredientCocktails,
        UserIngredients,
      ],
      autoLoadModels: true,
    }),
    UsersModule,
    CocktailsModule,
    IngredientsModule,
    AuthModule,
  ],
  providers: [],
})
export class AppModule {}
