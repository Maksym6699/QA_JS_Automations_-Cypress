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

  submitAddCarWithInterception() {
    cy.intercept('POST', '**/api/cars', (req) => {
      req.reply((res) => {
        expect(res.statusCode).to.equal(201);

        const carId = res.body.data.id;
        cy.wrap(carId).as('createdCarId');

        cy.writeFile('cypress/fixtures/carData.json', { id: carId });
      });
    }).as('createCarRequest');

    cy.get('ngb-modal-window').contains('button', 'Add').click();

    cy.wait('@createCarRequest').then((interception) => {
      expect(interception.response.statusCode).to.equal(201);
      const carId = interception.response.body.data.id;
      cy.wrap(carId).as('createdCarId');
    });

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

  getCarsList() {
    return cy.request({
      method: 'GET',
      url: '/api/cars',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  verifyCarInList(carId, brand, model, mileage) {
    this.getCarsList().then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.data).to.be.an('array');

      const car = response.body.data.find((c) => c.id === carId);
      expect(car).to.exist;
      expect(car.id).to.equal(carId);

      cy.log(
        `Car found in list: ID=${car.id}, Brand=${car.carBrandId}, Model=${car.carModelId}, Mileage=${car.initialMileage}`,
      );
    });

    return this;
  }

  fillExpenseMileage(mileage) {
    const selector = 'input[formcontrolname="mileage"], input[formControlName="mileage"], input[name="mileage"], input[id*="mileage"]';
    cy.get(selector).first().clear().type(`${mileage}`);
    return this;
  }

  fillExpenseLiters(liters) {
    const selector = 'input[formcontrolname="liters"], input[formControlName="liters"], input[name="liters"], input[id*="liters"]';
    cy.get(selector).first().clear().type(`${liters}`);
    return this;
  }

  fillExpenseTotalCost(cost) {
    const selector = 'input[formcontrolname="totalCost"], input[formControlName="totalCost"], input[name="totalCost"], input[id*="totalCost"], input[name="total_cost"]';
    cy.get(selector).first().clear().type(`${cost}`);
    return this;
  }

  selectExpenseDate(date) {
    const selector = 'input[formcontrolname="reportedAt"], input[formControlName="reportedAt"], input[name="reportedAt"], input[id*="ExpenseDate"], input[ngbdatepicker]';
    cy.get(selector).first().clear().type(date);
    return this;
  }

  submitExpense() {
    cy.get('ngb-modal-window').contains('button', 'Add').click();
    return this;
  }

  verifyExpenseInTable(mileage, liters, totalCost) {
    cy.contains('td', mileage).should('be.visible');
    cy.contains('td', liters).should('be.visible');
    cy.contains('td', totalCost).should('be.visible');
    cy.log(`✓ Expense verified in table: Mileage=${mileage}, Liters=${liters}, Cost=${totalCost}`);
    return this;
  }

  findCarByName(carName) {
    cy.contains('a', carName).click();
    return this;
  }
}
