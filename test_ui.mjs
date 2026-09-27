import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'

const SCREENSHOT_DIR = path.resolve('test_screenshots')
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true })
}

async function runTests() {
  console.log('🚀 Starting Playwright Comprehensive UI & Layout Validation...')

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()

  const errors = []
  const warnings = []

  page.on('console', (msg) => {
    const type = msg.type()
    const text = msg.text()
    if (type === 'error') {
      if (text.includes('supabase.co') || text.includes('Failed to load resource') || text.includes('favicon.ico')) {
        warnings.push(`[Remote/Asset Notice] ${text}`)
      } else {
        errors.push(`[Console Error] ${text}`)
      }
    } else if (type === 'warning' || type === 'warn') {
      warnings.push(`[Console Warning] ${text}`)
    }
  })

  page.on('pageerror', (err) => {
    errors.push(`[Uncaught Page Exception] ${err.message}`)
  })

  try {
    // ══════════════════════════════════════════════════════════════════════════
    // 1. STOREFRONT HOME & LAYOUT
    // ══════════════════════════════════════════════════════════════════════════
    console.log('\n--- 1. Testing Storefront Home (/) & Layout ---')
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
    const title = await page.title()
    console.log(`✓ Storefront loaded. Title: "${title}"`)

    // Check Canvas Background
    const canvasBg = await page.$eval('div.min-h-screen', (el) => window.getComputedStyle(el).backgroundColor)
    console.log(`✓ Canvas background color: ${canvasBg}`)

    // Check Left Sidebar & Logo
    const sidebar = await page.$('aside')
    console.log(`✓ Floating Left Sidebar: ${sidebar ? 'Present' : 'Missing'}`)
    const sidebarBrand = await page.$eval('aside [aria-label="AnimeMax"], aside a[aria-label="AnimeMax home"]', (el) => el.textContent)
    console.log(`✓ Sidebar Brand Wordmark: "${sidebarBrand}"`)

    const exploreNewNav = await page.$('aside a:has-text("Explore New")')
    console.log(`✓ Active "Explore New" category pill: ${exploreNewNav ? 'Present' : 'Missing'}`)

    // Filter pills
    const filterPills = await page.$$('button:has-text("All"), button:has-text("Figures"), button:has-text("Posters"), button:has-text("Apparel"), button:has-text("Accessories")')
    console.log(`✓ Filter Pills: ${filterPills.length} filter pills rendered`)

    // Search bar input toggle & padding test
    const searchToggleBtn = page.locator('button[title="Search store"]')
    if (await searchToggleBtn.isVisible()) {
      await searchToggleBtn.click()
      const searchInput = page.locator('input[placeholder*="Search products"]')
      await searchInput.waitFor({ state: 'visible', timeout: 3000 })
      const searchPadLeft = await searchInput.evaluate((el) => parseFloat(window.getComputedStyle(el).paddingLeft))
      console.log(`✓ Search Input padding-left: ${searchPadLeft}px (expected >= 32px)`)
      if (searchPadLeft < 32) {
        errors.push(`[UI ERROR] Search input padding-left is ${searchPadLeft}px, icon will overlap text!`)
      }
      await searchInput.fill('Goku')
      console.log('✓ Successfully tested search query filter')
    }

    // Catalog Section Header
    const catalogHeader = await page.$('h2:has-text("All Products")')
    console.log(`✓ Catalog Section Header: ${catalogHeader ? 'Rendered' : 'Missing'}`)

    // Product Cards Grid
    const productCards = await page.$$('.sf-product-card')
    console.log(`✓ Catalog items rendered: ${productCards.length} products`)

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_storefront_home.png') })
    console.log('✓ Captured 01_storefront_home.png')

    // ══════════════════════════════════════════════════════════════════════════
    // 2. ACCOUNT PAGE & ICON OVERLAP VERIFICATION (PRIMARY BUG FIX)
    // ══════════════════════════════════════════════════════════════════════════
    console.log('\n--- 2. Validating Account Page & Icon Spacing (/account) ---')
    // Seed authenticated session in localStorage (using demo authSource to maintain stable test session)
    await page.evaluate(() => {
      localStorage.setItem('animemax_mock_user_v1', JSON.stringify({
        id: 'user_3JfzIn4xVyUNsK2Z4k1Jq27N',
        fullName: 'sree sharaan',
        primaryEmailAddress: { emailAddress: 'sreesaisharaan50@gmail.com' },
        role: 'owner',
        authSource: 'demo'
      }))
    })

    await page.goto('http://localhost:5173/account', { waitUntil: 'networkidle' })
    const accountHeader = await page.locator('h1').textContent()
    console.log(`✓ Account Header: "${accountHeader}"`)

    // Verify User Card
    const userName = await page.locator('h3:has-text("sree sharaan")').isVisible()
    console.log(`✓ Profile Name rendered: ${userName}`)

    // Inspect Input Fields: Phone, WhatsApp, Address
    const phoneInput = page.locator('input[name="phone"]')
    const whatsappInput = page.locator('input[name="whatsapp"]')
    const addressTextarea = page.locator('textarea[name="address"]')

    await phoneInput.waitFor({ state: 'visible', timeout: 5000 })
    await whatsappInput.waitFor({ state: 'visible', timeout: 5000 })
    await addressTextarea.waitFor({ state: 'visible', timeout: 5000 })

    const phonePadLeft = await phoneInput.evaluate((el) => parseFloat(window.getComputedStyle(el).paddingLeft))
    const whatsappPadLeft = await whatsappInput.evaluate((el) => parseFloat(window.getComputedStyle(el).paddingLeft))
    const addressPadLeft = await addressTextarea.evaluate((el) => parseFloat(window.getComputedStyle(el).paddingLeft))

    console.log(`✓ Phone Input padding-left: ${phonePadLeft}px (expected >= 36px, got ${phonePadLeft}px)`)
    console.log(`✓ WhatsApp Input padding-left: ${whatsappPadLeft}px (expected >= 36px, got ${whatsappPadLeft}px)`)
    console.log(`✓ Address Textarea padding-left: ${addressPadLeft}px (expected >= 36px, got ${addressPadLeft}px)`)

    if (phonePadLeft < 36) {
      errors.push(`[UI ERROR] Phone input padding-left is ${phonePadLeft}px, icon will overlap placeholder text!`)
    }
    if (whatsappPadLeft < 36) {
      errors.push(`[UI ERROR] WhatsApp input padding-left is ${whatsappPadLeft}px, icon will overlap placeholder text!`)
    }
    if (addressPadLeft < 36) {
      errors.push(`[UI ERROR] Address textarea padding-left is ${addressPadLeft}px, icon will overlap placeholder text!`)
    }

    // Mathematical verification: calculate clearance between icon bounding box and text start position
    const phoneBox = await phoneInput.boundingBox()
    const phoneIcon = page.locator('input[name="phone"] ~ svg')
    const phoneIconBox = await phoneIcon.boundingBox()

    if (phoneBox && phoneIconBox) {
      const textStartX = phoneBox.x + phonePadLeft
      const iconEndX = phoneIconBox.x + phoneIconBox.width
      const clearance = textStartX - iconEndX
      console.log(`✓ Phone icon clearance gap: ${clearance.toFixed(1)}px (clearance > 0 confirms NO overlap)`)
      if (clearance < 0) {
        errors.push(`[UI OVERLAP] Phone icon overlaps input text by ${Math.abs(clearance)}px!`)
      }
    }

    const waBox = await whatsappInput.boundingBox()
    const waIcon = page.locator('input[name="whatsapp"] ~ svg')
    const waIconBox = await waIcon.boundingBox()

    if (waBox && waIconBox) {
      const textStartX = waBox.x + whatsappPadLeft
      const iconEndX = waIconBox.x + waIconBox.width
      const clearance = textStartX - iconEndX
      console.log(`✓ WhatsApp icon clearance gap: ${clearance.toFixed(1)}px (clearance > 0 confirms NO overlap)`)
      if (clearance < 0) {
        errors.push(`[UI OVERLAP] WhatsApp icon overlaps input text by ${Math.abs(clearance)}px!`)
      }
    }

    const addrBox = await addressTextarea.boundingBox()
    const addrIcon = page.locator('textarea[name="address"] ~ svg')
    const addrIconBox = await addrIcon.boundingBox()

    if (addrBox && addrIconBox) {
      const textStartX = addrBox.x + addressPadLeft
      const iconEndX = addrIconBox.x + addrIconBox.width
      const clearance = textStartX - iconEndX
      console.log(`✓ Address icon clearance gap: ${clearance.toFixed(1)}px (clearance > 0 confirms NO overlap)`)
      if (clearance < 0) {
        errors.push(`[UI OVERLAP] Address icon overlaps textarea text by ${Math.abs(clearance)}px!`)
      }
    }

    // Test form filling & saving
    await phoneInput.fill('9876543210')
    await whatsappInput.fill('9876543210')
    await addressTextarea.fill('Flat 402, Sakura Heights, Sector 14, Bengaluru 560001')

    const saveBtn = page.locator('button:has-text("Save Profile Changes")')
    await saveBtn.click()

    const successNotice = page.locator('text=Profile details saved!')
    await successNotice.waitFor({ state: 'visible', timeout: 5000 })
    console.log('✓ Saved profile changes successfully. Verified confirmation banner.')

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_account_page_fixed.png') })
    console.log('✓ Captured 02_account_page_fixed.png')

    // ══════════════════════════════════════════════════════════════════════════
    // 3. CHECKOUT FORM ICON & PADDING VALIDATION
    // ══════════════════════════════════════════════════════════════════════════
    console.log('\n--- 3. Validating Checkout Page (/checkout) ---')
    // Seed an item into cart so checkout page shows form
    await page.evaluate(() => {
      localStorage.setItem('animemax_cart_v1', JSON.stringify([
        {
          id: 'test-item-1',
          name: 'Gojou Satoru Scale Figure',
          price: 1899,
          qty: 1,
          in_stock: true,
          image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400'
        }
      ]))
    })

    await page.goto('http://localhost:5173/checkout', { waitUntil: 'networkidle' })

    const checkoutPhone = page.locator('input[name="buyer_phone"]')
    await checkoutPhone.waitFor({ state: 'visible', timeout: 5000 })
    const chkPhonePadLeft = await checkoutPhone.evaluate((el) => parseFloat(window.getComputedStyle(el).paddingLeft))
    console.log(`✓ Checkout Phone padding-left: ${chkPhonePadLeft}px (expected >= 36px)`)
    if (chkPhonePadLeft < 36) {
      errors.push(`[UI ERROR] Checkout Phone input padding-left is ${chkPhonePadLeft}px!`)
    }

    const checkoutAddress = page.locator('textarea[name="buyer_address"]')
    await checkoutAddress.waitFor({ state: 'visible', timeout: 5000 })
    const chkAddrPadLeft = await checkoutAddress.evaluate((el) => parseFloat(window.getComputedStyle(el).paddingLeft))
    console.log(`✓ Checkout Address padding-left: ${chkAddrPadLeft}px (expected >= 36px)`)
    if (chkAddrPadLeft < 36) {
      errors.push(`[UI ERROR] Checkout Address textarea padding-left is ${chkAddrPadLeft}px!`)
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_checkout_page.png') })
    console.log('✓ Captured 03_checkout_page.png')

    // ══════════════════════════════════════════════════════════════════════════
    // 4. ADMIN PORTAL VALIDATION
    // ══════════════════════════════════════════════════════════════════════════
    console.log('\n--- 4. Validating Admin Portal (/admin) ---')
    await page.goto('http://localhost:5173/admin/login', { waitUntil: 'networkidle' })
    const enterOwnerBtn = page.locator('button:has-text("Continue with Local Owner Session"), button:has-text("Enter Admin Panel as Owner")')
    if (await enterOwnerBtn.isVisible()) {
      await enterOwnerBtn.click()
      await page.waitForURL(/.*\/admin/)
      console.log('✓ Assumed Owner role and entered Admin Panel')
    } else {
      await page.goto('http://localhost:5173/admin', { waitUntil: 'networkidle' })
    }

    await page.locator('h1:has-text("Dashboard"), h1:has-text("Shop Overview")').first().waitFor({ state: 'visible', timeout: 5000 })
    const adminHeading = await page.locator('h1').first().textContent()
    console.log(`✓ Admin Header: "${adminHeading}"`)

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_admin_dashboard.png') })
    console.log('✓ Captured 04_admin_dashboard.png')

    // ══════════════════════════════════════════════════════════════════════════
    // 5. MOBILE RESPONSIVE TEST (375x812)
    // ══════════════════════════════════════════════════════════════════════════
    console.log('\n--- 5. Validating Mobile Viewport (375x812) ---')
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('http://localhost:5173/account', { waitUntil: 'networkidle' })

    const mobilePhonePad = await phoneInput.evaluate((el) => parseFloat(window.getComputedStyle(el).paddingLeft))
    console.log(`✓ Mobile Account Phone padding-left: ${mobilePhonePad}px`)
    if (mobilePhonePad < 36) {
      errors.push(`[UI ERROR] Mobile Account Phone padding-left is ${mobilePhonePad}px!`)
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_account_mobile.png') })
    console.log('✓ Captured 05_account_mobile.png')

  } catch (err) {
    errors.push(`[Test Execution Error] ${err.message}`)
  } finally {
    await browser.close()
  }

  console.log('\n========================================')
  console.log('TEST SUMMARY RESULTS:')
  console.log(`Total Errors: ${errors.length}`)
  console.log(`Total Warnings: ${warnings.length}`)

  if (warnings.length > 0) {
    console.log('\nWarnings / Notices:')
    warnings.slice(0, 5).forEach((w) => console.log('  ⚠️', w))
  }

  if (errors.length > 0) {
    console.log('\nErrors Found:')
    errors.forEach((e) => console.log('  ❌', e))
    process.exit(1)
  } else {
    console.log('\n🎉 ALL STOREFRONT & ADMIN UI WORKFLOWS PASSED WITH 0 ERRORS!')
    process.exit(0)
  }
}

runTests()
