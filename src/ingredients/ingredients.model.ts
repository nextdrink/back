import { Model, DataType, Table, Column, BelongsToMany } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { IngredientCocktails } from '../cocktails/ingredient-cocktails.model';
import { Cocktails } from '../cocktails/cocktails.model';
import { Users } from '../users/users.model';
import { UserIngredients } from './user-ingredients.model';

interface IngredientCreationAttr {
  name: string;
  description: string;
  img: string;
  strength: string;
  base: string;
  taste: string;
}

@Table({ tableName: 'ingredients' })
export class Ingredients extends Model<Ingredients, IngredientCreationAttr> {
  @ApiProperty({ example: 1, description: 'Id' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: { en: 'Vodka', ua: 'Горілка' } })
  @Column({ type: DataType.JSONB, unique: true, allowNull: false })
  name: string;

  @ApiProperty({
    example: {
      en: 'A strong alcoholic drink made from purified spirit',
      ua: 'Міцний алкогольний напій з очищеного спирту',
    },
  })
  @Column({ type: DataType.JSONB })
  description: string;

  @ApiProperty({ example: 'https://iasd3efk.images.com' })
  @Column({ type: DataType.STRING })
  img: string;

  @ApiProperty({ example: 'Alcohol' })
  @Column({ type: DataType.STRING, allowNull: false })
  type: string;

  // @ApiProperty({ example: 'Cherry' })
  // @Column({ type: DataType.STRING, allowNull: false })
  // base: string;

  @ApiProperty({ example: 'Bitter' })
  @Column({ type: DataType.STRING })
  taste: string;

  @BelongsToMany(() => Cocktails, () => IngredientCocktails)
  cocktails: Cocktails[];

  @BelongsToMany(() => Users, () => UserIngredients)
  users: Users[];
}
