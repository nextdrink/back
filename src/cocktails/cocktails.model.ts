import { Model, DataType, Table, Column, BelongsToMany } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { UserCocktails } from './user-cocktails.model';
import { Users } from '../users/users.model';
import { Ingredients } from '../ingredients/ingredients.model';
import { IngredientCocktails } from './ingredient-cocktails.model';

interface CocktailCreationAttr {
  name: string;
  image: string;
  base: string;
  strength: string;
  taste: string;
  group: string;
  series: string;
  color: string;
  method: string;
}

@Table({ tableName: 'cocktails' })
export class Cocktails extends Model<Cocktails, CocktailCreationAttr> {
  @ApiProperty({ example: 1 })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: '{"en":"Screw","ru":"Отвертка"}' })
  @Column({ type: DataType.JSONB, unique: true, allowNull: false })
  name: string;

  @ApiProperty({ example: '{"en":"Famous cocktail","ru":"Известный коктейль"}' })
  @Column({ type: DataType.JSONB })
  description: string;

  @ApiProperty({ example: '{"en":{1:"",2:""},"ru":{1:"",2:""}}' })
  @Column({ type: DataType.JSONB })
  recipe: string;

  @ApiProperty({ example: 'https://iasd3efk.images.com' })
  @Column({ type: DataType.STRING })
  img: string;

  @ApiProperty({ example: 'Alcohol' })
  @Column({ type: DataType.STRING, allowNull: false })
  strength: string;

  @ApiProperty({ example: 'Bitter' })
  @Column({ type: DataType.STRING, allowNull: false })
  taste: string;

  @ApiProperty({ example: 'Gin' })
  @Column({ type: DataType.STRING, allowNull: false })
  base: string;

  @ApiProperty({ example: 'Classic' })
  @Column({ type: DataType.STRING, allowNull: false })
  group: string;

  @ApiProperty({ example: 'Negroni' })
  @Column({ type: DataType.STRING, allowNull: false })
  series: string;

  @ApiProperty({ example: 'Red' })
  @Column({ type: DataType.STRING, allowNull: false })
  color: string;

  @ApiProperty({ example: 'Mix build' })
  @Column({ type: DataType.STRING, allowNull: false })
  method: string;

  @BelongsToMany(() => Users, () => UserCocktails)
  users: Users[];

  @BelongsToMany(() => Ingredients, () => IngredientCocktails)
  ingredients: Ingredients[];
}
