const withLess = require('next-with-less'),
  setPWA = require('next-pwa');

const { NODE_ENV } = process.env;

const withPWA = setPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
module.exports = withPWA(
  withLess({
    reactStrictMode: true,
  }),
);
