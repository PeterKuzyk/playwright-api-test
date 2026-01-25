import {test, expect, request} from '@playwright/test';
import tags from '../test-data/tags.json'

test.beforeEach(async ({page}) => {
    // create a mock
    await page.route('*/**/api/tags', async route => {
        await route.fulfill({
            body: JSON.stringify(tags),
        })
    })
    await page.goto('https://conduit.bondaracademy.com/');
})

test('has title', async ({page}) => {
    await page.route('*/**/api/articles?limit=10&offset=0', async route => {
        const response = await route.fetch()
        const responseBody = await response.json()
        responseBody.articles [0].title = "This is a MOCK test title"
        responseBody.articles [0].description = "This is a MOCK description"
        // fulfill updated response
        await route.fulfill({
            body: JSON.stringify(responseBody),
        })
    })

    await page.getByText('Global Feed').click();
    await expect(page.locator('.navbar-brand')).toHaveText('conduit');
    await expect(page.locator('app-article-list h1').first()).toContainText("This is a MOCK test title");
    await expect(page.locator('app-article-list p').first()).toContainText("This is a MOCK description");
});

test('Perform API Request POST and DELETE article', async ({page, request}) => {
    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: {
            "user": {"email": "peterTest@test.com", "password": "12345678"}
        }
    })
    const responseBody = await response.json()
    const assessToken = responseBody.user.token

    const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
        data: {
            "article": {
                "title": "This  is a Test Title",
                "description": "This is a test Description",
                "body": "This is a test body ",
                "tagList": []
            }
        },
        headers: {
            Authorization: `Token ${assessToken}`
        }
    })
    console.log(await articleResponse.json())
    expect(articleResponse.status()).toBe(201)

    await page.getByText('Global Feed').click();
    const responseBody1 = await articleResponse.json();
    const articleId = responseBody1.article.slug;
    console.log(articleId);


    const deleteArticleResponse = await request.delete(`
https://conduit-api.bondaracademy.com/api/articles/${articleId}`, {
        headers: {
            Authorization: `Token ${assessToken}`
        }
    })
    console.log('Delete status:', deleteArticleResponse.status());
// If you expect a body, check if it exists before parsing
    const bodyBuffer = await deleteArticleResponse.body();
    if (bodyBuffer.length > 0) {
        console.log(JSON.parse(bodyBuffer.toString()));
    }
    expect(deleteArticleResponse.status()).toBe(204)

    const articlesListResponse = await request.get(
        'https://conduit-api.bondaracademy.com/api/articles',
        { headers: { Authorization: `Token ${assessToken}` } }
    );
    const articles = (await articlesListResponse.json()).articles;
    expect(articles.some(article => article.slug === articleId)).toBeFalsy();
})