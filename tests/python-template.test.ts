import { describe, it, expect } from "vitest";
import { generatePythonTemplate } from "../boilerplate/backend/shared/python/py"; // Adjust path
import { UserFlags } from "../lib/ts/types"; // Adjust path

describe("Python Template Generation", () => {
    it("should generate correct config for EmailPassword only (FastAPI)", () => {
        const args = {
            configType: "emailpassword" as const,
            userArguments: { manager: "npm" } as UserFlags,
            framework: "fastapi",
        };
        const result = generatePythonTemplate(args);
        expect(result).toMatchSnapshot();
    });

    it("should generate correct config for ThirdParty only (Flask)", () => {
        const args = {
            configType: "thirdparty" as const,
            userArguments: { manager: "npm" } as UserFlags,
            framework: "flask",
        };
        const result = generatePythonTemplate(args);
        expect(result).toMatchSnapshot();
    });

    it("should generate correct config for ThirdParty + EmailPassword + TOTP MFA (DRF)", () => {
        const args = {
            configType: "thirdpartyemailpassword" as const,
            userArguments: {
                manager: "npm" as const,
                firstfactors: ["emailpassword", "thirdparty"],
                secondfactors: ["totp"],
            } as UserFlags,
            framework: "drf",
        };
        const result = generatePythonTemplate(args);
        expect(result).toMatchSnapshot();
    });

    it("should generate correct config for EmailPassword + OTP/Link Email/Phone (FastAPI)", () => {
        const args = {
            configType: "emailpassword" as const, // configType might be inferred differently, but test factors
            userArguments: {
                manager: "npm" as const,
                firstfactors: ["emailpassword", "otp-email", "link-email", "otp-phone", "link-phone"],
            } as UserFlags,
            framework: "fastapi",
        };
        const result = generatePythonTemplate(args);
        // Check specific parts for passwordless config
        expect(result).toContain("contact_config=ContactEmailOrPhoneConfig()");
        expect(result).toContain('flow_type="USER_INPUT_CODE_AND_MAGIC_LINK"');
        expect(result).toMatchSnapshot();
    });

    // TODO: Add more specific test cases for different factor combinations and frameworks
});
