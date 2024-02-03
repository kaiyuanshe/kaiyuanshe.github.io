module.exports = {
  presets: [
    // https://babeljs.io/docs/babel-preset-typescript
    [
      '@babel/preset-typescript',
      {
        allowDeclareFields: true,
        allowNamespaces: true,
        allExtensions: true,
        isTSX: true,
      },
    ],
    // https://babeljs.io/docs/babel-preset-react
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
        development: process.env.BABEL_ENV === 'development',
      },
    ],
  ],
  // https://babeljs.io/docs/babel-plugin-proposal-decorators#note-compatibility-with-babelplugin-transform-class-properties
  plugins: [['@babel/plugin-proposal-decorators', { version: '2023-05' }]],
};
