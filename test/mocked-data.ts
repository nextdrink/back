import { statusEnum } from '../src/users/enums/status.enum';

export const mockUser = {
  email: 'testd@test.com',
  password: '1234567yO',
};

export const mockActiveUser = {
  email: 'test-active@test.com',
  password: '1234567yO',
};

export const changedPassword = '1234567yO1';

export const mockAdminUser = {
  email: 'admin@test.com',
  password: '1234567yO',
  status: statusEnum.active,
};

export const mockCocktail = {
  name: {
    en: 'test1',
    uk: 'тест1',
  },
  description: {
    en: 'Famous cockta',
    uk: 'Відомий коктей',
  },
  recipe: {
    en: {
      '1': 'Fill collins with ice cubes to the top',
      '2': 'Pour 50 ml of vodka',
    },
    uk: {
      '1': 'Наповни колінз кубиками льоду догори',
      '2': 'Налий горілку 50 мл',
    },
  },
  img: 'http://sdfasdf.com',
  strength: 'Alcohol',
  taste: 'sweet',
  base: 'Vodka',
  group: 'Classic',
  series: 'HZ',
  color: 'Orange',
  method: 'Mix build',
  ingredients: [
    {
      id: 1,
      amount: 50,
    },
  ],
};

export const mockIngredient = {
  name: {
    en: 'Whisky43',
    uk: 'Віскі',
  },
  description: {
    en: 'Classik alko',
    uk: 'Класичний алкоголь',
  },
  img: 'https://iasd3efk.images.com',
  strength: 'alcohol',
  taste: 'sweet',
  base: 'grain',
};
