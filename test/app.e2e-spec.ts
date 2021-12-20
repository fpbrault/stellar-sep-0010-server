/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as StellarSdk from 'stellar-sdk';
import { AppModule } from './../src/app.module';
import { useContainer } from 'class-validator';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env = {
      JWT_SECRET: 'THEJWTSECRETFORTESTS',
      NETWORK: 'TESTNET',
      SERVER_PRIVATE_KEY: StellarSdk.Keypair.random().secret(),
      HOME_DOMAIN: 'stellar.beign.es',
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    useContainer(app, { fallbackOnErrors: true });
    await app.init();
  });

  afterAll(async () => {
    await Promise.all([app.close()]);
  });

  describe('Authentication', () => {
    let jwtToken: string;
    const keypair = StellarSdk.Keypair.random();
    let transaction: string;

    describe('AuthModule', () => {
      it('generates a valid SEP-0010 challenge transaction', async () => {
        const response = await request(app.getHttpServer())
          .get(
            '/auth?account=' + keypair.publicKey(),
            // +'&client_domain=stellar.beign.es',
          )
          .expect(200);

        const data = response.body;
        transaction = data.transaction;
        expect(data).toMatchObject({
          network_passphrase: expect.any(String),
          transaction: expect.any(String),
        });
      });
      it('authenticates user with valid transaction and provides a jwt token', async () => {
        console.log(transaction);

        const xdr = new StellarSdk.Transaction(
          transaction,
          StellarSdk.Networks.TESTNET,
          true,
        );

        xdr.sign(keypair);

        const response = await request(app.getHttpServer())
          .post('/auth')
          .send({
            transaction: xdr.toEnvelope().toXDR('base64'),
          });
        //.expect(201);

        jwtToken = response.body.token;
        console.log(response.body);

        expect(jwtToken).toMatch(
          /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
        );
      });
    });

    describe('Protected', () => {
      it('gets protected resource with jwt authenticated request', async () => {
        const response = await request(app.getHttpServer())
          .get('/profile')
          .set('Authorization', `Bearer ${jwtToken}`)
          .expect(200);

        const data = response.body;
        expect(data).toMatchObject({
          token: expect.objectContaining({
            iss: 'https://stellar.beign.es/auth',
            sub: keypair.publicKey(),
            exp: expect.any(Number),
            iat: expect.any(Number),
          }),
        });
      });
    });
  });
});
