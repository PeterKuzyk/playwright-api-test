import { test, expect } from '@playwright/test';

test.beforeEach(async ({page}) => {
    // create a mock
    await page.route('https://conduit-api.bondaracademy.com/api/tags',async route => {
        const tags = {
            "tags": [
                "Automation",
                "Playwright",
            ]
        }
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(tags),
        })
    })
     await page.goto('https://conduit.bondaracademy.com/');
})

test('has title', async ({ page }) => {
 await expect (page.locator('.navbar-brand')).toHaveText('conduit');
});
