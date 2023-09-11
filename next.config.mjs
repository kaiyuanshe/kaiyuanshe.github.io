import NextMDX from '@next/mdx';
import setPWA from 'next-pwa';
import withLess from 'next-with-less';
import RemarkFrontMatter from 'remark-frontmatter';
import RemarkGfm from 'remark-gfm';
import RemarkMdxFrontMatter from 'remark-mdx-frontmatter';
import webpack from 'webpack';
import CopyPlugin from 'copy-webpack-plugin';

const { NODE_ENV } = process.env;

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
  disable: NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
export default withPWA(
  withLess(
    withMDX({
      pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],

      webpack: config => {
        config.plugins.push(
          new webpack.NormalModuleReplacementPlugin(/^node:/, resource => {
            resource.request = resource.request.replace(/^node:/, '');
          }),
          new CopyPlugin({
            patterns: [
              { from: 'pages/article/original', to: 'static/article/original' },
            ],
          }),
        );
        return config;
      },
      rewrites: async () => ({
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
