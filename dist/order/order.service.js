"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const promises_1 = require("fs/promises");
const path_1 = __importDefault(require("path"));
const utils_1 = require("../utils");
let OrderService = class OrderService {
    async getAllData() {
        const dataFile = path_1.default.join(__dirname, '..', '..', 'data.json');
        const data = (0, promises_1.readFile)(dataFile, 'utf8');
        return JSON.parse(await data);
    }
    async getUserData(id) {
        try {
            const allUserData = await this.getAllData();
            const userData = allUserData.find((user) => user.id === id);
            if (!userData) {
                throw new Error('User not found');
            }
            return userData;
        }
        catch (error) {
            throw new Error(`User not found - ${error}`);
        }
    }
    async formatCatNames(id) {
        const catNamesArr = [];
        const catData = (await this.getUserData(id)).cats;
        catData.map((cat) => catNamesArr.push(cat.name));
        if (catNamesArr.length === 1) {
            return catNamesArr[0];
        }
        else if (catNamesArr.length === 2) {
            return `${catNamesArr[0]} and ${catNamesArr[1]}`;
        }
        else if (catNamesArr.length > 2) {
            const allNamesExcLast = catNamesArr.slice(0, -1).join(', ');
            const allNames = allNamesExcLast + `, and ${catNamesArr[catNamesArr.length - 1]}`;
            return allNames;
        }
        return '';
    }
    async getAllUserId() {
        const allData = await this.getAllData();
        return allData.map((user) => user.id);
    }
    async getDeliveryDetails(id) {
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
                prices.push((0, utils_1.findPrice)(userCatData[i].pouchSize));
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
        if (totalPrice > 120)
            freeGift = true;
        return {
            title: title,
            message: `Hey ${userData.firstName}! In two days' time, we'll be charging you for your next order for ${formattedCatName}'s fresh food.`,
            totalPrice: totalPrice.toFixed(2),
            freeGift: freeGift,
        };
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)()
], OrderService);
//# sourceMappingURL=order.service.js.map