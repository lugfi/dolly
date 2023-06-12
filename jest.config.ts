import type { InitialOptionsTsJest } from "ts-jest/dist/types";

const config: InitialOptionsTsJest = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleDirectories: ["node_modules", "src"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js|jsx)",
    "**/?(*.)+(spec|test).+(ts|tsx|js|jsx)",
  ],
};

export default config;
