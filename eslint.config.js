// eslint.config.js
import stylisticTs from "@stylistic/eslint-plugin-ts";
import parserTs from "@typescript-eslint/parser";

export default [
  {
    plugins: {
      "@stylistic/ts": stylisticTs
    },
    languageOptions: {
      parser: parserTs,
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "quotes": ["error", "double", { avoidEscape: true }],
      "indent": ["error", 2],
      "semi": ["error", "always"],
      "no-console": ["warn"],
    }
  }
];
