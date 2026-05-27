Cypress.Commands.add('apiSignUp', () => {
  const email = `qacypress+${Date.now()}@forstudy.space`;

  return cy
    .request({
      method: 'POST',
      url: '/api/auth/signup',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        name: 'Cypress',
        lastName: 'User',
        email,
        password: 'Welcome2qauto',
        repeatPassword: 'Welcome2qauto',
      },
    })
    .then((signupResponse) => {
      expect(signupResponse.status).to.equal(201);
      expect(signupResponse.body.status).to.equal('ok');

      const signupSetCookie =
        signupResponse.headers['set-cookie'] || signupResponse.headers['Set-Cookie'];

      if (signupSetCookie) {
        const sidCookieRaw = Array.isArray(signupSetCookie)
          ? signupSetCookie.find((cookie) => cookie.includes('sid='))
          : signupSetCookie;

        if (sidCookieRaw && sidCookieRaw.includes('sid=')) {
          const sidValue = sidCookieRaw.split(';')[0].split('=')[1];
          return cy
            .setCookie('sid', sidValue, { domain: 'qauto.forstudy.space', path: '/' })
            .then(() => ({ email, sid: sidValue }));
        }
      }

      return cy
        .request({
          method: 'POST',
          url: '/api/auth/signin',
          headers: { 'Content-Type': 'application/json' },
          body: {
            email,
            password: 'Welcome2qauto',
          },
        })
        .then((signinResponse) => {
          expect(signinResponse.status).to.equal(200);

          const setCookieHeader =
            signinResponse.headers['set-cookie'] || signinResponse.headers['Set-Cookie'];
          if (!setCookieHeader) {
            throw new Error('apiSignUp: no Set-Cookie header received from signin');
          }

          const sidCookieRaw = Array.isArray(setCookieHeader)
            ? setCookieHeader.find((cookie) => cookie.includes('sid='))
            : setCookieHeader;

          if (!sidCookieRaw || !sidCookieRaw.includes('sid=')) {
            throw new Error('apiSignUp: sid cookie not found in Set-Cookie header');
          }

          const sidValue = sidCookieRaw.split(';')[0].split('=')[1];
          return cy
            .setCookie('sid', sidValue, { domain: 'qauto.forstudy.space', path: '/' })
            .then(() => ({ email, sid: sidValue }));
        });
    });
});

Cypress.Commands.add('createExpenseViaAPI', (carId, expenseData) => {
  const formats = [];
  const rawDate = expenseData.reportDate || expenseData.date;
  formats.push(rawDate);
  formats.push(new Date(rawDate).toISOString());
  try {
    const d = new Date(rawDate);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    formats.push(`${dd}.${mm}.${yyyy}`);
  } catch (e) {}
  formats.push(Date.parse(rawDate));

  const tryPost = (idx) => {
    const dateValue = formats[idx];
    const body = {
      carId: carId,
      mileage: expenseData.mileage,
      liters: expenseData.liters,
      totalCost: expenseData.totalCost,
      reportDate: dateValue,
    };

    return cy
      .request({
        method: 'POST',
        url: '/api/expenses',
        headers: { 'Content-Type': 'application/json' },
        body,
        failOnStatusCode: false,
      })
      .then((response) => {
        if (response.status === 201) {
          Cypress.log({ message: `✓ Expense created via API using date format idx ${idx}` });
          return response.body.data;
        }
        if (idx + 1 < formats.length) {
          Cypress.log({ message: `Attempt ${idx} failed (${response.body?.message || response.status}); trying next date format` });
          return tryPost(idx + 1);
        }
        throw new Error(
          `createExpenseViaAPI: all date format attempts failed. Last response: ${response.status} ${JSON.stringify(response.body)}`,
        );
      });
  };

  return tryPost(0);
});

Cypress.Commands.add('getExpensesForCar', (carId) => {
  return cy
    .request({
      method: 'GET',
      url: `/api/expenses?carId=${carId}`,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.data).to.be.an('array');
      Cypress.log({ message: `Retrieved ${response.body.data.length} expenses for car ${carId}` });
      return response.body.data;
    });
});
