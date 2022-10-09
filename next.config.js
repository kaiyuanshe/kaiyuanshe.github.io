const { NormalModuleReplacementPlugin } = require('webpack'),
  withLess = require('next-with-less'),
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
    webpack: config => {
      config.plugins.push(
        new NormalModuleReplacementPlugin(/^node:/, resource => {
          resource.request = resource.request.replace(/^node:/, '');
        }),
      );
      return config;
    },
    reactStrictMode: true,
  }),
);
