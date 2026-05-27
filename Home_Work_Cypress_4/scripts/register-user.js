const { Buffer } = require('buffer');

const apps = {
  qauto: {
    baseUrl: 'https://qauto.forstudy.space',
    email: 'qauto-guest-1@forstudy.space',
    password: 'Welcome2qauto',
    firstName: 'Guest',
    lastName: 'User',
  },
  qauto2: {
    baseUrl: 'https://qauto2.forstudy.space',
    email: 'qauto2-guest-2@forstudy.space',
    password: 'Welcome2qauto',
    firstName: 'Guest',
    lastName: 'User',
  },
};

const appKey = process.argv[2];

if (!appKey || !apps[appKey]) {
  console.error('Usage: node scripts/register-user.js <qauto|qauto2>');
  process.exit(1);
}

const app = apps[appKey];
const url = `${app.baseUrl}/api/auth/signup`;
const authHeader = `Basic ${Buffer.from('guest:welcome2qauto').toString('base64')}`;

async function register() {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: app.email,
        password: app.password,
        repeatPassword: app.password,
        name: app.firstName,
        lastName: app.lastName,
      }),
    });

    const result = await response.json();
    if (result.status === 'ok') {
      console.log(`${appKey} registration succeeded:`, result.data);
      process.exit(0);
    }

    if (result.status === 'error' && result.message === 'User already exists') {
      console.log(`${appKey} registration skipped: user already exists.`);
      process.exit(0);
    }

    console.error(`${appKey} registration failed:`, result);
    process.exit(2);
  } catch (error) {
    console.error(`${appKey} registration error:`, error);
    process.exit(3);
  }
}

register();
