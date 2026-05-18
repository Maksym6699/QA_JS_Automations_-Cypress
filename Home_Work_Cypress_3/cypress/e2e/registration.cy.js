const uniqueEmail = `testuser_${Date.now()}@qauto.example`;
const password = 'Password123!';

describe('QAuto registration flow', () => {
  it('registers a new account with a unique email', () => {
    cy.visit('/');
    cy.contains('button', 'Sign In').click();
    cy.contains('button', 'Registration').click();

    cy.get('#signupName').type('Test');
    cy.get('#signupLastName').type('User');
    cy.get('#signupEmail').type(uniqueEmail);
    cy.get('#signupPassword').type(password, { sensitive: true });
    cy.get('#signupRepeatPassword').type(password, { sensitive: true });

    cy.contains('button', 'Register').should('not.be.disabled').click();

    cy.url().should('include', '/panel/garage');
    cy.contains('Registration complete').should('be.visible');
    cy.contains('Log out').should('be.visible');
  });

  it('logs in again using custom login command', () => {
    cy.login(uniqueEmail, password);

    cy.url().should('include', '/panel/garage');
    cy.contains('Garage').should('be.visible');
  });

  it('keeps Register disabled if passwords do not match', () => {
    cy.visit('/');
    cy.contains('button', 'Sign In').click();
    cy.contains('button', 'Registration').click();

    cy.get('#signupName').type('Mismatch');
    cy.get('#signupLastName').type('Test');
    cy.get('#signupEmail').type(`mismatch_${Date.now()}@qauto.example`);
    cy.get('#signupPassword').type('Password123!', { sensitive: true });
    cy.get('#signupRepeatPassword').type('Password1234!', { sensitive: true });

    cy.contains('button', 'Register').should('be.disabled');
  });
});
