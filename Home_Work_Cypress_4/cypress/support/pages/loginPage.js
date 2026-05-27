class LoginPage {
  visit() {
    cy.visitWithAuth('/');
  }

  openLoginModal() {
    this.visit();
    cy.get('button.header_signin', { timeout: 20000 }).should('be.visible').click({ force: true });
    cy.get('#signinEmail', { timeout: 20000 }).should('be.visible');
  }

  fillInput(keys, value) {
    const selectors = keys
      .flatMap((key) => [
        `input[placeholder*="${key}"]`,
        `input[name*="${key.toLowerCase()}"]`,
        `input[id*="${key.toLowerCase()}"]`,
        `input[formcontrolname*="${key.toLowerCase()}"]`,
      ])
      .join(', ');

    cy.get(selectors, { timeout: 20000 }).first().should('be.visible').clear().type(value);
  }

  login() {
    const email = Cypress.env('appUserEmail');
    const password = Cypress.env('appUserPassword');

    this.openLoginModal();
    this.fillInput(['signinEmail', 'email', 'Email'], email);
    this.fillInput(['signinPassword', 'password', 'Password'], password);
    cy.contains('button', /login/i).should('be.visible').click({ force: true });
  }
}

module.exports = LoginPage;
