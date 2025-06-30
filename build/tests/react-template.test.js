import { describe, it, expect } from "vitest";
import { generateReactTemplate } from "../boilerplate/frontend/shared/react/template"; // Adjust path as needed
describe("React Template Generation", () => {
    it("should generate correct config for EmailPassword + ThirdParty with Link Email MFA", () => {
        const args = {
            configType: "thirdpartyemailpassword",
            userArguments: {
                manager: "npm",
                firstfactors: ["emailpassword", "thirdparty"],
                secondfactors: ["link-email"],
            },
            framework: "react",
        };
        const result = generateReactTemplate(args);
        // Compare the generated output against a stored snapshot
        expect(result).toMatchSnapshot();
    });
    // TODO: Add more test cases here by translating other test-*-template.ts files
    // or defining new scenarios. Example:
    // it('should generate correct config for EmailPassword only', () => {
    //     const args = { /* ... args for EP only ... */ };
    //     const result = generateReactTemplate(args);
    //     expect(result).toMatchSnapshot();
    // });
});
