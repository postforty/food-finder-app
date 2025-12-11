'use server'

import puppeteer from 'puppeteer';
import { db } from '@/lib/firebase/admin';
import { Timestamp } from 'firebase-admin/firestore';

export async function crawlAndSaveRestaurant(url: string) {
  let browser;
  try {
    // ... (브라우저 실행 코드는 동일)
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--lang=ko-KR,ko']
    });
    const page = await browser.newPage();
    
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
    });

    console.log(`Navigating to ${url}...`);
    // NOTE: Admin SDK doesn't strictly need PROJECT_ID env var for itself if creds are provided, 
    // but good to keep basic logging.
    
    await page.goto(url, { waitUntil: 'networkidle2' });

    const iframeSelector = '#entryIframe';
    try {
        await page.waitForSelector(iframeSelector, { timeout: 10000 });
    } catch(e) {
        throw new Error('네이버 지도 페이지 형식이 아닙니다 (#entryIframe을 찾을 수 없습니다). URL이 올바른지 확인해주세요.');
    }

    const elementHandle = await page.$(iframeSelector);
    if (!elementHandle) throw new Error('iframe 핸들을 가져올 수 없습니다.');
    
    const frame = await elementHandle.contentFrame();

    if (!frame) {
        throw new Error('iframe 컨텐츠를 로드할 수 없습니다.');
    }

    await frame.waitForSelector('body', { timeout: 10000 });
    try {
        await frame.waitForSelector('.GHAhO', { timeout: 5000 }); // Title
    } catch (e) {
        // Ignore waiting error, proceed to evaluate
    }

    const data = await frame.evaluate(() => {
        const result: any = {};

        // 1. Basic Info (Title, Category)
        const titleEl = document.querySelector('.GHAhO');
        const categoryEl = document.querySelector('.lnJFt');
        result.name = titleEl ? (titleEl as HTMLElement).innerText : '';
        result.category = categoryEl ? (categoryEl as HTMLElement).innerText : '';

        // 2. Reviews
        const visitorReviewEl = document.querySelector('a[href*="review/visitor"]');
        const blogReviewEl = document.querySelector('a[href*="review/ugc"]');
        result.visitorReviews = visitorReviewEl ? (visitorReviewEl as HTMLElement).innerText : '';
        result.blogReviews = blogReviewEl ? (blogReviewEl as HTMLElement).innerText : '';

        // 3. Description
        const descriptionEl = document.querySelector('.XtBbS');
        result.description = descriptionEl ? (descriptionEl as HTMLElement).innerText : '';

        // 4. Details (Address, Hours, Phone)
        const addressEl = document.querySelector('.LDgIH');
        result.address = addressEl ? (addressEl as HTMLElement).innerText : '';

        const hoursEl = document.querySelector('.A_cdD'); 
        result.businessHours = hoursEl ? (hoursEl as HTMLElement).innerText.replace(/[\n\r]+/g, ' ') : '';

        const phoneEl = document.querySelector('.xlx7Q');
        result.phone = phoneEl ? (phoneEl as HTMLElement).innerText : '';

        // 5. Image
        const imgEl = document.querySelector('.fNygA img');
        result.imageUrl = imgEl ? (imgEl as HTMLImageElement).src : '';

        return result;
    });

    if (!data.name) {
        throw new Error('식당 정보를 찾을 수 없습니다. (타이틀 요소를 찾지 못함)');
    }

    const restaurantData = {
        name: data.name,
        category: data.category,
        address: data.address,
        phone: data.phone || '',
        description: data.description || '',
        businessHours: data.businessHours || '',
        imageUrl: data.imageUrl || '',
        mapUrl: url,
        reviews: data.visitorReviews || '0', 
        blogReviews: data.blogReviews || '0',
        rating: 0, 
        tags: [],
        createdAt: Timestamp.now(),
    };

    const docRef = await db.collection("restaurants").add(restaurantData);

    return { 
        success: true, 
        id: docRef.id, 
        data: {
            ...restaurantData,
            createdAt: restaurantData.createdAt.toDate().toISOString() // Admin SDK Timestamp toDate()
        } 
    };

  } catch (error: any) {
    console.error('Crawling failed:', error);
    return { success: false, error: error.message };
  } finally {
    if (browser) await browser.close();
  }
}
