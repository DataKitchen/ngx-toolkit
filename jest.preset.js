

module.exports = {
  preset: 'ts-jest',
  testMatch: [ '**/?(*.)+(spec|test).[jt]s?(x)' ],
  moduleFileExtensions: [ 'ts', 'js', 'mjs', 'html' ],
  coverageReporters: [ 'html' ],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: { customExportConditions: [ 'node', 'require', 'default' ] },
};
