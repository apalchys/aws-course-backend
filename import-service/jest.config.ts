import path from 'path';

export default {
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  rootDir: path.resolve(path.dirname(__dirname), './import-service'),
  roots: ['<rootDir>/src'],
  setupFiles: ['<rootDir>.jest/env.js'],
  modulePaths: ['<rootDir>/src/'],
};
