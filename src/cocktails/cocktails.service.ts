// @ts-nocheck
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import sequelize from 'sequelize';
import { Cocktails } from './cocktails.model';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { Users } from '../users/users.model';
import { Ingredients } from '../ingredients/ingredients.model';
import { IngredientsService } from '../ingredients/ingredients.service';

@Injectable()
export class CocktailsService {
  constructor(
    @InjectModel(Cocktails)
    private cocktailsRepository: typeof Cocktails,
    private ingredientsRepository: IngredientsService,
  ) {}

  async createCocktail(dto: CreateCocktailDto) {
    const cocktail = await this.cocktailsRepository.create(dto);

    const { ingredients } = dto;
    await this.addIngredientForCocktail(cocktail, ingredients);

    return this.getCocktailById(cocktail.id);
  }

  async getAllCocktails(lang: string) {
    const nameLangParameter = `name.${lang}`;
    return await this.cocktailsRepository.findAll({
      attributes: [
        'id',
        [sequelize.json(nameLangParameter), 'name'],
        'img',
        'strength',
        'taste',
        'base',
        'group',
        'series',
        'color',
        'method',
      ],
      where: {
        [nameLangParameter]: {
          [sequelize.Op.ne]: null,
        },
      },
    });
  }

  async getAllAdminCocktails(lang: string) {
    return await this.cocktailsRepository.findAll({
      attributes: ['id', [sequelize.json(`name.${lang}`), 'name'], 'img'],
      order: [['id', 'DESC']],
    });
  }

  async getCocktailById(id: number) {
    return await this.cocktailsRepository.findByPk(id, {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
        {
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          model: Ingredients,
          through: {
            attributes: ['amount'],
            as: 'value',
          },
        },
      ],
    });
  }

  async getCocktailsByUserId(id: number, lang) {
    return await this.cocktailsRepository.findAll({
      attributes: {
        include: [
          [sequelize.json(`name.${lang}`), 'name'],
          [sequelize.json(`description.${lang}`), 'description'],
          [sequelize.json(`recipe.${lang}`), 'recipe'],
        ],
        exclude: ['createdAt', 'updatedAt'],
      },
      include: {
        model: Users,
        where: { id },
        through: {
          attributes: [],
        },
      },
    });
  }

  async getCocktailsIdsByUserId(id: number) {
    const usersCocktails = await this.cocktailsRepository.findAll({
      attributes: ['id'],
      include: {
        model: Users,
        attributes: [],
        where: { id },
      },
    });

    return usersCocktails.map(({ id }) => id);
  }

  async deleteCocktail(id) {
    const result = await this.cocktailsRepository.destroy({ where: { id } });
    let info = `Cocktail with id ${id} `;
    result === 1 ? (info += 'deleted') : (info += 'not found');

    return info;
  }

  async updateCocktail(id, data) {
    const cocktail = await this.getCocktailById(id);
    if (!cocktail) {
      return `Cocktail with id ${id} not found, update canceled`;
    }
    for (const { id } of cocktail.ingredients) {
      await cocktail.$remove('ingredients', id);
    }
    await this.addIngredientForCocktail(cocktail, data.ingredients);

    await cocktail.update({ ...data }, { where: { id } });

    return this.getCocktailById(id);
  }

  async addIngredientForCocktail(cocktail, ingredients) {
    for (const { id, amount } of ingredients) {
      const ingredient = await this.ingredientsRepository.getIngredientById(id);
      if (ingredient) {
        const ingredientCocktails = await cocktail.$add('ingredients', id);
        await ingredientCocktails[0].update({ amount });
      }
    }
  }

  async getCocktailsFromMyIngredients(userId, lang) {
    const ingredientIds = await this.ingredientsRepository.getIngredientIdsByUserId(userId);
    if (!ingredientIds.length) return [];

    const myCocktails = await this.cocktailsRepository.sequelize.query(
      `select c.id, c.name->'${lang}' as name, c.img
        from cocktails c
        join ingredient_cocktails ic on c.id = ic."cocktailId" 
        where "ingredientId" IN (${ingredientIds.join()})
        group by c.id
        having count(*) = (
          select count(*)
          from ingredient_cocktails
          where "cocktailId" = c.id
        )`,
    );
    return myCocktails[0];
  }
}
