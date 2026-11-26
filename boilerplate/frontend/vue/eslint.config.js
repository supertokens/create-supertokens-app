import vue from "eslint-plugin-vue";
import tseslint from "typescript-eslint";

export default [
    { ignores: ["dist/"] },
    ...tseslint.configs.recommended,
    ...vue.configs["flat/essential"],
    {
        files: ["**/*.vue"],
        languageOptions: { parserOptions: { parser: tseslint.parser } },
    },
    {
        files: ["src/config.ts"],
        // The generated prebuilt UI config calls untyped globals from the CDN bundle.
        rules: { "@typescript-eslint/no-explicit-any": "off" },
    },
];
