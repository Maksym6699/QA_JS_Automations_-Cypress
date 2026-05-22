export class GaragePage {
  clickAddCar() {
    cy.contains('button', 'Add car').click();
    return this;
  }

  selectBrand(brand) {
    cy.get('#addCarBrand').select(brand);
    return this;
  }

  selectModel(model) {
    cy.get('#addCarModel').select(model);
    return this;
  }

  fillMileage(mileage) {
    cy.get('#addCarMileage').clear().type(`${mileage}`);
    return this;
  }

  submitAddCar() {
    cy.get('ngb-modal-window').contains('button', 'Add').click();
    return this;
  }

  verifyCarExists(carTitle) {
    cy.contains(carTitle).should('be.visible');
    return this;
  }

  openAddFuelExpenseForCar() {
    cy.contains('button', 'Add fuel expense').click();
    return this;
  }
}
