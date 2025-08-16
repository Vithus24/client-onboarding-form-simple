module.exports = {
  preset: 'ts-jest', 
  testEnvironment: 'jest-environment-jsdom',
  roots: ['<rootDir>/src'], 
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  transformIgnorePatterns: ['/node_modules/'],
};