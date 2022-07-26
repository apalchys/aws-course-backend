const path = require('path');

module.exports = {
    rootDir: path.resolve(path.dirname(__dirname), './product-service'),

    roots: ['<rootDir>/src'],

    testMatch: ['<rootDir>/src/**/*.test.{js,jsx}'],

    moduleFileExtensions: ['js'],

    transform: {
        '^.+\\.(js|jsx)$': '<rootDir>/node_modules/babel-jest',
    },

    modulePaths: ['<rootDir>/src/'],
};
