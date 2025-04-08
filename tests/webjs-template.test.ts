import { describe, it, expect } from "vitest";
import { generateWebJSTemplate } from "../boilerplate/frontend/shared/web-js/template"; // Adjust path
import { UserFlags } from "../lib/ts/types"; // Adjust path

describe("WebJS Template Generation", () => {
    it("should generate correct config for EmailPassword only (Angular)", () => {
        const args = {
            configType: "emailpassword" as const,
            userArguments: { manager: "npm" } as UserFlags,
            framework: "angular",
        };
        const result = generateWebJSTemplate(args);
        expect(result).toMatchSnapshot();
    });

    it("should generate correct config for ThirdParty only (Vue)", () => {
        const args = {
            configType: "thirdparty" as const,
            userArguments: { manager: "npm" } as UserFlags,
            framework: "vue",
        };
        const result = generateWebJSTemplate(args);
        expect(result).toMatchSnapshot();
    });

    it("should generate correct config for EmailPassword + ThirdParty + OTP Email MFA (Solid)", () => {
        const args = {
            configType: "thirdpartyemailpassword" as const,
            userArguments: {
                manager: "npm" as const,
                firstfactors: ["emailpassword", "thirdparty"],
                secondfactors: ["otp-email"],
            } as UserFlags,
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
            configType: "emailpassword" as const, // configType might be inferred differently
            userArguments: {
                manager: "npm" as const,
                firstfactors: ["emailpassword", "otp-phone", "otp-email"],
            } as UserFlags,
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
