module.exports = {
  roots: ['<rootDir>/frontend', '<rootDir>/service'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/test/.*|(\\.|/)test)\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverage: true,
  collectCoverageFrom: [
    '**/src/**/*.{ts,tsx}',
    '!**/*.d.{ts,tsx}',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!**/index.ts',
  ],
  coverageReporters: ['text', 'json', 'html', 'cobertura'],
  reporters: ['default', 'jest-junit'],
  globals: {
    'ts-jest': {
      diagnostics: {
        warnOnly: true,
      },
      isolatedModules: true,
      tsConfig: './tsconfig.json',
    },
  },
}
