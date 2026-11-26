import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default [
    { ignores: ["build/", ".react-router/"] },
    ...tseslint.configs.recommended,
    {
        files: ["**/*.tsx"],
        plugins: { "react-hooks": reactHooks },
        rules: {
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",
        },
    },
];
