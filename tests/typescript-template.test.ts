import { describe, it, expect } from "vitest";
import { generateTypeScriptTemplate } from "../boilerplate/backend/shared/typescript/ts"; // Adjust path
import { UserFlags } from "../lib/ts/types"; // Adjust path

describe("TypeScript Template Generation", () => {
    it("should generate correct config for EmailPassword only (Express)", () => {
        const args = {
            configType: "emailpassword" as const,
            userArguments: { manager: "npm" } as UserFlags,
        };
        const result = generateTypeScriptTemplate(args, "express"); // Pass framework as second arg
        expect(result).toMatchSnapshot();
    });

    it("should generate correct config for ThirdParty only (Nest)", () => {
        const args = {
            configType: "thirdparty" as const,
            userArguments: { manager: "npm" } as UserFlags,
        };
        const result = generateTypeScriptTemplate(args, "nest");
        expect(result).toMatchSnapshot();
    });

    it("should generate correct config for ThirdParty + EmailPassword + OTP Email MFA (Koa)", () => {
        const args = {
            configType: "thirdpartyemailpassword" as const,
            userArguments: {
                manager: "npm" as const,
                firstfactors: ["emailpassword", "thirdparty"],
                secondfactors: ["otp-email"], // Using OTP Email for testing
            } as UserFlags,
        };
        const result = generateTypeScriptTemplate(args, "koa");
        expect(result).toMatchSnapshot();
    });

    it("should generate correct config for EmailPassword + Link Phone (Express)", () => {
        const args = {
            configType: "emailpassword" as const, // configType might be inferred differently
            userArguments: {
                manager: "npm" as const,
                firstfactors: ["emailpassword", "link-phone"],
            } as UserFlags,
        };
        const result = generateTypeScriptTemplate(args, "express");
        // Check specific parts for passwordless config
        expect(result).toContain('contactMethod: "PHONE"');
        expect(result).toContain('flowType: "MAGIC_LINK"');
        expect(result).toMatchSnapshot();
    });

    // TODO: Add more specific test cases for different factor combinations and frameworks
});
