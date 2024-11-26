module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  coverageReporters: ['text', 'lcov', 'json', 'html'],
  transformIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/*.test.js'],  // Procura por arquivos de teste que terminam com .test
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'json', 'vue'],

};
