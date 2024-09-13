import { Injectable } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { CreateProductDto } from './dto/create-product.dto'; // Importa el DTO de creación
import { UpdateProductDto } from './dto/update-product.dto'; // Importa el DTO de actualización

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async createProduct(createProductDto: CreateProductDto) {
    return this.productsRepository.createProduct(createProductDto);
  }

  async getAllProducts() {
    return this.productsRepository.findAllProducts();
  }

  async getProductById(id: number) {
    return this.productsRepository.findProductById(id);
  }

  async updateProduct(id: number, updateProductDto: UpdateProductDto) {
    return this.productsRepository.updateProduct(id, updateProductDto);
  }

  async deleteProduct(id: number) {
    return this.productsRepository.deleteProduct(id);
  }
}
