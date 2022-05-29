import { IsNotEmpty, IsPositive } from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';

export class CreateOrderItemDto {
  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  readonly orderId: number;

  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  readonly productId: number;

  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  readonly quantity: number;
}

export class UpdateOrderItemDto extends PartialType(CreateOrderItemDto) {}
