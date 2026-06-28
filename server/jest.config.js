module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: {
        target: 'ES2022',
        module: 'CommonJS',
        lib: ['ES2022'],
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        types: ['jest', 'node']
      }
    }],
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',
    '!src/seed.ts'
  ],
  coverageDirectory: 'coverage',
  verbose: true
};
