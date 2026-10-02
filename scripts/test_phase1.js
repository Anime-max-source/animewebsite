import { chromium } from 'playwright';

async function testPhase1() {
  console.log('=== Starting Phase 1 Tests ===');
  const browser = await chromium.launch({ headless: true });
  
  // Track console errors
  const consoleErrors = [];
  const networkErrors = [];

  // Helper to attach listeners
  const monitorPage = (page) => {
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(`[Console Error] ${msg.text()}`);
      }
    });
    page.on('requestfailed', request => {
      networkErrors.push(`[Network Failed] ${request.url()} - ${request.failure()?.errorText}`);
    });
  };

  // 1. Desktop Test (1400x900)
  const desktopContext = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const desktopPage = await desktopContext.newPage();
  monitorPage(desktopPage);

  console.log('1. Loading Storefront Homepage (Desktop)...');
  await desktopPage.goto('http://localhost:5173/');
  await desktopPage.waitForTimeout(1000);

  // Check Hero banner
  const heroExists = await desktopPage.$('section:has-text("GET UP TO 50% OFF"), #catalog-view');
  console.log('Hero / Explore section loaded:', Boolean(heroExists));
  await desktopPage.screenshot({ path: 'qa_phase1_desktop_home.png' });

  // Check Category tabs
  console.log('2. Checking Category tabs...');
  const categoryPills = await desktopPage.$$eval('.sf-chip', els => els.map(e => e.textContent.trim()));
  console.log('Available Category Pills:', categoryPills);

  // Check "All" tab count
  const allCountText = await desktopPage.$eval('h2:has-text("All Products")', el => el.textContent.trim()).catch(() => 'Not found');
  console.log('Catalog Header Text (All):', allCountText);

  // Click on "Anime Figures" tab
  console.log('3. Clicking "Anime Figures" category tab...');
  const figurePill = await desktopPage.$('button.sf-chip:has-text("Anime Figures")');
  if (figurePill) {
    await figurePill.click();
    await desktopPage.waitForTimeout(600);
    const catHeaderText = await desktopPage.$eval('#catalog-view p', el => el.textContent.trim()).catch(() => '');
    console.log('Catalog Header Subtext after tab click:', catHeaderText);
    await desktopPage.screenshot({ path: 'qa_phase1_category_filter.png' });
  }

  // Click back to "All"
  console.log('4. Clicking "All" tab...');
  await desktopPage.click('button.sf-chip:has-text("All")');
  await desktopPage.waitForTimeout(600);

  // 5. Test Search: Relevant query
  console.log('5. Testing search query "Gojo"...');
  const searchBtn = await desktopPage.$('button[title="Search store"]');
  if (searchBtn) {
    await searchBtn.click();
    await desktopPage.waitForTimeout(300);
  }
  await desktopPage.fill('input[placeholder="Search products..."]', 'Gojo');
  await desktopPage.keyboard.press('Enter');
  await desktopPage.waitForTimeout(600);
  const searchResultsCount = await desktopPage.$$eval('.sf-product-card', els => els.length);
  console.log('Search "Gojo" results count:', searchResultsCount);
  await desktopPage.screenshot({ path: 'qa_phase1_search_relevant.png' });

  // 6. Test Search: Irrelevant query (Empty state)
  console.log('6. Testing search query "xyznonexistent"...');
  await desktopPage.fill('input[placeholder="Search products..."]', 'xyznonexistent');
  await desktopPage.keyboard.press('Enter');
  await desktopPage.waitForTimeout(600);
  const emptyStateHeader = await desktopPage.$eval('.sf-empty-state h3', el => el.textContent.trim()).catch(() => 'No empty state header');
  console.log('Empty state header:', emptyStateHeader);
  await desktopPage.screenshot({ path: 'qa_phase1_search_empty_state.png' });

  // Clear search
  console.log('7. Resetting filters / clearing search...');
  const resetBtn = await desktopPage.$('.sf-empty-state button:has-text("Reset Filters")');
  if (resetBtn) {
    await resetBtn.click();
    await desktopPage.waitForTimeout(600);
  }

  // 8. Test Product Detail Page
  console.log('8. Testing Product Detail Page...');
  const firstProductLink = await desktopPage.$('.sf-product-card a[href^="/product/"]');
  if (firstProductLink) {
    const productUrl = await firstProductLink.getAttribute('href');
    console.log('Navigating to product:', productUrl);
    await firstProductLink.click();
    await desktopPage.waitForTimeout(1000);
    await desktopPage.screenshot({ path: 'qa_phase1_product_detail.png' });

    const pdTitle = await desktopPage.$eval('h1', el => el.textContent.trim()).catch(() => 'Not found');
    const pdPrice = await desktopPage.$eval('.text-3xl.font-bold, [class*="price"], :has-text("₹")', el => el.textContent.trim()).catch(() => 'Not found');
    const pdStock = await desktopPage.$eval('span:has-text("In Stock"), span:has-text("Sold Out")', el => el.textContent.trim()).catch(() => 'Not found');
    const addBtn = await desktopPage.$('button:has-text("Add to Bag"), button:has-text("Add to Cart")');
    const isAddDisabled = addBtn ? await addBtn.isDisabled() : true;

    console.log('Product Detail Title:', pdTitle);
    console.log('Product Detail Price:', pdPrice);
    console.log('Product Detail Stock Badge:', pdStock);
    console.log('Add to Bag button disabled:', isAddDisabled);
  } else {
    console.log('No product card link found to click.');
  }

  // 9. Mobile Responsiveness Test (390x844 - iPhone 12)
  console.log('9. Testing Mobile Viewport (390x844)...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15'
  });
  const mobilePage = await mobileContext.newPage();
  monitorPage(mobilePage);

  await mobilePage.goto('http://localhost:5173/');
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({ path: 'qa_phase1_mobile_home.png' });

  // Test mobile menu drawer button
  const mobileMenuBtn = await mobilePage.$('button[aria-label="Open navigation menu"]');
  if (mobileMenuBtn) {
    console.log('Opening mobile menu drawer...');
    await mobileMenuBtn.click();
    await mobilePage.waitForTimeout(500);
    await mobilePage.screenshot({ path: 'qa_phase1_mobile_menu_open.png' });
  }

  await browser.close();

  console.log('--- Phase 1 Console Errors ---', consoleErrors);
  console.log('--- Phase 1 Network Errors ---', networkErrors);
  console.log('=== Phase 1 Completed ===');
}

testPhase1().catch(err => {
  console.error('Phase 1 error:', err);
  process.exit(1);
});
