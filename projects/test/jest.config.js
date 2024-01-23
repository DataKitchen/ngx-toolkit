const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('../../tsconfig.json');

const moduleNameMapper = pathsToModuleNameMapper(compilerOptions.paths, {prefix: '<rootDir>/../../'});

module.exports = {
  displayName: 'test',
  // preset: 'jest-preset-angular',
  preset: '../../jest.preset',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],

  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg)$',
    },
  },
  transform: {
    '^.+\\.(ts|mjs|js|html)$': 'jest-preset-angular',
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
};
