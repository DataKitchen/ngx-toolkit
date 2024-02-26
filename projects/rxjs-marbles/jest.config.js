module.exports = {
  displayName: 'rxjs-marbles',
  preset: '../../jest.preset.js',
  // setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: {},
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {
      tsConfig: 'tsconfig.spec.json'
    }],
  },
  // transform: {
  //   '^.+\\.(ts|mjs|js|html)$': [
  //     'jest-preset-angular',
  //     {
  //       tsconfig: '<rootDir>/tsconfig.spec.json',
  //       stringifyContentPathRegex: '\\.(html|svg)$',
  //     },
  //   ],
  // },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],

  collectCoverageFrom: [
    'src/lib/**/*.ts',
    '!src/lib/**/index.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 92,
      branches: 100,
      lines: 91.66,
      functions: 92,
    },
  },
};
