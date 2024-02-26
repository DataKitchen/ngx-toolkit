module.exports = {
  displayName: 'rxjs-marbles',
  preset: '../../jest.preset.js',
  globals: {},
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {
      tsConfig: 'tsconfig.spec.json'
    }],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],

  collectCoverageFrom: [
    'src/lib/**/*.ts',
    '!src/lib/**/index.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 92,
      branches: 100,
      lines: 92,
      functions: 91.66,
    },
  },
};
