import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { app } from './setup';
import { IngredientsService } from '../src/ingredients/ingredients.service';
import { mockIngredient } from './mocked-data';
import { loginAdmin } from './helper';

let token: string;
let createdIngredientId: number;
const ingredientsPath = 'ingredients';

describe('Ingredients Controller (e2e)', () => {
  beforeAll(async () => {
    token = await loginAdmin();
  });

  afterAll(async () => {
    const ingredientsService = app.get(IngredientsService);
    await ingredientsService.ingredientsRepository.destroy({
      where: { id: createdIngredientId },
    });
  });

  describe('Successfully cases', () => {
    it('Should get all ingredients with default lang(en)', async () => {
      return request(app.getHttpServer())
        .get(`/${ingredientsPath}`)
        .expect((response: request.Response) => {
          expect(response.body.length).toBe(2);
          expect(response.body[0].name).toBe(mockIngredient.name.en);
        })
        .expect(HttpStatus.OK);
    });

    it('Should get all ingredients with uk lang', async () => {
      return request(app.getHttpServer())
        .get(`/uk/${ingredientsPath}`)
        .expect((response: request.Response) => {
          expect(response.body.length).toBe(2);
          expect(response.body[0].name).toBe(mockIngredient.name.uk);
        })
        .expect(HttpStatus.OK);
    });

    it('Should get ingredient by id with default lang', async () => {
      return request(app.getHttpServer())
        .get(`/${ingredientsPath}/1`)
        .expect((response: request.Response) => {
          expect(response.body.name).toBe(mockIngredient.name.en);
        })
        .expect(HttpStatus.OK);
    });

    it('Should get all admin ingredients', async () => {
      return request(app.getHttpServer())
        .get(`/${ingredientsPath}/admin/all`)
        .set('Authorization', 'Bearer ' + token)
        .expect((response: request.Response) => {
          expect(response.body.length).toBe(2);
        })
        .expect(HttpStatus.OK);
    });

    it('Should get admin ingredient by id', async () => {
      return request(app.getHttpServer())
        .get(`/${ingredientsPath}/admin/1`)
        .set('Authorization', 'Bearer ' + token)
        .expect((response: request.Response) => {
          expect(response.body.name.en).toBe(mockIngredient.name.en);
        })
        .expect(HttpStatus.OK);
    });

    it('Should create ingredient', async () => {
      return request(app.getHttpServer())
        .post(`/${ingredientsPath}/admin`)
        .send({ ...mockIngredient, name: { en: 'test3', uk: 'тест3' } })
        .set('Authorization', 'Bearer ' + token)
        .expect((response: request.Response) => {
          createdIngredientId = response.body.id;
          expect(response.body.name.en).toBe('test3');
        })
        .expect(HttpStatus.CREATED);
    });

    it('Should update ingredient', async () => {
      return request(app.getHttpServer())
        .put(`/${ingredientsPath}/admin/${createdIngredientId}`)
        .send({ ...mockIngredient, name: { en: 'test33', uk: 'тест33' } })
        .set('Authorization', 'Bearer ' + token)
        .expect((response: request.Response) => {
          expect(response.body.name.en).toBe('test33');
        })
        .expect(HttpStatus.OK);
    });

    it('Should delete ingredient', async () => {
      return request(app.getHttpServer())
        .delete(`/${ingredientsPath}/admin/id/3`)
        .set('Authorization', 'Bearer ' + token)
        .expect((response: request.Response) => {
          console.log(response.body, 'response.body');
        })
        .expect(HttpStatus.OK);
    });
  });

  describe('Failed cases', () => {
    it('Should not get all ingredients with wrong lang', async () => {
      return request(app.getHttpServer())
        .get(`/wrong-lang/${ingredientsPath}`)
        .expect((response: request.Response) => {
          expect(response.body.statusCode).toBe(HttpStatus.NOT_FOUND);
          expect(response.body.error).toBe('Not Found');
        })
        .expect(HttpStatus.NOT_FOUND);
    });

    it('Should not get ingredient by id with wrong lang', async () => {
      return request(app.getHttpServer())
        .get(`/wrong-lang/${ingredientsPath}/1`)
        .expect((response: request.Response) => {
          expect(response.body.statusCode).toBe(HttpStatus.NOT_FOUND);
          expect(response.body.error).toBe('Not Found');
        })
        .expect(HttpStatus.NOT_FOUND);
    });

    it('Should not get all admin ingredients without token', async () => {
      return request(app.getHttpServer())
        .get(`/${ingredientsPath}/admin/all`)
        .expect((response: request.Response) => {
          expect(response.body.statusCode).toBe(HttpStatus.UNAUTHORIZED);
          expect(response.body.message).toBe('Unauthorized');
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Should not get admin ingredient by id without token', async () => {
      return request(app.getHttpServer())
        .get(`/${ingredientsPath}/admin/1`)
        .expect((response: request.Response) => {
          expect(response.body.statusCode).toBe(HttpStatus.UNAUTHORIZED);
          expect(response.body.message).toBe('Unauthorized');
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Should not create ingredient without token', async () => {
      return request(app.getHttpServer())
        .post(`/${ingredientsPath}/admin`)
        .send({ ...mockIngredient, name: { en: 'test3', uk: 'тест3' } })
        .expect((response: request.Response) => {
          expect(response.body.statusCode).toBe(HttpStatus.UNAUTHORIZED);
          expect(response.body.message).toBe('Unauthorized');
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Should not create ingredient with invalid data', async () => {
      return request(app.getHttpServer())
        .post(`/${ingredientsPath}/admin`)
        .send({ ...mockIngredient, name: '' })
        .set('Authorization', 'Bearer ' + token)
        .expect((response: request.Response) => {
          console.log(response.body, 'response.body');
          expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
          expect(response.body.message[0]).toBe('name field is not correct object');
          expect(response.body.error).toBe('Bad Request');
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('Should not update ingredient without token', async () => {
      return request(app.getHttpServer())
        .put(`/${ingredientsPath}/admin/2`)
        .send({ ...mockIngredient, name: { en: 'test22', uk: 'тест22' } })
        .expect((response: request.Response) => {
          expect(response.body.statusCode).toBe(HttpStatus.UNAUTHORIZED);
          expect(response.body.message).toBe('Unauthorized');
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Should not update ingredient with invalid data', async () => {
      return request(app.getHttpServer())
        .put(`/${ingredientsPath}/admin/2`)
        .send({ ...mockIngredient, name: '' })
        .set('Authorization', 'Bearer ' + token)
        .expect((response: request.Response) => {
          expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
          expect(response.body.error).toBe('Bad Request');
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('Should not delete ingredient without token', async () => {
      return request(app.getHttpServer())
        .delete(`/${ingredientsPath}/admin/id/2`)
        .expect((response: request.Response) => {
          expect(response.body.statusCode).toBe(HttpStatus.UNAUTHORIZED);
          expect(response.body.message).toBe('Unauthorized');
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });
});
