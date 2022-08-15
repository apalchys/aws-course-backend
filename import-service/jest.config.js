const path = require('path');

module.exports = {
    rootDir: path.resolve(path.dirname(__dirname), './import-service'),

    roots: ['<rootDir>/src'],

    testMatch: ['<rootDir>/src/**/*.test.{js,jsx}'],

    moduleFileExtensions: ['js'],

    setupFiles: ['<rootDir>.jest/env.js'],

    transform: {
        '^.+\\.(js|jsx)$': '<rootDir>/node_modules/babel-jest',
    },

    modulePaths: ['<rootDir>/src/'],
};
