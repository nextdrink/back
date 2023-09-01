// @ts-nocheck
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import sequelize from 'sequelize';
import { Ingredients } from './ingredients.model';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { Cocktails } from '../cocktails/cocktails.model';
import { Users } from '../users/users.model';

@Injectable()
export class IngredientsService {
  constructor(@InjectModel(Ingredients) private ingredientsRepository: typeof Ingredients) {}

  async createIngredient(dto: CreateIngredientDto) {
    try {
      return await this.ingredientsRepository.create(dto);
    } catch (e) {
      return e.message;
    }
  }

  async getAllIngredients(lang) {
    const nameLangParameter = `name.${lang}`;
    return await this.ingredientsRepository.findAll({
      attributes: {
        include: [
          [sequelize.json(nameLangParameter), 'name'],
          [sequelize.json(`description.${lang}`), 'description'],
        ],
        exclude: ['createdAt', 'updatedAt'],
      },
      where: {
        [nameLangParameter]: {
          [sequelize.Op.ne]: null,
        },
      },
    });
  }

  async getIngredientById(id: number) {
    return await this.ingredientsRepository.findByPk(id, {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
  }

  async getIngredientsByUserId(id: number, lang) {
    return await this.ingredientsRepository.findAll({
      attributes: {
        include: [
          [sequelize.json(`name.${lang}`), 'name'],
          [sequelize.json(`description.${lang}`), 'description'],
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

  async getIngredientsIdsByUserId(id: number) {
    const usersIngredients = await this.ingredientsRepository.findAll({
      attributes: ['id'],
      include: {
        model: Users,
        attributes: [],
        where: { id },
      },
    });
    return usersIngredients.map(({ id }) => id);
  }

  async getAllIngredientInfo(id) {
    const ingredient = await this.ingredientsRepository.findByPk(id, {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: {
        model: Cocktails,
        attributes: ['name', 'img'],
        through: {
          attributes: [],
        },
      },
    });
    return ingredient.toJSON();
  }

  async updateIngredient(id, data) {
    const ingredient = await this.getIngredientById(id);
    if (!ingredient) {
      return `Ingredient with id ${id} not found, update canceled`;
    }
    await ingredient.update({ ...data }, { where: { id } });

    return ingredient;
  }

  async deleteIngredient(id) {
    const result = await this.ingredientsRepository.destroy({ where: { id } });
    let info = `Ingredient with id ${id} `;
    result === 1 ? (info += 'deleted') : (info += 'not found');

    return info;
  }

  async getIngredientIdsByUserId(id) {
    const ingredientIds = await this.ingredientsRepository.findAll({
      raw: true,
      attributes: ['id'],
      include: {
        model: Users,
        where: { id },
        attributes: [],
        through: {
          attributes: [],
        },
      },
    });
    return ingredientIds.map(({ id }) => id);
  }
}
