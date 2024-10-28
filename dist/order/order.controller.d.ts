import { OrderService } from './order.service';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    getAllUserId(): Promise<string[]>;
    getDeliveryDetails(userId: string): Promise<import("../type").deliveryDetails>;
}
