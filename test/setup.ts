import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

export let app;
async function initServer() {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();
}

global.beforeAll(async () => {
  await initServer();
});
