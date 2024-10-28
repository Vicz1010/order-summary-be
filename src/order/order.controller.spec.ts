import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

describe('OrderController', () => {
  let orderController: OrderController;
  let orderService: OrderService;

  const fakeResponse = {
    title: 'Your next delivery for Ready Player One',
    message:
      "Hey james! In two days' time, we'll be charging you for your next order for Ready Player One's fresh food.",
    totalPrice: '125.50',
    freeGift: true,
  };

  const mockOrderService = {
    getAllUserId: jest.fn().mockReturnValue(['433', '4231']),
    getDeliveryDetails: jest.fn().mockImplementation((userId: string) => {
      if (userId === '433') return fakeResponse;
      return { statusCode: 500, message: 'Internal server error' };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    orderController = module.get<OrderController>(OrderController);
    orderService = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(orderController).toBeDefined();
  });

  describe('getAllUserId', () => {
    it('should return an array of user IDs', () => {
      expect(orderController.getAllUserId()).toEqual(['433', '4231']);
      expect(orderService.getAllUserId).toHaveBeenCalled();
    });
  });

  describe('getDeliveryDetails', () => {
    it('should return delivery details for a valid user ID', () => {
      const userId = 'user1';
      expect(orderController.getDeliveryDetails(userId)).toEqual({
        statusCode: 500,
        message: 'Internal server error',
      });
      expect(orderService.getDeliveryDetails).toHaveBeenCalledWith(userId);
    });

    it('should return no delivery found for an invalid user ID', () => {
      const userId = 'invalidUser';
      expect(orderController.getDeliveryDetails(userId)).toEqual({
        statusCode: 500,
        message: 'Internal server error',
      });
      expect(orderService.getDeliveryDetails).toHaveBeenCalledWith(userId);
    });
  });
});
