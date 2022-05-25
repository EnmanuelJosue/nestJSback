import { Module } from '@nestjs/common';
import { CustomersController } from './controllers/customers.controller';
import { UsersController } from './controllers/users.controller';
import { CustomersService } from './services/customers.service';
import { UsersService } from './services/users.service';

@Module({
  controllers: [CustomersController, UsersController],
  providers: [UsersService, CustomersService],
})
export class UsersModule {}
