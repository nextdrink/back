import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { app } from './setup';
import { CocktailsService } from '../src/cocktails/cocktails.service';
import { mockCocktail } from './mocked-data';
import { loginAdmin } from './helper';

let token: string;
let createdCocktailId: number;

const cocktailsPath = 'cocktails';

describe('Cocktails Controller (e2e)', () => {
  beforeAll(async () => {
    token = await loginAdmin();
  });

  afterAll(async () => {
    const cocktailsService = app.get(CocktailsService);
    await cocktailsService.cocktailsRepository.destroy({ where: { id: createdCocktailId } });
  });

  describe('Successfully cases', () => {
    it('Should get all cocktails with default lang(en)', async () => {
      return request(app.getHttpServer())
        .get(`/${cocktailsPath}`)
        .expect((response: request.Response) => {
          expect(response.body.length).toBe(2);
          expect(response.body[0].name).toBe(mockCocktail.name.en);
        })
        .expect(HttpStatus.OK);
    });

    it('Should get all cocktails with uk lang', async () => {
      return request(app.getHttpServer())
        .get(`/uk/${cocktailsPath}`)
        .expect((response: request.Response) => {
          expect(response.body.length).toBe(2);
          expect(response.body[0].name).toBe(mockCocktail.name.uk);
        })
        .expect(HttpStatus.OK);
    });

    it('Should get cocktail by id with default lang', async () => {
      return request(app.getHttpServer())
        .get(`/${cocktailsPath}/1`)
        .expect((response: request.Response) => {
          expect(response.body.name).toBe(mockCocktail.name.en);
        })
        .expect(HttpStatus.OK);
    });

    it('Should get all admin cocktails', async () => {
      return request(app.getHttpServer())
        .get(`/${cocktailsPath}/admin/all`)
        .set('Authorization', 'Bearer ' + token)
        .expect((response: request.Response) => {
          expect(response.body.length).toBe(2);
        })
        .expect(HttpStatus.OK);
    });

    it('Should get admin cocktail by id', async () => {
      return request(app.getHttpServer())
        .get(`/${cocktailsPath}/admin/1`)
        .set('Authorization', 'Bearer ' + token)
        .expect((response: request.Response) => {
          expect(response.body.name.en).toBe(mockCocktail.name.en);
        })
        .expect(HttpStatus.OK);
    });

    it('Should create cocktail', async () => {
      return request(app.getHttpServer())
        .post(`/${cocktailsPath}/admin`)
        .send({ ...mockCocktail, name: { en: 'test3', uk: 'тест3' } })
        .set('Authorization', 'Bearer ' + token)
        .expect((response: request.Response) => {
          createdCocktailId = response.body.id;
          expect(response.body.name.en).toBe('test3');
        })
        .expect(HttpStatus.CREATED);
    });

    it('Should update cocktail', async () => {
      return request(app.getHttpServer())
        .put(`/${cocktailsPath}/admin/${createdCocktailId}`)
        .send({ ...mockCocktail, name: { en: 'test33', uk: 'тест33' } })
        .set('Authorization', 'Bearer ' + token)
        .expect((response: request.Response) => {
          expect(response.body.name.en).toBe('test33');
        })
        .expect(HttpStatus.OK);
    });

    it('Should delete cocktail', async () => {
      return request(app.getHttpServer())
        .delete(`/${cocktailsPath}/admin/id/3`)
        .set('Authorization', 'Bearer ' + token)
        .expect((response: request.Response) => {
          console.log(response.body, 'response.body');
        })
        .expect(HttpStatus.OK);
    });
  });

  describe('Failed cases', () => {
    it('Should not get all cocktails with wrong lang', async () => {
      return request(app.getHttpServer())
        .get(`/wrong-lang/${cocktailsPath}`)
        .expect((response: request.Response) => {
          expect(response.body.statusCode).toBe(HttpStatus.NOT_FOUND);
          expect(response.body.error).toBe('Not Found');
        })
        .expect(HttpStatus.NOT_FOUND);
    });

    it('Should not get cocktail by id with wrong lang', async () => {
      return request(app.getHttpServer())
        .get(`/wrong-lang/${cocktailsPath}/1`)
        .expect((response: request.Response) => {
          expect(response.body.statusCode).toBe(HttpStatus.NOT_FOUND);
          expect(response.body.error).toBe('Not Found');
        })
        .expect(HttpStatus.NOT_FOUND);
    });

    it('Should not get all admin cocktails without token', async () => {
      return request(app.getHttpServer())
        .get(`/${cocktailsPath}/admin/all`)
        .expect((response: request.Response) => {
          expect(response.body.statusCode).toBe(HttpStatus.UNAUTHORIZED);
          expect(response.body.message).toBe('Unauthorized');
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Should not get admin cocktail by id without token', async () => {
      return request(app.getHttpServer())
        .get(`/${cocktailsPath}/admin/1`)
        .expect((response: request.Response) => {
          expect(response.body.statusCode).toBe(HttpStatus.UNAUTHORIZED);
          expect(response.body.message).toBe('Unauthorized');
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Should not create cocktail without token', async () => {
      return request(app.getHttpServer())
        .post(`/${cocktailsPath}/admin`)
        .send({ ...mockCocktail, name: { en: 'test3', uk: 'тест3' } })
        .expect((response: request.Response) => {
          expect(response.body.statusCode).toBe(HttpStatus.UNAUTHORIZED);
          expect(response.body.message).toBe('Unauthorized');
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Should not create cocktail with invalid data', async () => {
      return request(app.getHttpServer())
        .post(`/${cocktailsPath}/admin`)
        .send({ ...mockCocktail, name: '' })
        .set('Authorization', 'Bearer ' + token)
        .expect((response: request.Response) => {
          console.log(response.body, 'response.body');
          expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
          expect(response.body.message[0]).toBe('name field is empty');
          expect(response.body.error).toBe('Bad Request');
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('Should not update cocktail without token', async () => {
      return request(app.getHttpServer())
        .put(`/${cocktailsPath}/admin/2`)
        .send({ ...mockCocktail, name: { en: 'test22', uk: 'тест22' } })
        .expect((response: request.Response) => {
          expect(response.body.statusCode).toBe(HttpStatus.UNAUTHORIZED);
          expect(response.body.message).toBe('Unauthorized');
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Should not update cocktail with invalid data', async () => {
      return request(app.getHttpServer())
        .put(`/${cocktailsPath}/admin/2`)
        .send({ ...mockCocktail, name: '' })
        .set('Authorization', 'Bearer ' + token)
        .expect((response: request.Response) => {
          expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
          expect(response.body.error).toBe('Bad Request');
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('Should not delete cocktail without token', async () => {
      return request(app.getHttpServer())
        .delete(`/${cocktailsPath}/admin/id/2`)
        .expect((response: request.Response) => {
          expect(response.body.statusCode).toBe(HttpStatus.UNAUTHORIZED);
          expect(response.body.message).toBe('Unauthorized');
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });
});
