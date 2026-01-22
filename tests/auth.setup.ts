import {test as setup} from '@playwright/test';
import path from 'path';
import user from '../.auth//user.json';
import fs from 'fs';

const authFile = path.join(__dirname, '../.auth/user.json');

setup('authentication', async ({page,request}) => {
  // UI authentication flow example
  //   await page.goto('https://conduit.bondaracademy.com');
  //   await page.getByText('Sign in').click();
  //   await page.getByPlaceholder('Email').fill('peterTest@test.com');
  //   await page.getByPlaceholder('Password').fill("12345678");
  //   await page.getByRole('button', {name: 'Sign in'}).click();
  //   await page.waitForResponse('https://conduit-api.bondaracademy.com/api/tags');
  //
  //   await page.context().storageState({path: authFile});

    // API authentication flow example
    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: {
            "user": {"email": "peterTest@test.com", "password": "12345678"}
        }
    })
    const responseBody = await response.json()
    const assessToken = responseBody.user.token
    user.origins[0].localStorage[0].value = assessToken
    fs.writeFileSync(authFile, JSON.stringify(user))

   // process.env.ACCESS_TOKEN = assessToken;
})