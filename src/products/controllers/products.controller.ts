import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  Body,
  Put,
  Delete,
  HttpStatus,
  HttpCode,
  UseGuards,
  // ParseIntPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';

import { ProductsService } from 'src/products/services/products.service';
import { ParseIntPipe } from 'src/common/parse-int.pipe';
import {
  CreateProductDto,
  FilterProductsDto,
  UpdateProductDto,
} from '../dtos/products.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsService) {}

  @Get('filter')
  getProductFilter() {
    return `Soy el filter`;
  }

  @Get(':productId')
  @HttpCode(HttpStatus.ACCEPTED)
  getOne(@Param('productId', ParseIntPipe) productId: number) {
    // response.status(200).send({
    //   message: `este es el product con id: ${productId}`,
    // });
    return this.productService.findOne(productId);
  }

  @Get()
  @Public()
  getProducts(@Query() params: FilterProductsDto) {
    return this.productService.findAll(params);
  }

  @Post()
  create(@Body() data: CreateProductDto) {
    return this.productService.create(data);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateProductDto,
  ) {
    return this.productService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.productService.delete(+id);
  }

  @Delete(':id/category/:categoryId')
  deleteCategory(
    @Param('id', ParseIntPipe) id: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return this.productService.removeCategoryByProduct(id, categoryId);
  }
}
