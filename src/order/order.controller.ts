import { Controller, Get, Param } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('comms')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('user-ids')
  getAllUserId() {
    return this.orderService.getAllUserId();
  }

  @Get('your-next-delivery/:userId')
  getDeliveryDetails(@Param('userId') userId: string) {
    return this.orderService.getDeliveryDetails(userId);
  }
}
