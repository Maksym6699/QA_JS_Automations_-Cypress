describe('Debug garage page with API login', () => {
  it('logs garage buttons and visible form fields after API signin', () => {
    const apiUrl = `${Cypress.env('apiUrl')}/auth/signin`;
    const authHeader = `Basic ${btoa(`${Cypress.env('authUsername')}:${Cypress.env('authPassword')}`)}`;

    cy.request({
      method: 'POST',
      url: apiUrl,
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: {
        email: Cypress.env('appUserEmail'),
        password: Cypress.env('appUserPassword'),
      },
      followRedirect: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      const sidCookie = response.headers['set-cookie']?.find((cookie) => cookie.startsWith('sid='));
      expect(sidCookie, 'session cookie').to.exist;
      const sid = sidCookie.split(';')[0].split('=')[1];
      cy.setCookie('sid', sid, { domain: '.forstudy.space', path: '/' });
      cy.visitWithAuth('/panel/garage');
      cy.wait(3000);

      cy.get('button, a').then(($els) => {
        const buttons = [];
        $els.each((_, el) => {
          buttons.push({
            tag: el.tagName.toLowerCase(),
            text: el.innerText.trim(),
            class: el.className || null,
          });
        });
        cy.writeFile('cypress/debug/garage-buttons.json', buttons);
      });

      cy.contains('button', 'Add car', { timeout: 20000 })
        .should('be.visible')
        .click({ force: true });

      cy.wait(2000);

      cy.get('label, input, select, textarea', { timeout: 20000 }).then(($els) => {
        const fields = [];
        $els.each((_, el) => {
          fields.push({
            tag: el.tagName.toLowerCase(),
            text: el.innerText?.trim() || null,
            type: el.type || null,
            id: el.id || null,
            name: el.name || null,
            placeholder: el.placeholder || null,
          });
        });
        cy.writeFile('cypress/debug/garage-elements.json', fields);
      });

      cy.visitWithAuth('/panel/expenses');
      cy.wait(3000);

      cy.contains('button', /Add an expense|Add expense/i, { timeout: 20000 })
        .should('be.visible')
        .click({ force: true });

      cy.wait(2000);

      cy.document().then((doc) => {
        cy.writeFile('cypress/debug/expense-page.html', doc.documentElement.outerHTML);
      });

      cy.get('label, input, select, textarea', { timeout: 20000 }).then(($els) => {
        const fields = [];
        $els.each((_, el) => {
          fields.push({
            tag: el.tagName.toLowerCase(),
            text: el.innerText?.trim() || null,
            type: el.type || null,
            id: el.id || null,
            name: el.name || null,
            placeholder: el.placeholder || null,
          });
        });
        cy.writeFile('cypress/debug/expense-elements.json', fields);
      });
    });
  });
});
