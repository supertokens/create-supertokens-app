"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_guard_1 = require("./auth.guard");
describe("AuthGuard", () => {
    it("should be defined", () => {
        expect(new auth_guard_1.AuthGuard()).toBeDefined();
    });
});
