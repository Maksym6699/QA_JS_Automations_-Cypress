export class ExpensesPage {
  addExpense() {
    cy.contains('button', 'Add an expense').click();
    return this;
  }

  fillExpense({ mileage, liters, totalCost }) {
    cy.get('#addExpenseMileage').clear().type(`${mileage}`);
    cy.get('#addExpenseLiters').clear().type(`${liters}`);
    cy.get('#addExpenseTotalCost').clear().type(`${totalCost}`);
    return this;
  }

  submitExpense() {
    cy.get('ngb-modal-window').contains('button', 'Add').click();
    return this;
  }

  verifyExpenseRow({ date, mileage, liters, totalCost }) {
    const costRegex = new RegExp(
      `${Number(totalCost).toFixed(2)}\\s*USD|${Number(totalCost).toFixed(0)}\\s*USD`,
    );

    cy.contains('tr', date)
      .should('be.visible')
      .within(() => {
        cy.contains(new RegExp(`${mileage}`)).should('exist');
        cy.contains(`${liters}L`).should('exist');
        cy.contains(costRegex).should('exist');
      });
    return this;
  }
}
