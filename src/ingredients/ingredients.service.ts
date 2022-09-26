import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Ingredients } from './ingredients.model';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { Cocktails } from '../cocktails/cocktails.model';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectModel(Ingredients) private ingredientsRepository: typeof Ingredients,
  ) {}

  async createIngredient(dto: CreateIngredientDto) {
    return await this.ingredientsRepository.create(dto);
  }

  async getIngredientById(id: number) {
    return await this.ingredientsRepository.findByPk(id);
  }

  async getAllIngredientInfo(id) {
    return await this.ingredientsRepository.findByPk(id, {
      include: {
        model: Cocktails,
      },
    });
  }
}
