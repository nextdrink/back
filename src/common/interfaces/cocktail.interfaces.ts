export interface IngredientCocktail {
  id: number;
  amount: number;
  required: boolean;
  unit: string;
}

export interface IngredientCocktailFromDb {
  name: string;
  description: string;
  value: { amount: number; required: boolean; unit: string };
}