import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { readFile } from 'fs/promises';
import { User } from 'src/type';
import { findPrice } from '../utils';

// Mocking the findPrice function
jest.mock('../utils', () => ({
  findPrice: jest.fn().mockImplementation((size: string) => {
    if (size === 'A') return 55.5;
    if (size === 'B') return 59.5;
    if (size === 'C') return 62.75;
    if (size === 'D') return 66.0;
    if (size === 'E') return 69.0;
    if (size === 'F') return 71.25;
    return 0;
  }),
}));

jest.mock('fs/promises', () => ({
  readFile: jest.fn(), // Mock readFile here
}));

describe('OrderService', () => {
  let orderService: OrderService;

  const mockUserData: User[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Smith',
      email: 'John.Smith@test.com',
      cats: [
        {
          name: 'Fluffy',
          subscriptionActive: true,
          breed: 'Thai',
          pouchSize: 'A',
        },
        {
          name: 'Mittens',
          subscriptionActive: false,
          breed: 'Somali',
          pouchSize: 'B',
        },
      ],
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'Jane.Smith@test.com',
      cats: [
        {
          name: 'Whiskers',
          subscriptionActive: false,
          breed: 'Thai',
          pouchSize: 'A',
        },
        {
          name: 'Furry',
          subscriptionActive: false,
          breed: 'Somali',
          pouchSize: 'B',
        },
        {
          name: 'Fluffy',
          subscriptionActive: false,
          breed: 'Himalayan',
          pouchSize: 'B',
        },
      ],
    },
    {
      id: '3',
      firstName: 'Mr',
      lastName: 'X',
      email: 'Mr.X@test.com',
      cats: [
        {
          name: 'Thunder',
          subscriptionActive: false,
          breed: 'Thai',
          pouchSize: 'A',
        },
      ],
    },
  ];

  //   jest.mock('fs/promises', () => ({
  //     readFile: jest.fn().mockResolvedValue(JSON.stringify(mockUserData)),
  //   }));

  beforeEach(() => {
    (readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockUserData)); // Set the resolved value here
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderService],
    }).compile();

    orderService = module.get<OrderService>(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllData', () => {
    it('should return an array of User data', async () => {
      const result = await orderService.getAllData();
      expect(result).toEqual(mockUserData);
    });
  });

  describe('getUserData', () => {
    it('should return user data for a valid ID', async () => {
      const result = await orderService.getUserData('1');
      expect(result).toEqual(mockUserData[0]);
    });

    it('should throw an error for an invalid ID', async () => {
      await expect(orderService.getUserData('4')).rejects.toThrow(
        'User not found'
      );
    });
  });

  describe('formatCatNames', () => {
    it('should format cat names correctly for one cat', async () => {
      const result = await orderService.formatCatNames('3');
      expect(result).toBe('Thunder');
    });

    it('should format cat names correctly for two cats', async () => {
      const result = await orderService.formatCatNames('1');
      expect(result).toBe('Fluffy and Mittens');
    });

    it('should format cat names correctly for multiple cats', async () => {
      const result = await orderService.formatCatNames('2');
      expect(result).toBe('Whiskers, Furry and Fluffy');
    });
  });

  describe('getAllUserId', () => {
    it('should return an array of user IDs', async () => {
      const result = await orderService.getAllUserId();
      expect(result).toEqual(['1', '2', '3']);
    });
  });

  describe('getDeliveryDetails', () => {
    it('should return delivery details for a user with active cat subscriptions', async () => {
      const result = await orderService.getDeliveryDetails('1');
      expect(result).toEqual({
        title: 'Your next delivery for Fluffy and Mittens',
        message:
          "Hey John! In two days' time, we'll be charging you for your next order for Fluffy and Mittens's fresh food.",
        totalPrice: '55.50',
        freeGift: false,
      });
    });

    it('should return a message for a user with no active cat subscriptions', async () => {
      const result = await orderService.getDeliveryDetails('2');
      expect(result).toEqual({
        title: 'No active subscriptions',
        message:
          'Hey Jane! There are no active subscriptions for your cats at the moment.',
        totalPrice: '0.00',
        freeGift: false,
      });
    });
  });
});
