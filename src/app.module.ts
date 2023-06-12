import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { RolesModule } from './roles/roles.module';
import { Roles } from './roles/roles.model';
import { UserRoles } from './roles/user-roles.model';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [
        Cocktails,
        Users,
        UserCocktails,
        Ingredients,
        IngredientCocktails,
        UserIngredients,
        Roles,
        UserRoles,
      ],
      autoLoadModels: true,
      dialectOptions: {
        ssl: true,
        rejectUnauthorized: false,
      },
    }),
    UsersModule,
    CocktailsModule,
    IngredientsModule,
    AuthModule,
    RolesModule,
  ],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
