import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


export default [
  {
    files: ["**/*.{js,mjs,ts}"],
  },
  {
    ignores: ["dist/*", "server.cjs"]
  },
  {
    rules: {
      "@typescript-eslint/no-this-alias": ["off"]
    }
  },
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,

];
