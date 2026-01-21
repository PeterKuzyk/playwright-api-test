import {expect, test} from "@playwright/test";


test('create article', async ({page}) => {
    await page.getByText('Sign in').click();
    await page.getByPlaceholder('Email').fill('peterTest@test.com');
    await page.getByPlaceholder('Password').fill("12345678");
    await page.getByRole('button', {name: 'Sign in'}).click();
    await page.getByText('New Article').click();
    await page.getByRole('textbox',{name: 'Article Title'}).fill('Playwright is awesome');
    await page.getByRole('textbox', {name: 'What\'s this article about?'}).fill('This is a test Description about the Playwright');
    await page.getByRole('textbox', {name:'Write your article (in markdown)'}).fill('This is a test body');
    await page.getByRole('button', {name: 'Publish Article'}).click();
    await page.getByText('Home').click();

    await expect(page.locator('app-article-list h1').first()).toContainText('Playwright is awesome');
});import {test, expect} from '@playwright/test';
import tags from '../test-data/tags.json'