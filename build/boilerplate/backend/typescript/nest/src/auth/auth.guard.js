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
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const session_1 = require("supertokens-node/recipe/session");
let AuthGuard = class AuthGuard {
    constructor(getSessionOptions) {
        this.getSessionOptions = getSessionOptions;
    }
    async canActivate(context) {
        const ctx = context.switchToHttp();
        const req = ctx.getRequest();
        const resp = ctx.getResponse();
        // If the session doesn't exist and {sessionRequired: true} is passed to the AuthGuard constructor (default is true),
        // getSession will throw an error that will be handled by the exception filter, returning a 401 response.
        // To avoid an error when the session doesn't exist, pass {sessionRequired: false} to the AuthGuard constructor.
        // In this case, req.session will be undefined if the session doesn't exist.
        const session = await (0, session_1.getSession)(req, resp, this.getSessionOptions);
        req.session = session;
        return true;
    }
};
AuthGuard = __decorate([(0, common_1.Injectable)()], AuthGuard);
exports.AuthGuard = AuthGuard;
