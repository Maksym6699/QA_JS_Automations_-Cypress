import { GaragePage } from '../pages/garagePage';
import { ExpensesPage } from '../pages/expensesPage';

const garage = new GaragePage();
const expenses = new ExpensesPage();

describe('Qauto garage and fuel expense flows', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.contains('button', 'Guest log in').click();
    cy.url().should('include', '/panel/garage');
  });

  it('adds a new car to the garage', () => {
    garage.clickAddCar();
    garage.selectBrand('Audi');
    garage.selectModel('TT');
    garage.fillMileage('12000');
    garage.submitAddCar();

    garage.verifyCarExists('Audi TT');
    cy.contains('button', 'Add fuel expense').should('be.visible');
  });

  it('adds a fuel expense for the created car', () => {
    garage.clickAddCar();
    garage.selectBrand('Audi');
    garage.selectModel('TT');
    garage.fillMileage('12000');
    garage.submitAddCar();

    garage.verifyCarExists('Audi TT');
    garage.openAddFuelExpenseForCar();

    expenses.fillExpense({ mileage: '12100', liters: '40', totalCost: '55' });
    expenses.submitExpense();

    cy.contains('Fuel expense added').should('be.visible');
    expenses.verifyExpenseRow({
      date: '19.05.2026',
      mileage: '12100',
      liters: '40',
      totalCost: '55.00',
    });
  });
});
