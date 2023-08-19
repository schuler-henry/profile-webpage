const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const config = {
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,
  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',
  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: ['/node_modules/', '/old/', '/app/layout.tsx'],
  collectCoverageFrom: ['app/**', 'components/**', 'store/**'],
  // An array of regexp pattern strings, matched against all module paths before considered 'visible' to the module loader
  modulePathIgnorePatterns: ['/old/'],
  // The test environment that will be used for testing
  testEnvironment: 'jest-environment-jsdom',
  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: ['/node_modules/', '/old/'],

  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/store/(.*)$': '<rootDir>/store/$1',
  },
};

module.exports = createJestConfig(config);
