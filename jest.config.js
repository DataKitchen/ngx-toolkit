
module.exports = {

  projects: [
    // libs
    '<rootDir>/projects/core/src',
  ],
  coverageDirectory: 'coverage',
  reporters: [
    'default'
  ],
  coverageReporters: [
    'html',
    'lcov',
    'text'
  ],
  collectCoverageFrom: [
    "**/src/**/!(*.spec).ts",
    "!**/index.ts",
    "!**/*.module.ts",
    "!**/polyfills.ts",
    "!**/src/environments/**",
    "!**/main.ts",
    "!**/src/public-api.ts",
  ],
  coverageThreshold: {
    global: {
      statements: 73,
      branches: 60,
      lines: 71,
      functions: 67,
    }
  },

};
