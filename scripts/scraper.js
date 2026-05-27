#!/usr/bin/env node
/**
 * Veer Ji Malai Chaap Wale — Swiggy Scraper
 *
 * LEGAL NOTE: Web scraping Swiggy may violate their Terms of Service.
 * Use this script ONLY for personal/educational/demo purposes.
 * Do NOT use scraped data commercially without permission.
 * Always respect robots.txt and rate limits.
 *
 * Run: npm run scrape
 * Output: scripts/scraped-data.json
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const TARGET_URL = 'https://www.swiggy.com/city/noida-1/veer-ji-malai-chaap-wale-f-block-gautam-buddha-nagar-rest430751';

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function scrapeSwiggy() {
  console.log('🕷️  Starting Swiggy scraper...');
  console.log(`📍 Target: ${TARGET_URL}\n`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--window-size=1280,900',
    ],
    defaultViewport: { width: 1280, height: 900 },
  });

  const page = await browser.newPage();

  // Mask automation
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });

  try {
    console.log('🌐 Navigating to Swiggy...');
    await page.goto(TARGET_URL, { waitUntil: 'networkidle2', timeout: 60000 });
    await sleep(3000);

    // Handle location prompt if present
    try {
      const locationBtn = await page.$('button[class*="location"]');
      if (locationBtn) await locationBtn.click();
      await sleep(1000);
    } catch {}

    // Scroll to load lazy content
    console.log('📜 Scrolling to load content...');
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => window.scrollBy(0, 600));
      await sleep(800);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await sleep(1000);

    // Extract restaurant info
    console.log('🏪 Extracting restaurant info...');
    const restaurantInfo = await page.evaluate(() => {
      const name = document.querySelector('p.RestaurantNameAddress_name__2IaTv, [class*="restaurant-name"], h1')?.textContent?.trim();
      const rating = document.querySelector('[class*="rating"], [class*="avgRating"]')?.textContent?.trim();
      const deliveryTime = document.querySelector('[class*="deliveryTime"], [class*="delivery-time"]')?.textContent?.trim();
      const cuisines = Array.from(document.querySelectorAll('[class*="cuisine"], [class*="Cuisine"]')).map((el) => el.textContent?.trim()).filter(Boolean);

      return { name, rating, deliveryTime, cuisines: cuisines.slice(0, 5) };
    });
    console.log('   Restaurant:', restaurantInfo.name || 'Not found');

    // Extract menu items
    console.log('🍽️  Extracting menu items...');
    const menuItems = await page.evaluate(() => {
      const items = [];
      const itemCards = document.querySelectorAll('[class*="MenuItem"], [data-testid*="menu-item"], [class*="menu-item"]');

      itemCards.forEach((card) => {
        try {
          const name = card.querySelector('[class*="name"], h3, h4')?.textContent?.trim();
          const price = card.querySelector('[class*="price"], [class*="Price"]')?.textContent?.trim();
          const description = card.querySelector('[class*="description"], [class*="desc"], p')?.textContent?.trim();
          const image = card.querySelector('img')?.src;
          const isBestseller = !!card.querySelector('[class*="bestseller"], [class*="Bestseller"]');
          const isVeg = !!card.querySelector('[class*="veg-icon"], [alt*="veg"]');

          if (name && price) {
            items.push({
              name,
              price: price.replace(/[^0-9]/g, ''),
              description: description?.substring(0, 200),
              image,
              isBestseller,
              isVeg,
            });
          }
        } catch {}
      });

      return items;
    });

    console.log(`   Found ${menuItems.length} menu items`);

    // Extract categories
    console.log('📂 Extracting categories...');
    const categories = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('[class*="CategoryHeader"], [class*="category-header"], [class*="MenuCategory"]'))
        .map((el) => el.textContent?.trim())
        .filter(Boolean);
    });
    console.log(`   Found ${categories.length} categories`);

    // Build output
    const scrapedData = {
      scrapedAt: new Date().toISOString(),
      sourceUrl: window.location.href,
      restaurant: {
        ...restaurantInfo,
        address: 'F Block Market, Sector 55, Noida, Uttar Pradesh 201301',
        isVeg: true,
      },
      categories,
      menuItems,
      note: 'Data scraped for DEMO/EDUCATIONAL purposes only. Not for commercial use.',
    };

    return scrapedData;
  } catch (err) {
    console.error('❌ Scraping error:', err.message);
    throw err;
  } finally {
    await browser.close();
  }
}

// Main
(async () => {
  try {
    const data = await scrapeSwiggy();
    const outputPath = path.join(__dirname, 'scraped-data.json');
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8');

    console.log(`\n✅ Scraped data saved to: scripts/scraped-data.json`);
    console.log(`   Restaurant: ${data.restaurant.name || 'Unknown'}`);
    console.log(`   Categories: ${data.categories.length}`);
    console.log(`   Menu Items: ${data.menuItems.length}`);
    console.log('\n⚠️  LEGAL NOTE: Use scraped data only for demo/educational purposes.\n');

    // If no items found, use fallback data
    if (data.menuItems.length === 0) {
      console.log('💡 No items scraped (Swiggy may block bots). Using pre-extracted data.');
      console.log('   Run: npm run seed to use the pre-extracted dataset.\n');
    } else {
      console.log('👉 Next: Review scripts/scraped-data.json, then run: npm run seed\n');
    }
  } catch (err) {
    console.error('\n❌ Scraper failed:', err.message);
    console.log('\n💡 Swiggy uses heavy bot detection. Use the pre-extracted data instead:');
    console.log('   npm run seed\n');
    process.exit(1);
  }
})();
