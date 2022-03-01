import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'jest-playwright-preset',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testTimeout: 60000,
};
export default config;
