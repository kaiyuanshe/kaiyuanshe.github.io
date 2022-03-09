const withLess = require('next-with-less'),
  withPWA = require('next-pwa');

const { NODE_ENV } = process.env;

/** @type {import('next').NextConfig} */
module.exports = withPWA({
  ...withLess({
    reactStrictMode: true,
  }),
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: NODE_ENV === 'development',
  },
});
