"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const supertokens_node_1 = __importDefault(require("supertokens-node"));
const auth_filter_1 = require("./auth/auth.filter");
const config_1 = require("./config"); // Changed import style
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: [config_1.SuperTokensConfig.appInfo.websiteDomain],
        allowedHeaders: ["content-type", ...supertokens_node_1.default.getAllCORSHeaders()],
        credentials: true,
    });
    app.useGlobalFilters(new auth_filter_1.SupertokensExceptionFilter());
    await app.listen(3001);
}
bootstrap();
