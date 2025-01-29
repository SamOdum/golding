/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.integration.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.integration.ts'],
  globalSetup: '<rootDir>/src/test/global.setup.ts',
  globalTeardown: '<rootDir>/src/test/global.teardown.ts',
  testTimeout: 30000,
};

export default config;
