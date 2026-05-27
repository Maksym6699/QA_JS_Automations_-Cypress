class GaragePage {
  open() {
    cy.visitWithAuth('/panel/garage');
  }

  fillField(keys, value) {
    const selectors = keys
      .flatMap((key) => [
        `input[placeholder*="${key}"]`,
        `input[name*="${key.toLowerCase()}"]`,
        `input[id*="${key.toLowerCase()}"]`,
        `input[formcontrolname*="${key.toLowerCase()}"]`,
      ])
      .join(', ');

    cy.get(selectors).first().should('be.visible').clear().type(value);
  }

  clickAddCar() {
    cy.contains('button', /add.*car|create.*car/i)
      .should('be.visible')
      .click({ force: true });
  }

  submitCar() {
    cy.get('ngb-modal-window, .modal-content', { timeout: 20000 })
      .find('button')
      .contains(/save|create|add/i)
      .should('be.visible')
      .click({ force: true });
  }

  addCar(data) {
    this.clickAddCar();
    cy.get('#addCarBrand', { timeout: 20000 }).should('be.visible').select(data.brand);
    cy.get('#addCarModel', { timeout: 20000 }).should('be.visible').select(data.model);
    cy.get('#addCarMileage', { timeout: 20000 }).should('be.visible').clear().type(data.mileage);
    this.submitCar();
  }

  verifyCarCreated(model) {
    cy.contains(model, { timeout: 20000 }).should('exist');
  }
}

module.exports = GaragePage;
