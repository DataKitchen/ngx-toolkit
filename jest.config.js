


module.exports = {
  projects: [
    'projects/*'
  ],

  coverageDirectory: 'coverage',
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: 'coverage', outputName: 'junit.xml' }],
  ],
  coverageReporters: ['html', 'lcov', 'text', 'cobertura'],
  collectCoverageFrom: [
    'src/(app|lib)/**/*.ts',
    '!src/(app|lib)/**/*.module.ts',
    '!src/(app|lib)/**/*.mock.ts',
    '!src/(app|lib)/**/index.ts',
    '!src/lib/mock-service.ts'
  ],
  coverageThreshold: {
    global: {
      statements: 95.28,
      branches: 92.85,
      functions: 93.15,
      lines: 95.22,
    },
  }
};
