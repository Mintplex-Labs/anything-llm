module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.js"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  collectCoverageFrom: [
    "models/**/*.js",
    "utils/**/*.js",
    "endpoints/**/*.js",
    "!**/__tests__/**",
    "!**/node_modules/**",
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/__tests__/",
  ],
  testTimeout: 10000,
};
