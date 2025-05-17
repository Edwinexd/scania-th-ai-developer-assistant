// eslint.config.js
import stylisticTs from "@stylistic/eslint-plugin-ts";
import parserTs from "@typescript-eslint/parser";

export default [
    {
        files: ["src/**/*.ts"],
        plugins: {
            "@stylistic/ts": stylisticTs
        },
        languageOptions: {
            parser: parserTs,
        },
        rules: {
            "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
            "quotes": ["error", "double", { avoidEscape: true }],
            "indent": ["error", 4],
            "semi": ["error", "always"],
            "no-console": ["warn"],
        }
    }
];
