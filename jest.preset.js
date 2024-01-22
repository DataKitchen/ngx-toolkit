const ts_preset = require('ts-jest/jest-preset');
module.exports = {
  ...ts_preset,
  testMatch: [ '**/+(*.)+(spec|test).+(ts)?(x)' ],
  moduleFileExtensions: [ 'ts', 'js', 'mjs', 'html' ],
  coverageReporters: [ 'html' ],
  transform: { '^.+\\.(ts|js|html)$': 'ts-jest' },
};
