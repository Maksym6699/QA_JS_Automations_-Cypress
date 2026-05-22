const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      return config;
    },
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: false,
      html: true,
      json: true,
      charts: true,
      embeddedScreenshots: true,
      inlineAssets: true,
    },
    video: false,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 20000,
    env: {
      authUsername: 'guest',
      authPassword: 'welcome2qauto',
    },
  },
});
