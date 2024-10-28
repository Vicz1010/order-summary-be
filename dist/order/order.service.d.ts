import { deliveryDetails, User } from 'src/type';
export declare class OrderService {
    getAllData(): Promise<User[]>;
    getUserData(id: string): Promise<User>;
    formatCatNames(id: string): Promise<string>;
    getAllUserId(): Promise<string[]>;
    getDeliveryDetails(id: string): Promise<deliveryDetails>;
}
