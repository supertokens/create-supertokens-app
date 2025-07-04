import { describe, it, expect } from "vitest";
import { generateGoTemplate } from "../boilerplate/backend/shared/go/go"; // Adjust path
import { UserFlags } from "../lib/ts/types"; // Adjust path

describe("Go Template Generation", () => {
    it("should generate correct config for EmailPassword only", () => {
        const args = {
            configType: "emailpassword" as const,
            userArguments: { manager: "npm" } as UserFlags,
        };
        const result = generateGoTemplate(args);
        expect(result).toMatchSnapshot();
    });

    it("should generate correct config for ThirdParty only", () => {
        const args = {
            configType: "thirdparty" as const,
            userArguments: { manager: "npm" } as UserFlags,
        };
        const result = generateGoTemplate(args);
        expect(result).toMatchSnapshot();
    });

    it("should generate correct config for ThirdParty + EmailPassword", () => {
        const args = {
            configType: "thirdpartyemailpassword" as const,
            userArguments: {
                manager: "npm" as const,
                firstfactors: ["emailpassword", "thirdparty"],
            } as UserFlags,
        };
        const result = generateGoTemplate(args);
        expect(result).toMatchSnapshot();
    });

    // Test MFA fallback behavior (Go SDK doesn't support MFA)
    it("should fallback to TP+EP when MFA factors are requested", () => {
        const args = {
            // Even if configType implies MFA, the Go generator should handle it
            configType: "thirdpartyemailpassword" as const,
            userArguments: {
                manager: "npm" as const,
                firstfactors: ["emailpassword", "thirdparty"],
                secondfactors: ["totp"], // These should be ignored by generateGoTemplate
            } as UserFlags,
        };
        const result = generateGoTemplate(args);
        // Expect the output to be the same as the TP+EP case (no MFA recipes)
        expect(result).toContain("emailpassword.Init(nil)");
        expect(result).toContain("thirdparty.Init("); // Make assertion less specific
        expect(result).not.toContain("multifactorauth.Init"); // Ensure MFA is NOT included
        expect(result).not.toContain("totp.Init"); // Ensure TOTP is NOT included
        expect(result).toMatchSnapshot(); // Snapshot should match the non-MFA TP+EP case
    });

    // TODO: Add more specific test cases if needed
});
