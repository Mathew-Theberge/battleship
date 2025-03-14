import globals from "globals";
import pluginJs from "@eslint/js";
import eslintPluginPrettier, { languageOptions } from "eslint-plugin-prettier/recommended";

export default [
    { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
    pluginJs.configs.recommended,
    eslintPluginPrettier,
];
