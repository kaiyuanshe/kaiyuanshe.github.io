import NextMDX from '@next/mdx';
import { withSentryConfig } from '@sentry/nextjs';
import CopyPlugin from 'copy-webpack-plugin';
import { readdirSync, statSync } from 'fs';
import setPWA from 'next-pwa';
import withLess from 'next-with-less';
import RemarkFrontMatter from 'remark-frontmatter';
import RemarkGfm from 'remark-gfm';
import RemarkMdxFrontMatter from 'remark-mdx-frontmatter';
import webpack from 'webpack';

const { NODE_ENV, SENTRY_AUTH_TOKEN, SENTRY_ORG, SENTRY_PROJECT } = process.env;
const isDev = NODE_ENV === 'development';

const withMDX = NextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [RemarkFrontMatter, RemarkMdxFrontMatter, RemarkGfm],
  },
});

const withPWA = setPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: isDev,
});

/** @type {import('next').NextConfig} */
const nextConfig = withPWA(
  withLess(
    withMDX({
      pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],

      webpack: config => {
        config.plugins.push(
          new webpack.NormalModuleReplacementPlugin(/^node:/, resource => {
            resource.request = resource.request.replace(/^node:/, '');
          }),
        );

        if (
          statSync('pages/article/original', {
            throwIfNoEntry: false,
          })?.isDirectory() &&
          readdirSync('pages/article')[0]
        )
          config.plugins.push(
            new CopyPlugin({
              patterns: [
                {
                  from: 'pages/article/original',
                  to: 'static/article/original',
                },
              ],
            }),
          );
        return config;
      },
      rewrites: () => ({
        fallback: [
          {
            source: '/article/original/:path*',
            destination: `/_next/static/article/original/:path*`,
            has: [
              {
                type: 'header',
                key: 'Accept',
                value: '.*(image|audio|video|application)/.*',
              },
            ],
          },
          {
            source: '/:path*',
            destination: `https://kaiyuanshe.github.io/:path*`,
          },
        ],
      }),
    }),
  ),
);

export default isDev || !SENTRY_AUTH_TOKEN
  ? nextConfig
  : withSentryConfig(
      {
        ...nextConfig,
        sentry: {
          transpileClientSDK: true,
          autoInstrumentServerFunctions: false,
        },
      },
      {
        org: SENTRY_ORG,
        project: SENTRY_PROJECT,
        authToken: SENTRY_AUTH_TOKEN,
        silent: true,
      },
    );
