import { config } from "@beenest/eslint-config/base";

export default [
  ...config,
  {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json"
      }
    }
  }
];