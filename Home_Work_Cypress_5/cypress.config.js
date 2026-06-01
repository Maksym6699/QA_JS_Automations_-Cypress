const { defineConfig } = require('cypress');

module.exports = defineConfig({
  projectId: '6mm32c',
  e2e: {
    baseUrl: 'https://guest:welcome2qauto@qauto.forstudy.space',
    env: {
      userEmail: 'guest-qauto@forstudy.space',
      userLogin: 'guest',
      userPassword: 'welcome2qauto',
    },
  },
});
