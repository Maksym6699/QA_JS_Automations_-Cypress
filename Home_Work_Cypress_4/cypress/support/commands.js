Cypress.Commands.add('visitWithAuth', (path = '/') => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${Cypress.config('baseUrl')}${normalizedPath}`;

  return cy.visit({
    url,
    auth: {
      username: Cypress.env('authUsername'),
      password: Cypress.env('authPassword'),
    },
  });
});
