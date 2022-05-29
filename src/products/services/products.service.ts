import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Between, FindConditions, Repository } from 'typeorm';
import {
  CreateProductDto,
  FilterProductsDto,
  UpdateProductDto,
} from '../dtos/products.dto';
import { Brand } from '../entities/brand.entity';
import { Category } from '../entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Brand) private brandRepo: Repository<Brand>,
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
  ) {}

  findAll(params?: FilterProductsDto) {
    if (params) {
      const where: FindConditions<Product> = {};
      const { limit, offset } = params;
      const { maxPrice, minPrice } = params;

      if (minPrice && maxPrice) {
        where.price = Between(minPrice, maxPrice);
      }

      return this.productRepo.find({
        relations: ['brand', 'categories'],
        where,
        take: limit,
        skip: offset,
      });
    }
    return this.productRepo.find({
      relations: ['brand', 'categories'],
    });
  }

  async findOne(id: number) {
    const product = await this.productRepo.findOne(id, {
      relations: ['brand', 'categories'],
    });
    if (!product) {
      throw new NotFoundException(`Product ${id} not found`);
    }
    return product;
  }

  async findProductExist(name: string) {
    const exist = await this.productRepo.findOne({ name });
    if (exist) {
      throw new HttpException('Product exist', 409);
    }
  }

  async create(data: CreateProductDto) {
    await this.findProductExist(data.name);
    const newProduct = this.productRepo.create(data);
    if (data.brandId) {
      const brand = await this.brandRepo.findOne(data.brandId);
      newProduct.brand = brand;
    }
    if (data.categoryIds) {
      if (data.categoryIds.length === 0) {
        throw new HttpException('Categories is empty array', 400);
      }
      const categories = await this.categoryRepo.findByIds(data.categoryIds);
      if (data.categoryIds.length !== categories.length) {
        throw new HttpException('Categories dont exist', 404);
      }
      newProduct.categories = categories;
    }

    return this.productRepo.save(newProduct);
  }

  async update(id: number, changes: UpdateProductDto) {
    await this.findProductExist(changes.name);
    const product = await this.findOne(id);
    if (changes.brandId) {
      const brand = await this.brandRepo.findOne(changes.brandId);
      product.brand = brand;
    }
    if (changes.categoryIds) {
      if (changes.categoryIds.length === 0) {
        throw new HttpException('Categories is empty array', 400);
      }
      const categories = await this.categoryRepo.findByIds(changes.categoryIds);
      if (changes.categoryIds.length !== categories.length) {
        throw new HttpException('Categories dont exist', 404);
      }
      product.categories = categories;
    }
    this.productRepo.merge(product, changes);
    return this.productRepo.save(product);
  }

  async removeCategoryByProduct(productId: number, categoryId: number) {
    const product = await this.productRepo.findOne(productId, {
      relations: ['categories'],
    });
    product.categories = product.categories.filter(
      (item) => item.id !== categoryId,
    );
    return this.productRepo.save(product);
  }

  async delete(id: number) {
    const product = await this.findOne(id);
    if (product) {
      return this.productRepo.delete(id);
    }
  }
}
