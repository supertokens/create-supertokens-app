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
var __param =
    (this && this.__param) ||
    function (paramIndex, decorator) {
        return function (target, key) {
            decorator(target, key, paramIndex);
        };
    };
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const multitenancy_1 = __importDefault(require("supertokens-node/recipe/multitenancy"));
const auth_guard_1 = require("./auth/auth.guard");
const session_decorator_1 = require("./auth/session/session.decorator");
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getHello() {
        return this.appService.getHello();
    }
    getSessionInfo(session) {
        return {
            sessionHandle: session.getHandle(),
            userId: session.getUserId(),
            accessTokenPayload: session.getAccessTokenPayload(),
        };
    }
    // This API is used by the frontend to create the tenants drop down when the app loads.
    // Depending on your UX, you can remove this API.
    async getTenants() {
        return await multitenancy_1.default.listAllTenants();
    }
};
__decorate([(0, common_1.Get)("/hello")], AppController.prototype, "getHello", null);
__decorate(
    [
        (0, common_1.Get)("/sessioninfo"),
        (0, common_1.UseGuards)(new auth_guard_1.AuthGuard()),
        __param(0, (0, session_decorator_1.Session)()),
    ],
    AppController.prototype,
    "getSessionInfo",
    null
);
__decorate([(0, common_1.Get)("/tenants")], AppController.prototype, "getTenants", null);
AppController = __decorate([(0, common_1.Controller)()], AppController);
exports.AppController = AppController;
