import request from 'supertest';
import { app } from './setup';
import { HttpStatus } from '@nestjs/common';

describe('AppController (e2e)', () => {
  it('/ (GET) should return 404', () => {
    return request(app.getHttpServer()).get('/api').expect(HttpStatus.NOT_FOUND);
  });
});
