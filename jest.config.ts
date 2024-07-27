/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // A preset that is used as a base for Jest's configuration
  // preset: [
  //   ['@babel/preset-env', {targets: {node: 'current'}}],
  //   '@babel/preset-typescript',
  // ],

  // An object that configures minimum threshold enforcement for coverage results
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },

  transform: {
    '^.+\\.ts?$': 'ts-jest',
    '^.+\\.js?$': 'babel-jest',
  },

  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/test/common/",
  ],

  verbose: true,
};
