<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run dev

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# start test DB
1. $ npm run test:docker:run

2. add --config ./test/jest-e2e.json

3. create .test.env

# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

Nest is [MIT licensed](LICENSE).


jest config from package.json:

"jest": {
"moduleFileExtensions": [
"js",
"json",
"ts"
],
"rootDir": "src",
"testRegex": ".*\\.spec\\.ts$",
"transform": {
"^.+\\.(t|j)s$": "ts-jest"
},
"collectCoverageFrom": [
"**/*.(t|j)s"
],
"coverageDirectory": "../coverage",
"testEnvironment": "node"
}

##Migration
npx sequelize-cli db:migrate
