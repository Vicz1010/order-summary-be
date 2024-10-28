"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const order_module_1 = require("./order/order.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(order_module_1.OrderModule);
    app.enableCors({
        origin: 'http://localhost:3001',
    });
    await app.listen(8000);
}
bootstrap();
//# sourceMappingURL=main.js.map