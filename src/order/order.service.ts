import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import path from 'path';
import { deliveryDetails, User } from 'src/type';
import { findPrice } from 'src/utils';

@Injectable()
export class OrderService {
  /**
   * Reads data.json file and returns data from it
   * @returns data as type User[]
   */
  async getAllData(): Promise<User[]> {
    const dataFile = path.join(__dirname, '..', '..', 'data.json');
    const data = readFile(dataFile, 'utf8');
    return JSON.parse(await data);
  }

  /**
   *
   * @param id - User ID
   * @returns User data or error message if user not found
   */
  async getUserData(id: string): Promise<User> {
    try {
      const allUserData = await this.getAllData();
      const userData = allUserData.find((user) => user.id === id);
      if (!userData) {
        throw new Error('User not found');
      }
      return userData;
    } catch (error) {
      throw new Error(`User not found - ${error}`);
    }
  }

  /**
   * Finds cat names from User object and formats them
   * @returns string with formatted cat names
   */
  async formatCatNames(id: string): Promise<string> {
    const catNamesArr: string[] = [];
    const catData = (await this.getUserData(id)).cats;

    catData.map((cat) => catNamesArr.push(cat.name));

    if (catNamesArr.length === 1) {
      return catNamesArr[0];
    } else if (catNamesArr.length === 2) {
      return `${catNamesArr[0]} and ${catNamesArr[1]}`;
    } else if (catNamesArr.length > 2) {
      const allNamesExcLast = catNamesArr.slice(0, -1).join(', ');
      const allNames =
        allNamesExcLast + `, and ${catNamesArr[catNamesArr.length - 1]}`;

      return allNames;
    }

    return '';
  }

  async getAllUserId(): Promise<string[]> {
    const allData = await this.getAllData();
    return allData.map((user) => user.id);
  }

  async getDeliveryDetails(id: string): Promise<deliveryDetails> {
    const prices = [];
    let noActiveCatSubscriptions = false;
    let freeGift = false;
    const userData = await this.getUserData(id);

    const formattedCatName = await this.formatCatNames(id);

    const title = `Your next delivery for ${formattedCatName}`;

    const userCatData = userData.cats;
    const numberOfCats = userCatData.length;
    for (let i = 0; i < numberOfCats; i++) {
      if (userCatData[i].subscriptionActive) {
        prices.push(findPrice(userCatData[i].pouchSize));
      }
    }
    const totalPrice = prices.reduce((total, currentValue) => {
      return total + currentValue;
    }, 0);

    if (!userCatData.find((cat) => cat.subscriptionActive == true)) {
      noActiveCatSubscriptions = true;
    }
    if (noActiveCatSubscriptions) {
      return {
        title: 'No active subscriptions',
        message: `Hey ${userData.firstName}! There are no active subscriptions for your cats at the moment.`,
        totalPrice: '0.00',
        freeGift: false,
      };
    }

    if (totalPrice > 120) freeGift = true;

    return {
      title: title,
      message: `Hey ${userData.firstName}! In two days' time, we'll be charging you for your next order for ${formattedCatName}'s fresh food.`,
      totalPrice: totalPrice.toFixed(2),
      freeGift: freeGift,
    };
  }
}
