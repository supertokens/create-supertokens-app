"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const common_1 = require("@nestjs/common");
exports.Session = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.session;
});
