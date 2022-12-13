// @ts-nocheck
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Ingredients } from './ingredients.model';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { Cocktails } from '../cocktails/cocktails.model';
import sequelize from 'sequelize';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectModel(Ingredients) private ingredientsRepository: typeof Ingredients,
  ) {}

  async createIngredient(dto: CreateIngredientDto) {
    return await this.ingredientsRepository.create(dto);
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
    return await this.ingredientsRepository.findByPk(id);
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
}
