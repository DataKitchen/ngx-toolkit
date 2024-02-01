module.exports = {
  displayName: 'core',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: {},
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],

  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],

  collectCoverageFrom: [
    'src/(app|lib)/**/*.ts',
    '!src/(app|lib)/**/*.module.ts',
    '!src/(app|lib)/**/*.mock.ts',
    '!src/(app|lib)/**/index.ts',
    '!src/lib/mock-service.ts'
  ],
  coverageThreshold: {
    global: {
      statements: 89,
      branches: 85,
      lines: 90,
      functions: 79,
    },
  },
};
