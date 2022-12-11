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
    const { ingredients } = dto;
    const cocktail = await this.cocktailsRepository.create(dto);

    await addIngredientForCocktail(cocktail, ingredients);

    return cocktail;
  }

  async getAllCocktails(lang: string) {
    const nameLangParameter = `name.${lang}`;
    return await this.cocktailsRepository.findAll({
      raw: true,
      nest: true,
      attributes: {
        include: [
          [sequelize.json(nameLangParameter), 'name'],
          [sequelize.json(`description.${lang}`), 'description'],
          [sequelize.json(`recipe.${lang}`), 'recipe'],
        ],
        exclude: ['id', 'createdAt', 'updatedAt'],
      },
      where: {
        [nameLangParameter]: {
          [sequelize.Op.ne]: null,
        },
      },
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

  async getCocktailsByUserId(id: number) {
    const cocktails = await this.cocktailsRepository.findAll({
      include: {
        model: Users,
        where: { id },
      },
    });
    return cocktails;
  }

  // async getAllCocktailsByIngredientId(id: number) {
  //   const cocktails = await this.cocktailsRepository.findAll({
  //     include: {
  //       model: Ingredients,
  //       where: { id },
  //     },
  //   });
  //   return cocktails;
  // }

  async removeCocktail(id) {
    const result = await this.cocktailsRepository.destroy({ where: { id } });
    let info = `Cocktail with id ${id} `;
    result === 1 ? (info += 'removed') : (info += 'not found');

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
}
