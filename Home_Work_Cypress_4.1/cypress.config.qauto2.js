const { defineConfig } = require('cypress');

module.exports = defineConfig({
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/reports/mochawesome',
    overwrite: false,
    html: true,
    json: true,
    timestamp: 'mmddyyyy_HHMMss',
  },
  e2e: {
    baseUrl: 'https://guest:welcome2qauto@qauto2.forstudy.space',
    env: {
      userEmail: 'guest-qauto2@forstudy.space',
      userLogin: 'guest',
      userPassword: 'welcome2qauto',
    },
  },
});
