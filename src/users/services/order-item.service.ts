import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Repository } from 'typeorm';
import { CreateOrderItemDto, UpdateOrderItemDto } from '../dtos/order-item.dto';
import { OrderItem } from '../entities/order-item.entity';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  findAll() {
    return this.orderItemRepo.find({
      relations: ['order', 'order.customer'],
    });
  }

  async findOne(id: number) {
    const order = await this.orderItemRepo.findOne(id, {
      relations: ['order', 'product'],
    });
    if (!order) {
      throw new NotFoundException(`order #${id} not found`);
    }
    return order;
  }

  async create(data: CreateOrderItemDto) {
    const order = await this.orderRepo.findOne(data.orderId);
    const product = await this.productRepo.findOne(data.productId);
    const item = new OrderItem();
    item.order = order;
    item.product = product;
    item.quantity = data.quantity;
    return this.orderItemRepo.save(item);
  }

  async update(id: number, changes: UpdateOrderItemDto) {
    const order = await this.findOne(id);

    if (changes.productId) {
      const product = await this.productRepo.findOne(changes.productId);
      order.product = product;
    }
    if (changes.orderId) {
      const orderItem = await this.orderRepo.findOne(changes.orderId);
      order.order = orderItem;
    }
    if (changes.quantity) {
      order.quantity = changes.quantity;
    }
    return this.orderItemRepo.save(order);
  }

  async remove(id: number) {
    const order = await this.findOne(id);
    if (order) {
      return this.orderItemRepo.delete(id);
    }
  }
}
