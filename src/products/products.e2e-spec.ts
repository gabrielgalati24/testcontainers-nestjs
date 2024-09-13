import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { prismaService as mockPrismaService } from '../../test/setupTests.e2e';
import { PrismaService } from '../prisma/prisma.service';
import { ProductsRepository } from './products.repository';

describe('ProductsController (e2e)', () => {
  let app: INestApplication;
  let productId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [ProductsService, PrismaService, ProductsRepository],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/POST products (should create a product)', async () => {
    const createProductDto = {
      name: 'Laptop',
      description: 'A high-performance laptop',
      price: 1500,
      stock: 10,
    };

    const response = await request(app.getHttpServer())
      .post('/products')
      .send(createProductDto)
      .expect(201);

    productId = response.body.id;

    expect(response.body).toEqual({
      id: expect.any(Number),
      name: 'Laptop',
      description: 'A high-performance laptop',
      price: 1500,
      stock: 10,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('/GET products (should return an array of products)', async () => {
    const response = await request(app.getHttpServer())
      .get('/products')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/GET products/:id (should return a single product)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/products/${productId}`)
      .expect(200);

    expect(response.body).toEqual({
      id: productId,
      name: 'Laptop',
      description: 'A high-performance laptop',
      price: 1500,
      stock: 10,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('/PATCH products/:id (should update a product)', async () => {
    const updateProductDto = {
      price: 1600,
    };

    const response = await request(app.getHttpServer())
      .patch(`/products/${productId}`)
      .send(updateProductDto)
      .expect(200);

    expect(response.body).toEqual({
      id: productId,
      name: 'Laptop',
      description: 'A high-performance laptop',
      price: 1600,
      stock: 10,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });
});
