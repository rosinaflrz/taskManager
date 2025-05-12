import js from "@eslint/js";
import globals from "globals";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import css from "@eslint/css";
import { defineConfig } from "eslint/config";
import jestPlugin from 'eslint-plugin-jest';

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" },rules: {"no-unused-vars": "warn", "no-undef": "warn", "no-redeclare" : "warn", "no-case-declarations" : "off"}},
  { files: ["**/*.{js,mjs,cjs}"], languageOptions: { globals: globals.browser } },
  { files: ["**/*.json"], plugins: { json }, language: "json/json", extends: ["json/recommended"], rules: {"json/no-empty-keys" : "off"} },
  { files: ["**/*.jsonc"], plugins: { json }, language: "json/jsonc", extends: ["json/recommended"] },
  { files: ["**/*.json5"], plugins: { json }, language: "json/json5", extends: ["json/recommended"] },
  { files: ["**/*.md"], plugins: { markdown }, language: "markdown/gfm", extends: ["markdown/recommended"] },
  { files: ["**/*.css"], plugins: { css }, language: "css/css", extends: ["css/recommended"], rules : {"css/no-empty-blocks" : "off"} },
  { files: ["**/*.test.js"], plugins: { jest: jestPlugin }, rules: {"no-unused-vars": "warn", "no-undef": "warn"}, languageOptions: { sourceType: "module"}},
]);