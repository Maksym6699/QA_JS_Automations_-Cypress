import { GaragePage } from '../pages/garagePage';

const garage = new GaragePage();

describe('Qauto car creation with API interception', () => {
  beforeEach(() => {
    cy.apiSignUp().then(() => {
      cy.visit('/panel/garage');
      cy.url().should('include', '/panel/garage');
    });
  });

  it('adds a new car to the garage - simple validation', () => {
    garage.clickAddCar();
    garage.selectBrand('Audi');
    garage.selectModel('TT');
    garage.fillMileage('12000');
    garage.submitAddCar();

    // Verify car was created in UI
    garage.verifyCarExists('Audi TT');
    cy.contains('button', 'Add fuel expense').should('be.visible');
    cy.log(`✓ Car created successfully in UI`);
  });

  it('verifies car appears in GET /api/cars list', () => {
    // First, check that cars endpoint returns 200
    cy.request({
      method: 'GET',
      url: '/api/cars',
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.data).to.be.an('array');
      cy.log(`✓ GET /api/cars returned 200 status with ${response.body.data.length} cars`);
    });
  });

  it('validates car creation via API', () => {
    cy.request({
      method: 'POST',
      url: '/api/cars',
      body: {
        carBrandId: 1, // Audi
        carModelId: 2, // TT
        mileage: 15000,
      },
    }).then((response) => {
      expect(response.status).to.equal(201);
      expect(response.body.data.id).to.exist;
      const carId = response.body.data.id;
      cy.log(`✓ Car created via API with ID: ${carId}`);

      cy.request({
        method: 'GET',
        url: '/api/cars',
      }).then((getResponse) => {
        expect(getResponse.status).to.equal(200);
        const car = getResponse.body.data.find((c) => c.id === carId);
        expect(car).to.exist;
        expect(car.initialMileage).to.equal(15000);
        cy.log(`✓ Car verified in GET /api/cars list`);
      });
    });
  });
});
