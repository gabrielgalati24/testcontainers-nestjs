import { Injectable } from '@nestjs/common';

import { Product, Prisma } from '@prisma/client';
import { PrismaService } from '../../src/prisma/prisma.service';
@Injectable()
export class ProductsRepository {
  constructor(private prisma: PrismaService) {}

  async createProduct(data: Prisma.ProductCreateInput): Promise<Product> {
    return this.prisma.product.create({
      data,
    });
  }

  async findAllProducts(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  async findProductById(id: number): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async updateProduct(
    id: number,
    data: Prisma.ProductUpdateInput,
  ): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async deleteProduct(id: number): Promise<Product> {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
