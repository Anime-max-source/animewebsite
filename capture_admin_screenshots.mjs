import { chromium } from 'playwright'

async function captureScreenshots() {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 } })
  const page = await context.newPage()

  try {
    // 1. Login
    await page.goto('http://localhost:5173/admin/login', { waitUntil: 'networkidle' })
    const loginBtn = page.locator('button:has-text("Continue with Local Owner Session")').first()
    await loginBtn.click()
    await page.waitForURL(/.*\/admin/)

    // 2. Wait for Dashboard to render
    await page.locator('h1:has-text("Dashboard")').waitFor({ state: 'visible', timeout: 5000 })
    await page.waitForTimeout(1000)

    // Capture Full Dashboard Screenshot
    await page.screenshot({ path: 'admin_dashboard_redesign.png', fullPage: true })
    console.log('✓ Captured admin_dashboard_redesign.png')

    // 3. Open Fulfillment Details Modal
    const showDetailsBtn = page.locator('button:has-text("Show details")')
    await showDetailsBtn.click()
    await page.locator('h3:has-text("Order Fulfillment Rate Breakdown")').waitFor({ state: 'visible' })
    await page.waitForTimeout(400)
    await page.screenshot({ path: 'admin_fulfillment_modal.png' })
    console.log('✓ Captured admin_fulfillment_modal.png')
    await page.locator('button:has-text("Close")').click()

    // 4. Open Quick Search Modal
    await page.locator('header span:has-text("Search")').click()
    await page.locator('input[placeholder*="Search products, orders"]').waitFor({ state: 'visible' })
    await page.keyboard.type('HW')
    await page.waitForTimeout(400)
    await page.screenshot({ path: 'admin_quick_search.png' })
    console.log('✓ Captured admin_quick_search.png')
    await page.keyboard.press('Escape')

    // 5. Orders Page
    await page.goto('http://localhost:5173/admin/orders', { waitUntil: 'networkidle' })
    await page.waitForTimeout(800)
    await page.screenshot({ path: 'admin_orders_page.png', fullPage: true })
    console.log('✓ Captured admin_orders_page.png')

    // 6. Settings Page
    await page.goto('http://localhost:5173/admin/settings', { waitUntil: 'networkidle' })
    await page.waitForTimeout(800)
    await page.screenshot({ path: 'admin_settings_page.png', fullPage: true })
    console.log('✓ Captured admin_settings_page.png')

  } catch (err) {
    console.error('Error capturing screenshots:', err)
  } finally {
    await browser.close()
  }
}

captureScreenshots()
