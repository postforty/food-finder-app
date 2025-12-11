"use server";

import { db } from "@/lib/firebase/admin";
import { Timestamp } from "firebase-admin/firestore";

interface RestaurantData {
  id?: string;
  name: string;
  category: string;
  address: string;
  phone: string;
  description: string;
  businessHours: string;
  imageUrl: string;
  mapUrl: string;
  reviews: number;
  blogReviews: number;
  rating: number;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

export async function crawlAndSaveRestaurant(url: string, id?: string) {
  let browser;
  try {
    // 환경에 따라 다른 Puppeteer 설정 사용
    const isProduction = process.env.NODE_ENV === "production";

    if (isProduction) {
      // 프로덕션 환경 (Vercel)에서는 puppeteer-core + @sparticuz/chromium 사용
      const puppeteerCore = await import("puppeteer-core");
      const chromium = await import("@sparticuz/chromium");

      browser = await puppeteerCore.default.launch({
        args: chromium.default.args.concat([
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--lang=ko-KR,ko",
          "--disable-web-security",
          "--disable-features=VizDisplayCompositor",
          "--memory-pressure-off",
          "--max_old_space_size=4096",
        ]),
        defaultViewport: { width: 1280, height: 720 },
        executablePath: await chromium.default.executablePath(),
        headless: true,
        timeout: 30000,
      });
    } else {
      // 로컬 개발 환경에서는 일반 puppeteer 사용
      const puppeteer = await import("puppeteer");

      browser = await puppeteer.default.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--lang=ko-KR,ko"],
        defaultViewport: { width: 1280, height: 720 },
        timeout: 30000,
      });
    }
    const page = await browser.newPage();

    await page.setExtraHTTPHeaders({
      "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
    });

    console.log(`Navigating to ${url}...`);
    // NOTE: Admin SDK doesn't strictly need PROJECT_ID env var for itself if creds are provided,
    // but good to keep basic logging.

    await page.goto(url, { waitUntil: "networkidle2" });

    const iframeSelector = "#entryIframe";
    try {
      await page.waitForSelector(iframeSelector, { timeout: 10000 });
    } catch (e) {
      throw new Error(
        "네이버 지도 페이지 형식이 아닙니다 (#entryIframe을 찾을 수 없습니다). URL이 올바른지 확인해주세요."
      );
    }

    const elementHandle = await page.$(iframeSelector);
    if (!elementHandle) throw new Error("iframe 핸들을 가져올 수 없습니다.");

    const frame = await elementHandle.contentFrame();

    if (!frame) {
      throw new Error("iframe 컨텐츠를 로드할 수 없습니다.");
    }

    await frame.waitForSelector("body", { timeout: 10000 });
    try {
      await frame.waitForSelector(".GHAhO", { timeout: 5000 }); // Title
    } catch (e) {
      // Ignore waiting error, proceed to evaluate
    }

    const data = await frame.evaluate(() => {
      const result: any = {};

      // 1. Basic Info (Title, Category)
      const titleEl = document.querySelector(".GHAhO");
      const categoryEl = document.querySelector(".lnJFt");
      result.name = titleEl ? (titleEl as HTMLElement).innerText : "";
      result.category = categoryEl ? (categoryEl as HTMLElement).innerText : "";

      // 2. Reviews
      const visitorReviewEl = document.querySelector(
        'a[href*="review/visitor"]'
      );
      const blogReviewEl = document.querySelector('a[href*="review/ugc"]');
      result.visitorReviews = visitorReviewEl
        ? (visitorReviewEl as HTMLElement).innerText
        : "";
      result.blogReviews = blogReviewEl
        ? (blogReviewEl as HTMLElement).innerText
        : "";

      // 3. Description
      const descriptionEl = document.querySelector(".XtBbS");
      result.description = descriptionEl
        ? (descriptionEl as HTMLElement).innerText
        : "";

      // 4. Details (Address, Hours, Phone)
      const addressEl = document.querySelector(".LDgIH");
      result.address = addressEl ? (addressEl as HTMLElement).innerText : "";

      const hoursEl = document.querySelector(".A_cdD");
      result.businessHours = hoursEl
        ? (hoursEl as HTMLElement).innerText.replace(/[\n\r]+/g, " ")
        : "";

      const phoneEl = document.querySelector(".xlx7Q");
      result.phone = phoneEl ? (phoneEl as HTMLElement).innerText : "";

      // 5. Image
      const imgEl = document.querySelector(".fNygA img");
      result.imageUrl = imgEl ? (imgEl as HTMLImageElement).src : "";

      return result;
    });

    if (!data.name) {
      throw new Error(
        "식당 정보를 찾을 수 없습니다. (타이틀 요소를 찾지 못함)"
      );
    }

    // 리뷰 수에서 숫자만 추출하는 헬퍼 함수
    const extractNumber = (text: string): number => {
      if (!text) return 0;
      const match = text.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    };

    const restaurantData: any = {
      name: data.name,
      category: data.category,
      address: data.address,
      phone: data.phone || "",
      description: data.description || "",
      businessHours: data.businessHours || "",
      imageUrl: data.imageUrl || "",
      mapUrl: url,
      reviews: extractNumber(data.visitorReviews),
      blogReviews: extractNumber(data.blogReviews),
      tags: [],
    };

    // 평점은 크롤링 되지 않으므로, 새 등록일 때만 0으로 초기화
    if (!id) {
      restaurantData.rating = 0;
      restaurantData.createdAt = Timestamp.now();
    } else {
      restaurantData.updatedAt = Timestamp.now();
    }

    let docId = id;

    if (id) {
      // Update existing
      await db
        .collection("restaurants")
        .doc(id)
        .set(restaurantData, { merge: true });
    } else {
      // Create new
      const docRef = await db.collection("restaurants").add(restaurantData);
      docId = docRef.id;
    }

    return {
      success: true,
      id: docId,
      data: {
        ...restaurantData,
        createdAt: restaurantData.createdAt
          ? restaurantData.createdAt.toDate().toISOString()
          : undefined,
        updatedAt: restaurantData.updatedAt
          ? restaurantData.updatedAt.toDate().toISOString()
          : undefined,
      },
    };
  } catch (error: any) {
    console.error("Crawling failed:", error);
    return { success: false, error: error.message };
  } finally {
    if (browser) await browser.close();
  }
}

export async function updateRestaurant(id: string, data: any) {
  try {
    const updateData = {
      ...data,
      updatedAt: Timestamp.now(),
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    await db.collection("restaurants").doc(id).update(updateData);
    return { success: true };
  } catch (error: any) {
    console.error("Update failed:", error);
    return { success: false, error: error.message };
  }
}

export async function getRestaurant(
  id: string
): Promise<
  { success: true; data: RestaurantData } | { success: false; error: string }
> {
  try {
    const doc = await db.collection("restaurants").doc(id).get();
    if (!doc.exists) {
      return { success: false, error: "Restaurant not found" };
    }
    const data = doc.data();
    if (data && data.createdAt) {
      data.createdAt = data.createdAt.toDate().toISOString();
    }
    if (data && data.updatedAt) {
      data.updatedAt = data.updatedAt.toDate().toISOString();
    }
    return { success: true, data: { id: doc.id, ...data } as RestaurantData };
  } catch (error: any) {
    console.error("Get restaurant failed:", error);
    return { success: false, error: error.message };
  }
}
