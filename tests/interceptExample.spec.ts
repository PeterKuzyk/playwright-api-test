import {test, expect, request} from '@playwright/test';
import path from 'path';
import tags from '../test-data/tags.json'

test.beforeEach(async ({page}) => {
    // create a mock
    await page.route('*/**/api/tags', async route => {
        await route.fulfill({
            body: JSON.stringify(tags),
        })
    })
    await page.goto('https://conduit.bondaracademy.com/');

});

test('create article and delete it using intercept', async ({page, request}) => {
    await page.getByText('New Article').click();
    await page.getByRole('textbox', {name: 'Article Title'}).fill('Playwright is awesome');
    await page.getByRole('textbox', {name: 'What\'s this article about?'}).fill('This is a test Description about the Playwright');
    await page.getByRole('textbox', {name: 'Write your article (in markdown)'}).fill('This is a test body');
    await page.getByRole('button', {name: 'Publish Article'}).click();

    // wait for the API response and extract the article slug ID
    const articleResponse = await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/');
    const articleResponseBody = await articleResponse.json();
    const slugId = articleResponseBody.article.slug;
    console.log('Article Slug ID:', slugId);

    await page.getByText('Home').click();
    await page.getByText('Global Feed').click();

    await expect(page.locator('app-article-list h1').first()).toContainText('Playwright is awesome');

    // intercept and delete the article using the slug ID
    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: {
            "user": {"email": "peterTest@test.com", "password": "12345678"}
        }
    })
    const responseBody = await response.json()
    const assessToken = responseBody.user.token

    const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`, {
        headers: {
            Authorization: `Token ${assessToken}`
        },
    })
    expect(deleteArticleResponse.status()).toBe(204);
});