const transpile = require('next-transpile-modules'),
  withLess = require('next-with-less'),
  withPWA = require('next-pwa');

const { NODE_ENV } = process.env,
  withTM = transpile(['echarts', 'zrender']);

/** @type {import('next').NextConfig} */
module.exports = withPWA({
  ...withLess({
    ...withTM(),
    reactStrictMode: true,
  }),
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: NODE_ENV === 'development',
  },
});
