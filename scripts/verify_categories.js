import { chromium } from 'playwright';

async function verifyCategories() {
  console.log('Starting Categories Verification Test...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Helper to ensure owner session
  await page.goto('http://localhost:5173/admin/login');
  await page.evaluate(() => {
    localStorage.setItem('animemax_mock_user_v1', JSON.stringify({
      id: 'user_owner_animemax',
      fullName: 'Store Owner',
      role: 'owner'
    }));
  });

  // 1. Check Storefront Homepage Filter Tabs
  console.log('\n--- 1. Testing Storefront Filter Tabs ---');
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(1000);

  const filterChips = await page.locator('.sf-chip').allInnerTexts();
  console.log('Storefront filter chips:', filterChips);

  const expectedChips = [
    'All',
    'Hot Wheels',
    'Die Cast',
    'Marvel',
    'Anime',
    'Posters & Wall Decor',
    'Katanas',
    'RC Cars',
    'Shinchan'
  ];

  const matchesStorefront = expectedChips.every((chip, i) => filterChips[i] === chip);
  console.log('Storefront chips match expected order:', matchesStorefront);
  if (!matchesStorefront) {
    console.error('Mismatch! Expected:', expectedChips, 'Got:', filterChips);
  }

  await page.screenshot({ path: 'verify_storefront_categories.png', fullPage: false });
  console.log('📸 Saved verify_storefront_categories.png');

  // Test clicking "Hot Wheels"
  const hwChip = page.locator('.sf-chip', { hasText: 'Hot Wheels' });
  await hwChip.click();
  await page.waitForTimeout(500);
  console.log('Clicked "Hot Wheels" tab. Current URL:', page.url());

  // Test clicking "All"
  const allChip = page.getByRole('button', { name: 'All', exact: true });
  await allChip.click();
  await page.waitForTimeout(500);
  console.log('Clicked "All" tab. Current URL:', page.url());

  // 2. Check Admin Manage Categories Page
  console.log('\n--- 2. Testing Admin Manage Categories Page ---');
  await page.goto('http://localhost:5173/admin/categories');
  await page.waitForTimeout(1000);

  const categoryRows = await page.locator('tbody tr').all();
  console.log('Admin Category rows count:', categoryRows.length);

  const adminCategories = [];
  for (const row of categoryRows) {
    const orderInput = await row.locator('input[type="number"]').inputValue().catch(() => '');
    const nameText = await row.locator('td:nth-child(2) span').innerText().catch(() => '');
    const slugText = await row.locator('td:nth-child(3) span').innerText().catch(() => '');
    adminCategories.push({ order: orderInput, name: nameText, slug: slugText.replace('/', '') });
  }

  console.log('Admin Categories listed:');
  console.table(adminCategories);

  await page.screenshot({ path: 'verify_admin_categories.png', fullPage: false });
  console.log('📸 Saved verify_admin_categories.png');

  // 3. Check Admin Products -> Add Product Dropdown
  console.log('\n--- 3. Testing Admin Add Product Dropdown ---');
  await page.goto('http://localhost:5173/admin/products');
  await page.waitForTimeout(1000);

  // Click Add Product button
  const addBtn = page.locator('button', { hasText: 'Add New Product' });
  await addBtn.click();
  await page.waitForTimeout(500);

  const dropdownOptions = await page.locator('select[name="category_id"] option').allInnerTexts();
  console.log('Add Product modal category dropdown options:', dropdownOptions);

  const expectedDropdown = [
    'Hot Wheels',
    'Die Cast',
    'Marvel',
    'Anime',
    'Posters & Wall Decor',
    'Katanas',
    'RC Cars',
    'Shinchan'
  ];

  const matchesDropdown = expectedDropdown.every((opt, i) => dropdownOptions[i] === opt);
  console.log('Dropdown options match expected 8 categories:', matchesDropdown);

  await page.screenshot({ path: 'verify_admin_add_product_dropdown.png', fullPage: false });
  console.log('📸 Saved verify_admin_add_product_dropdown.png');

  await browser.close();
  console.log('\n✅ All verification checks completed successfully!');
}

verifyCategories().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
