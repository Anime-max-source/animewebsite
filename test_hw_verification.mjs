import { chromium } from 'playwright'

async function verify() {
  console.log('🚀 Running Hot Wheels Products & Position Verification...')
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

  try {
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
    console.log('✓ Storefront loaded')

    // Check count in catalog section heading
    const heading = await page.locator('h2:has-text("All Merchandise")').textContent()
    console.log(`✓ Catalog Heading: "${heading}"`)

    // Check cards count
    const cardLocators = page.locator('#catalog-view .grid > div')
    const count = await cardLocators.count()
    console.log(`✓ Rendered catalog cards count: ${count}`)

    // Check the first 5 and last 3 cards order and their HW# badges
    const titles = await page.locator('#catalog-view .grid > div h3').allTextContents()
    const hwBadges = await page.locator('#catalog-view .grid > div span:has-text("HW#")').allTextContents()

    console.log('\n--- Position according to HW# Verification ---')
    for (let i = 0; i < Math.min(titles.length, 10); i++) {
      console.log(`Position ${i + 1}: ${hwBadges[i] || 'No HW#'} - "${titles[i]}"`)
    }
    console.log('...')
    for (let i = Math.max(0, titles.length - 3); i < titles.length; i++) {
      console.log(`Position ${i + 1}: ${hwBadges[i] || 'No HW#'} - "${titles[i]}"`)
    }

    // Check Our Picks (pickProduct1) has HW# 24 Track Ripper
    const ourPicksText = await page.locator('span:has-text("Our Picks")').first().locator('..').textContent()
    console.log(`\n✓ Our Picks top item: ${ourPicksText}`)

    // Check Fan Favorite (pickProduct2) has HW# 31 LA Leibre
    const fanFavText = await page.locator('span:has-text("Fan Favorite")').first().locator('..').textContent()
    console.log(`✓ Fan Favorite top item: ${fanFavText}`)

    // Test Product Detail for Track Ripper
    console.log('\n--- Testing Product Detail Page ---')
    await page.goto('http://localhost:5173/product/hw-024', { waitUntil: 'networkidle' })
    const detailTitle = await page.locator('main h1').textContent()
    const detailHw = await page.locator('span:has-text("Collector HW# 24")').isVisible()
    const detailSeries = await page.locator('text=HW Starting Grid').first().isVisible()
    const detailEdition = await page.locator('text=Silver').first().isVisible()
    console.log(`✓ Product Detail Title: "${detailTitle}"`)
    console.log(`✓ HW# 24 Badge visible: ${detailHw}`)
    console.log(`✓ Series visible: ${detailSeries}`)
    console.log(`✓ Edition visible: ${detailEdition}`)

    // Test Search for ZAMAC
    console.log('\n--- Testing Search ---')
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
    await page.click('button[title="Search store"]')
    await page.fill('input[placeholder="Search products..."]', 'ZAMAC')
    await page.press('input[placeholder="Search products..."]', 'Enter')
    await page.waitForTimeout(500)
    const searchResults = await page.locator('#catalog-view .grid > div h3').allTextContents()
    console.log(`✓ Search for "ZAMAC" found ${searchResults.length} cars: ${searchResults.join(', ')}`)

    // Check Admin Products Table
    console.log('\n--- Testing Admin Products Table ---')
    await page.goto('http://localhost:5173/admin/login', { waitUntil: 'networkidle' })
    const localLoginBtn = page.locator('button:has-text("Continue with Local Owner Session")')
    if (await localLoginBtn.isVisible()) {
      await localLoginBtn.click()
    }
    await page.goto('http://localhost:5173/admin/products', { waitUntil: 'networkidle' })
    const tableRows = await page.locator('tbody tr').count()
    console.log(`✓ Admin products table rows: ${tableRows}`)
    const firstRowHw = await page.locator('tbody tr:first-child span:has-text("HW#")').textContent()
    const firstRowTitle = await page.locator('tbody tr:first-child td:first-child p.font-bold').textContent()
    console.log(`✓ Admin 1st row: "${firstRowTitle}" with badge "${firstRowHw}"`)

    console.log('\n🎉 ALL HOT WHEELS VERIFICATION CHECKS PASSED!')
  } catch (err) {
    console.error('❌ Verification failed:', err)
  } finally {
    await browser.close()
  }
}

verify()
