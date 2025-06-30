import { describe, it, expect } from "vitest";
import { generateWebJSTemplate } from "../boilerplate/frontend/shared/web-js/template"; // Adjust path
describe("WebJS Template Generation", () => {
    it("should generate correct config for EmailPassword only (Angular)", () => {
        const args = {
            configType: "emailpassword",
            userArguments: { manager: "npm" },
            framework: "angular",
        };
        const result = generateWebJSTemplate(args);
        expect(result).toMatchSnapshot();
    });
    it("should generate correct config for ThirdParty only (Vue)", () => {
        const args = {
            configType: "thirdparty",
            userArguments: { manager: "npm" },
            framework: "vue",
        };
        const result = generateWebJSTemplate(args);
        expect(result).toMatchSnapshot();
    });
    it("should generate correct config for EmailPassword + ThirdParty + OTP Email MFA (Solid)", () => {
        const args = {
            configType: "thirdpartyemailpassword",
            userArguments: {
                manager: "npm",
                firstfactors: ["emailpassword", "thirdparty"],
                secondfactors: ["otp-email"],
            },
            framework: "solid",
        };
        const result = generateWebJSTemplate(args);
        // Check for key MFA/EV inclusions
        expect(result).toContain("supertokensUIMultiFactorAuth.init");
        expect(result).toContain("supertokensUIEmailVerification.init");
        expect(result).toContain("MultiFactorAuth.init()"); // Core SDK init
        expect(result).toContain("EmailVerification.init()"); // Core SDK init
        expect(result).toMatchSnapshot();
    });
    it("should generate correct config for EmailPassword + OTP Phone/Email (Angular)", () => {
        const args = {
            configType: "emailpassword",
            userArguments: {
                manager: "npm",
                firstfactors: ["emailpassword", "otp-phone", "otp-email"],
            },
            framework: "angular",
        };
        const result = generateWebJSTemplate(args);
        // Check specific parts for passwordless config
        expect(result).toContain('contactMethod: "EMAIL_OR_PHONE"');
        expect(result).toContain('flowType: "USER_INPUT_CODE"'); // Only OTP factors
        expect(result).toMatchSnapshot();
    });
    // TODO: Add more specific test cases for different factor combinations and frameworks
});
