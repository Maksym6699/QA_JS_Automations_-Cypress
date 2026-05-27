const { defineConfig } = require('cypress');
const baseConfig = require('./cypress.config');

module.exports = defineConfig({
  e2e: {
    ...baseConfig.e2e,
    baseUrl: 'https://qauto2.forstudy.space',
    env: {
      ...baseConfig.e2e.env,
      appUserEmail: 'qauto2-guest-2@forstudy.space',
      appUserPassword: 'Welcome2qauto',
      userFirstName: 'Guest',
      userLastName: 'User',
      apiUrl: 'https://qauto2.forstudy.space/api',
    },
  },
});
