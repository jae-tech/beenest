import { config } from "@beenest/eslint-config/base";

export default [
  ...config,
  {
    ignores: ["eslint.config.js"]
  }
];