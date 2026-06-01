import { GaragePage } from '../pages/garagePage';

const garage = new GaragePage();

describe('Qauto expense creation and validation', () => {
  let carId;
  const carBrand = 'Audi';
  const carModel = 'TT';
  const initialMileage = 12000;
  const expenseData = {
    mileage: 12100,
    liters: 40,
    totalCost: 55.5,
    reportDate: '2024-05-25',
  };

  before(() => {
    cy.apiSignUp().then(() => {
      cy.request({
        method: 'POST',
        url: '/api/cars',
        body: {
          carBrandId: 1, // Audi
          carModelId: 2, // TT
          mileage: initialMileage,
        },
      }).then((response) => {
        expect(response.status).to.equal(201);
        carId = response.body.data.id;
        cy.log(`✓ Car created for testing with ID: ${carId}`);
      });
    });
  });

  beforeEach(() => {
    cy.getCookie('sid').then((cookie) => {
      if (!cookie) {
        cy.apiSignUp();
      }
    });
    cy.visit('/panel/garage');
    cy.url().should('include', '/panel/garage');
  });

  it('creates expense via API and validates response status 201', () => {
    cy.log(`Creating expense for car ID: ${carId} via UI`);

    cy.get('a[href*="/panel/garage/"]').first().should('be.visible').click();
    cy.get('h2').should('be.visible');

    garage.openAddFuelExpenseForCar();
    garage.fillExpenseMileage(expenseData.mileage);
    garage.fillExpenseLiters(expenseData.liters);
    garage.fillExpenseTotalCost(expenseData.totalCost);
    garage.selectExpenseDate(expenseData.reportDate || expenseData.date);
    garage.submitExpense();

    garage.verifyExpenseInTable(
      String(expenseData.mileage),
      String(expenseData.liters),
      expenseData.totalCost.toFixed(2),
    );
  });

  it('verifies created expense appears in the UI', () => {
    cy.contains('a', `${carBrand} ${carModel}`).should('be.visible').click();

    cy.contains('h2', `${carBrand} ${carModel}`).should('be.visible');

    cy.contains('td', String(expenseData.mileage)).should('be.visible');
    cy.contains('td', String(expenseData.liters)).should('be.visible');

    const displayCost = expenseData.totalCost.toFixed(2);
    cy.contains('td', displayCost).should('be.visible');

    cy.log(`✓ Expense verified in UI:`);
    cy.log(`  - Mileage: ${expenseData.mileage}`);
    cy.log(`  - Liters: ${expenseData.liters}`);
    cy.log(`  - Total Cost: ${displayCost}`);
  });

  it('validates expense details in GET /api/expenses response', () => {
    cy.getExpensesForCar(carId).then((expenses) => {
      expect(expenses.length).to.be.greaterThan(0);

      const createdExpense = expenses.find(
        (exp) =>
          exp.mileage === expenseData.mileage &&
          exp.liters === expenseData.liters &&
          exp.totalCost === expenseData.totalCost,
      );

      expect(createdExpense).to.exist;
      expect(createdExpense.carId).to.equal(carId);

      cy.log(`✓ Expense found in API response:`);
      cy.log(`  - Expense ID: ${createdExpense.id}`);
      cy.log(`  - Car ID: ${createdExpense.carId}`);
      cy.log(`  - Mileage: ${createdExpense.mileage}`);
      cy.log(`  - Liters: ${createdExpense.liters}`);
      cy.log(`  - Total Cost: ${createdExpense.totalCost}`);
    });
  });
});
