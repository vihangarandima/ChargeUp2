/**
 * BACKEND JEST CONFIG
 * Copy this file to: chargeUp-backend/jest.config.js
 * Works on Windows, Mac and Linux
 *
 * Also add this to chargeUp-backend/package.json scripts:
 *   "test": "jest"
 *
 * Install test dependencies first:
 *   npm install --save-dev jest supertest mongodb-memory-server
 */

module.exports = {
  testEnvironment: "node",
  testMatch: ["**/test cases/backend/**/*.test.js"],
  forceExit: true,
  clearMocks: true,
  testTimeout: 30000,
};
