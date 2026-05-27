describe('Debug Auth', () => {
  it('signs up via API, preserves the cookie, and loads the garage page', () => {
    cy.apiSignUp().then(({ email }) => {
      cy.request({
        method: 'GET',
        url: '/api/cars',
      }).then((carsResponse) => {
        expect(carsResponse.status).to.equal(200);
        expect(carsResponse.body.status).to.equal('ok');
        expect(carsResponse.body.data).to.be.an('array');
      });

      cy.visit('/panel/garage');
      cy.url().should('include', '/panel/garage');
      cy.contains('button', 'Add car').should('be.visible');
      cy.writeFile('cypress/fixtures/debug_auth_response.json', {
        signedUpEmail: email,
      });
    });
  });
});
