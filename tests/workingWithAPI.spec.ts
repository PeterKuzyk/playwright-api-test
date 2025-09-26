import {test, expect} from '@playwright/test';
import tags from '../test-data/tags.json'


test.beforeEach(async ({page}) => {
    // create a mock
    await page.route('*/**/api/tags', async route => {
        await route.fulfill({
            body: JSON.stringify(tags),
        })
    })
    // intercept the response and modify it, fulfill updated response
    await page.route('*/**/api/articles?limit=10&offset=0', async route => {
      const response = await route.fetch()
        const responseBody = await response.json()
        responseBody.articles [0].title = "This is a test title"
        responseBody.articles [0].description = "This is a description"
        // fulfill updated response
        await route.fulfill({
            body: JSON.stringify(responseBody),
        })
    })
    await page.goto('https://conduit.bondaracademy.com/');

})

test('has title', async ({page}) => {
    await expect(page.locator('.navbar-brand')).toHaveText('conduit');

    await expect(page.locator('app-article-list h1').first()).toContainText("This is a test title");
    await expect(page.locator('app-article-list p').first()).toContainText("This is a description");
});
