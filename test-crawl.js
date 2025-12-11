/**
 * Run with: node test-crawl.js
 * Prerequisite: npm install puppeteer
 */
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--lang=ko-KR,ko']
  });
  const page = await browser.newPage();
  
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
  });

  const url = 'https://map.naver.com/p/smart-around/place/1079425515?c=15.00,0,0,0,dh&placePath=/home?from=map&fromPanelNum=2&timestamp=202512110945&locale=ko&svcName=map_pcv5';

  console.log(`Navigating to ${url}...`);
  await page.goto(url, { waitUntil: 'networkidle2' });

  try {
    console.log('Waiting for #entryIframe...');
    const iframeSelector = '#entryIframe';
    await page.waitForSelector(iframeSelector, { timeout: 10000 });

    const elementHandle = await page.$(iframeSelector);
    const frame = await elementHandle.contentFrame();

    if (!frame) {
        throw new Error('Could not get content frame from iframe element');
    }

    console.log('Iframe found. Waiting for content...');
    await frame.waitForSelector('body', { timeout: 10000 });
    
    // Wait for some content to load inside the frame. 
    await frame.waitForSelector('body', { timeout: 10000 });
    
    // Wait for the specific elements to ensure they are loaded
    try {
        await frame.waitForSelector('.GHAhO', { timeout: 5000 }); // Title
    } catch (e) {
        console.log("Title element not found immediately, continuing...");
    }

    const data = await frame.evaluate(() => {
        const result = {};

        // 1. Basic Info (Title, Category, Header Reviews)
        const titleEl = document.querySelector('.GHAhO');
        const categoryEl = document.querySelector('.lnJFt');
        result.title = titleEl ? titleEl.innerText : null;
        result.category = categoryEl ? categoryEl.innerText : null;

        const visitorReviewEl = document.querySelector('a[href*="review/visitor"]');
        const blogReviewEl = document.querySelector('a[href*="review/ugc"]');
        result.visitorReviews = visitorReviewEl ? visitorReviewEl.innerText : null;
        result.blogReviews = blogReviewEl ? blogReviewEl.innerText : null;

        const descriptionEl = document.querySelector('.XtBbS');
        result.description = descriptionEl ? descriptionEl.innerText : null;

        // 2. Details (Address, Hours, Phone)
        const addressEl = document.querySelector('.LDgIH');
        result.address = addressEl ? addressEl.innerText : null;

        const hoursEl = document.querySelector('.A_cdD'); // Container for hours status
        // Extract text but remove newlines for cleaner output
        result.businessHours = hoursEl ? hoursEl.innerText.replace(/[\n\r]+/g, ' ') : null;

        const phoneEl = document.querySelector('.xlx7Q');
        result.phone = phoneEl ? phoneEl.innerText : null;

        // 4. Image
        // Selector provided: .fNygA > a > img
        const imgEl = document.querySelector('.fNygA img');
        result.imageUrl = imgEl ? imgEl.src : null;

        return result;
    });

    console.log(JSON.stringify(data, null, 2));

  } catch (error) {
    console.error('Error during crawling:', error.message);
    await page.screenshot({ path: 'debug_error.png' });
  } finally {
    await browser.close();
  }
})();
