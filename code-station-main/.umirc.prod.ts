import { defineConfig } from '@umijs/max';

export default defineConfig({
  // define: {
  //   'process.env': {
  //     NODE_ENV: 'prod',
  //     UMI_ENV: 'prod',
  //     date: '2022-08-22',
  //   },
  // },
  extraBabelPlugins: [
    ['transform-remove-console', { exclude: ['error', 'warn'] }],
  ],
});
