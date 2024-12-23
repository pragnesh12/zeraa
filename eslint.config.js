import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Extend Next.js core and TypeScript rules
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Add custom rules (if needed)
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "no-unused-vars": "warn", // Example of a valid rule
      "react/react-in-jsx-scope": "off", // Disable React import requirement for Next.js
    },
  },
];

export default eslintConfig;
