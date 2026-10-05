import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import vue from "eslint-plugin-vue";
export default tseslint.config(
  { ignores: ["dist/**", "docs/previews/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...vue.configs["flat/essential"],
  {
    files: ["**/*.{ts,vue}"],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { parser: tseslint.parser },
    },
  },
  {
    files: ["*.js", "scripts/*.mjs"],
    languageOptions: { globals: globals.node },
  },
  { files: ["**/*.vue"], rules: { "vue/multi-word-component-names": "off" } },
);
