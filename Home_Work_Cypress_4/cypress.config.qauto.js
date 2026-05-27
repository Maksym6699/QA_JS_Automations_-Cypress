const { defineConfig } = require('cypress');
const baseConfig = require('./cypress.config');

module.exports = defineConfig({
  e2e: {
    ...baseConfig.e2e,
    baseUrl: 'https://qauto.forstudy.space',
    env: {
      ...baseConfig.e2e.env,
      appUserEmail: 'qauto-guest-1@forstudy.space',
      appUserPassword: 'Welcome2qauto',
      userFirstName: 'Guest',
      userLastName: 'User',
      apiUrl: 'https://qauto.forstudy.space/api',
    },
  },
});
