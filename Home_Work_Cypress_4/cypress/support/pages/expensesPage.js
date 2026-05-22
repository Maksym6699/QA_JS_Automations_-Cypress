class ExpensesPage {
  open() {
    cy.visitWithAuth('/panel/expenses');
  }

  fillField(keys, value) {
    const selectors = keys
      .flatMap((key) => [
        `input[placeholder*="${key}"]`,
        `input[name*="${key.toLowerCase()}"]`,
        `input[id*="${key.toLowerCase()}"]`,
        `input[formcontrolname*="${key.toLowerCase()}"]`,
        `textarea[placeholder*="${key}"]`,
        `textarea[name*="${key.toLowerCase()}"]`,
      ])
      .join(', ');

    cy.get(selectors).first().should('be.visible').clear().type(value);
  }

  selectCar(option) {
    cy.get('#addExpenseCar', { timeout: 20000 })
      .should('be.visible')
      .should('not.be.disabled')
      .then(($select) => {
        cy.wrap($select)
          .find('option')
          .contains(option)
          .then(($option) => {
            cy.wrap($select).select($option.val(), { force: true });
          });
      });
  }

  clickAddExpense() {
    cy.contains('button', /add.*expense|create.*expense|add expense/i)
      .should('be.visible')
      .should('not.be.disabled')
      .click({ force: true });
  }

  submitExpense() {
    cy.get('ngb-modal-window, .modal-content', { timeout: 20000 })
      .find('button')
      .contains(/save|create|add/i)
      .should('be.visible')
      .click({ force: true });
  }

  addExpense(data) {
    this.clickAddExpense();

    if (data.car) {
      this.selectCar(data.car);
    }

    cy.get('#addExpenseDate', { timeout: 20000 })
      .should('be.visible')
      .clear()
      .type(data.date, { force: true })
      .blur();
    cy.get('#addExpenseMileage', { timeout: 20000 })
      .should('be.visible')
      .clear()
      .type(data.mileage);
    cy.get('#addExpenseLiters', { timeout: 20000 }).should('be.visible').clear().type(data.liters);
    cy.get('#addExpenseTotalCost', { timeout: 20000 })
      .should('be.visible')
      .clear()
      .type(data.totalCost);

    this.submitExpense();
  }

  verifyExpenseCreated(amount) {
    cy.contains(new RegExp(amount), { timeout: 20000 }).should('exist');
  }
}

module.exports = ExpensesPage;
