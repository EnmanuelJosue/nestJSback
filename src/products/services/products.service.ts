import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from '../dtos/products.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  findAll() {
    return this.productRepo.find();
  }

  findOne(id: number) {
    const product = this.productRepo.findOne(id);
    if (!product) {
      throw new NotFoundException(`Product ${id} not found`);
    }
    return product;
  }

  // create(payload: CreateProductDto) {
  //   console.log(payload);

  //   this.counterId += 1;
  //   const newProduct = {
  //     id: this.counterId,
  //     ...payload,
  //   };
  //   this.products.push(newProduct);
  //   return newProduct;
  // }

  // update(id: number, payload: UpdateProductDto) {
  //   const product = this.findOne(id);
  //   const index = this.products.findIndex((item) => item.id === id);
  //   this.products[index] = {
  //     ...product,
  //     ...payload,
  //   };
  //   return this.products[index];
  // }

  // delete(id: number) {
  //   const product = this.findOne(id);
  //   if (!product) {
  //     return {
  //       message: 'No product',
  //     };
  //   }
  //   const index = this.products.findIndex((item) => item.id === id);
  //   return this.products.splice(index, 1);
  // }
}
