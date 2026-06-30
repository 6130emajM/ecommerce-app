export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEach: [],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
  },
};