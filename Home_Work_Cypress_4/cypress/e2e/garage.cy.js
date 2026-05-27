const LoginPage = require('../support/pages/loginPage');
const GaragePage = require('../support/pages/garagePage');
const ExpensesPage = require('../support/pages/expensesPage');

describe('QAuto garage and fuel expense UI flow', () => {
  const loginPage = new LoginPage();
  const garagePage = new GaragePage();
  const expensesPage = new ExpensesPage();

  const uniqueId = Date.now();
  const carData = {
    brand: 'Audi',
    model: 'A6',
    mileage: '12000',
  };

  const expenseData = {
    date: (() => {
      const d = new Date();
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}.${month}.${year}`;
    })(),
    mileage: '12100',
    liters: '40',
    totalCost: '55',
  };

  it('logs in, creates a car in garage and adds fuel expense', () => {
    loginPage.login();
    cy.contains('a', /garage/i).should('be.visible');

    garagePage.open();
    garagePage.addCar(carData);
    garagePage.verifyCarCreated(carData.model);

    expensesPage.open();
    expensesPage.addExpense({
      car: `${carData.brand} ${carData.model}`,
      date: expenseData.date,
      mileage: expenseData.mileage,
      liters: expenseData.liters,
      totalCost: expenseData.totalCost,
    });
    expensesPage.verifyExpenseCreated(expenseData.totalCost);
  });
});
