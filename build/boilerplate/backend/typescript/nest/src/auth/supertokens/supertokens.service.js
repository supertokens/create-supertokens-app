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
exports.SupertokensService = void 0;
const common_1 = require("@nestjs/common");
const supertokens_node_1 = __importDefault(require("supertokens-node"));
const config_interface_1 = require("../config.interface");
const config_1 = require("../../config"); // Changed import style
let SupertokensService = class SupertokensService {
    constructor(config) {
        this.config = config;
        supertokens_node_1.default.init({
            appInfo: config.appInfo,
            supertokens: {
                connectionURI: config.connectionURI,
                apiKey: config.apiKey,
            },
            recipeList: config_1.SuperTokensConfig.recipeList,
        });
    }
};
SupertokensService = __decorate(
    [(0, common_1.Injectable)(), __param(0, (0, common_1.Inject)(config_interface_1.ConfigInjectionToken))],
    SupertokensService
);
exports.SupertokensService = SupertokensService;
