"use strict";
var __decorate =
    (this && this.__decorate) ||
    function (decorators, target, key, desc) {
        var c = arguments.length,
            r = c < 3 ? target : desc === null ? (desc = Object.getOwnPropertyDescriptor(target, key)) : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if ((d = decorators[i])) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const config_1 = require("./config"); // Changed import style
let AppModule = class AppModule {};
AppModule = __decorate(
    [
        (0, common_1.Module)({
            imports: [
                auth_module_1.AuthModule.forRoot({
                    // try.supertokens.com is for demo purposes. Replace this with the address of your core instance (sign up on supertokens.com), or self host a core.
                    // Access properties from the directly imported object
                    connectionURI: config_1.SuperTokensConfig.supertokens.connectionURI,
                    // apiKey: "IF YOU HAVE AN API KEY FOR THE CORE, ADD IT HERE",
                    appInfo: config_1.SuperTokensConfig.appInfo, // Keep this correct one
                    // Removed duplicate/incorrect appInfo line below
                }),
            ],
            controllers: [app_controller_1.AppController],
            providers: [app_service_1.AppService],
        }),
    ],
    AppModule
);
exports.AppModule = AppModule;
