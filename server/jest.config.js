module.exports = {
  preset: '@trendyol/jest-testcontainers',
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/jest.env.js'],
  testMatch: ['**/?(*.)+(spec).+(ts)'],
  transform: {
    '^.+\\.(ts)$': 'ts-jest',
  },
  moduleNameMapper: {
    '~shared/(.*)': '<rootDir>/../shared/build/$1',
    'jose/dist/types/(.*)': '<rootDir>/node_modules/jose/dist/node/cjs/$1',
    '^@/(.*)': '<rootDir>/src/$1',
  },
}
