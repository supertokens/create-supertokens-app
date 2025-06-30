"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const supertokens_service_1 = require("./supertokens.service");
describe("SupertokensService", () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [supertokens_service_1.SupertokensService],
        }).compile();
        service = module.get(supertokens_service_1.SupertokensService);
    });
    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
