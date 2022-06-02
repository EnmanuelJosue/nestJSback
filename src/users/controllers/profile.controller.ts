import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/models/roles.model';
import { PayloadToken } from 'src/auth/models/token.model';
import { OrdersService } from '../services/orders.service';
import { UsersService } from '../services/users.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(
    private orderService: OrdersService,
    private usersService: UsersService,
  ) {}

  @Roles(Role.CUSTOMER)
  @Get('my-orders')
  async getOrders(@Req() req: Request) {
    const user = req.user as PayloadToken;
    const { customer } = await this.usersService.findOne(user.sub);
    return this.orderService.ordersByCustomer(customer.id);
  }
}
