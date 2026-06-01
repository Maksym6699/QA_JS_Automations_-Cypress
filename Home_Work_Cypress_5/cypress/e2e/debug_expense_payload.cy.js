import { GaragePage } from '../pages/garagePage';
const garage = new GaragePage();

describe('Debug Expense Payload', () => {
  it('captures POST /api/expenses body sent by the UI', () => {
    const carName = 'Audi TT';
    const initialMileage = 12000;
    const expense = { mileage: 12100, liters: 40, totalCost: 55.5, date: '2024-05-25' };

    cy.apiSignUp().then(() => {
      cy.request({
        method: 'POST',
        url: '/api/cars',
        body: { carBrandId: 1, carModelId: 2, mileage: initialMileage },
      }).then((res) => {
        expect(res.status).to.equal(201);
        const carId = res.body.data.id;

        cy.visit('/panel/garage');
        cy.url().should('include', '/panel/garage');
            cy.request({ method: 'GET', url: '/api/cars' }).then((carsResp) => {
          cy.writeFile('cypress/fixtures/debug_cars_list.json', carsResp.body);
        });

        cy.intercept('POST', '**/api/expenses').as('postExpense');

        garage.openAddFuelExpenseForCar();
        garage.fillExpenseMileage(expense.mileage);
        garage.fillExpenseLiters(expense.liters);
        garage.fillExpenseTotalCost(expense.totalCost);
        garage.selectExpenseDate(expense.date);

        garage.submitExpense();
        cy.wait('@postExpense').then((interception) => {
          cy.writeFile('cypress/fixtures/last_ui_expense_request.json', interception.request.body);
          cy.writeFile('cypress/fixtures/last_ui_expense_response.json', interception.response.body);
          expect(interception.response.statusCode).to.equal(201);
          cy.log('Captured request body and response');
        });

      });
    });
  });
});
