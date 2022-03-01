module.exports = {
  browsers: ['chromium', 'firefox', 'webkit'],
  launchOptions: {
    headless: false,
  },
  serverOptions: {
    command: 'npm run dev',
    port: 3000,
    debug: true,
  },
};
