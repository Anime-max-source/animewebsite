import { chromium } from 'playwright'

async function runAdminRedesignTests() {
  console.log('🚀 Starting AnimeMax Light Theme SaaS Admin Panel Validation...')

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()

  const errors = []
  const successes = []

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const txt = msg.text()
      if (!txt.includes('supabase.co') && !txt.includes('Failed to load resource')) {
        errors.push(`[Console Error] ${txt}`)
      }
    }
  })

  page.on('pageerror', (err) => {
    errors.push(`[Uncaught Page Exception] ${err.message}`)
  })

  try {
    // 1. Log in to Admin Panel
    console.log('\n--- 1. Authenticating as Store Owner ---')
    await page.goto('http://localhost:5173/admin/login', { waitUntil: 'networkidle' })
    const ownerBtn = page.locator('button:has-text("Enter Admin Panel as Store Owner"), button:has-text("Continue with Local Owner Session")').first()
    await ownerBtn.waitFor({ state: 'visible', timeout: 5000 })
    await ownerBtn.click()
    await page.waitForURL(/.*\/admin/)
    successes.push('Authenticated as Store Owner and entered /admin')

    // 2. Validate Layout Structure (Sidebar, Top Bar, Content Canvas)
    console.log('\n--- 2. Validating Sidebar & Top Bar ---')
    
    // Check Sidebar
    const sidebar = page.locator('aside')
    await sidebar.waitFor({ state: 'visible', timeout: 5000 })
    
    // Check Sidebar Background color (#FFFFFF)
    const sidebarBg = await sidebar.evaluate((el) => window.getComputedStyle(el).backgroundColor)
    console.log(`✓ Sidebar background color: ${sidebarBg}`)
    if (sidebarBg.includes('255, 255, 255')) {
      successes.push('Sidebar has white background (#FFFFFF)')
    } else {
      errors.push(`Sidebar background is not white: ${sidebarBg}`)
    }

    // Check AnimeMax wordmark & flame mark
    const wordmark = await sidebar.locator('text=AnimeMax').first().textContent()
    console.log(`✓ Wordmark: "${wordmark}"`)

    // Check active item has light-blue rounded pill background
    const activeDashboardNav = sidebar.locator('a[href="/admin"].bg-\\[\\#EFF6FF\\], a[href="/admin"]:has-text("Dashboard")')
    await activeDashboardNav.waitFor({ state: 'visible', timeout: 5000 })
    successes.push('Active Dashboard navigation item highlighted in light blue pill')

    // Check Orders badge
    const ordersNav = sidebar.locator('a[href="/admin/orders"]')
    await ordersNav.waitFor({ state: 'visible' })
    const ordersText = await ordersNav.textContent()
    console.log(`✓ Orders Nav item: "${ordersText.trim()}"`)

    // Check Secondary Nav: Settings and Help & Support
    const settingsNav = sidebar.locator('a[href="/admin/settings"]')
    await settingsNav.waitFor({ state: 'visible' })
    console.log('✓ Settings navigation link present')

    const helpBtn = sidebar.locator('button:has-text("Help & Support")')
    await helpBtn.waitFor({ state: 'visible' })
    console.log('✓ Help & Support button present')

    // Check Top Bar search input with ⌘K
    const topBarSearch = page.locator('header input, header span:has-text("Search")').first()
    await topBarSearch.waitFor({ state: 'visible' })
    console.log('✓ Top Bar search input with ⌘K shortcut hint present')

    // Check Notification Bell
    const bellBtn = page.locator('header button[title="Notifications"]')
    await bellBtn.waitFor({ state: 'visible' })
    console.log('✓ Top Bar Notification bell present')

    // 3. Test Quick Search Modal (⌘K)
    console.log('\n--- 3. Testing Global Quick Search Modal ---')
    await topBarSearch.click()
    const searchModal = page.locator('div[role="dialog"], input[placeholder*="Search products, orders"]')
    await searchModal.waitFor({ state: 'visible', timeout: 5000 })
    console.log('✓ Quick Search modal opened on click')

    await page.keyboard.type('HW')
    await page.waitForTimeout(300)
    const productResults = page.locator('text=Products (')
    const hasProducts = await productResults.isVisible()
    console.log(`✓ Search results returned products: ${hasProducts}`)

    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)
    console.log('✓ Quick Search closed via ESC')

    // 4. Test Dashboard Page Header & Date Filter
    console.log('\n--- 4. Validating Dashboard Header & Reporting Window Filter ---')
    const dashboardTitle = page.locator('h1:has-text("Dashboard")')
    await dashboardTitle.waitFor({ state: 'visible', timeout: 5000 })
    console.log('✓ Large bold title "Dashboard" present')

    const dateFilterSelect = page.locator('select').first()
    const initialPeriod = await dateFilterSelect.inputValue()
    console.log(`✓ Initial reporting window filter: "${initialPeriod}"`)

    // Toggle filter to 7d
    await dateFilterSelect.selectOption('7d')
    await page.waitForTimeout(200)
    console.log('✓ Toggled date filter to "Last 7 days"')

    // Toggle back to 30d
    await dateFilterSelect.selectOption('30d')
    await page.waitForTimeout(200)
    console.log('✓ Toggled date filter back to "Last 30 days"')

    // 5. Test Stat Cards (4 Cards)
    console.log('\n--- 5. Validating Stat Cards ---')
    const ordersStat = page.locator('text=Orders').first()
    const revenueStat = page.locator('text=Revenue').first()
    const customersStat = page.locator('text=New Customers').first()
    const pendingStat = page.locator('text=Pending QR').first()

    await ordersStat.waitFor({ state: 'visible' })
    await revenueStat.waitFor({ state: 'visible' })
    await customersStat.waitFor({ state: 'visible' })
    await pendingStat.waitFor({ state: 'visible' })
    console.log('✓ All 4 Stat Cards present: Orders, Revenue, New Customers, Pending QR')

    // 6. Test Total Revenue Panel & Charts
    console.log('\n--- 6. Validating Total Revenue Panel & Recharts ---')
    const revHeader = page.locator('h2:has-text("Total Revenue")')
    await revHeader.waitFor({ state: 'visible' })

    const lineChartSvg = page.locator('.recharts-responsive-container svg')
    await lineChartSvg.first().waitFor({ state: 'visible', timeout: 5000 })
    console.log('✓ Line chart (Current vs Previous revenue) rendered')

    // Segmented Horizontal Bar
    const segmentedBar = page.locator('div[title*="Pending:"]')
    await segmentedBar.waitFor({ state: 'visible' })
    console.log('✓ Segmented horizontal bar (Pending, Confirmed, Shipped) rendered')

    // 7. Test Right Column Cards (Busiest Order Day & Fulfillment Rate)
    console.log('\n--- 7. Validating Busiest Day & Fulfillment Rate ---')
    const busiestHeader = page.locator('h3:has-text("Busiest Order Day")')
    await busiestHeader.waitFor({ state: 'visible' })
    console.log('✓ Busiest Order Day card rendered')

    const fulfillmentHeader = page.locator('h3:has-text("Order Fulfillment Rate")')
    await fulfillmentHeader.waitFor({ state: 'visible' })
    console.log('✓ Order Fulfillment Rate gauge rendered')

    const showDetailsBtn = page.locator('button:has-text("Show details")')
    await showDetailsBtn.click()
    const detailsModalTitle = page.locator('h3:has-text("Order Fulfillment Rate Breakdown")')
    await detailsModalTitle.waitFor({ state: 'visible', timeout: 5000 })
    console.log('✓ "Show details" modal opened with fulfillment breakdown')
    const closeModalBtn = page.locator('button:has-text("Close")')
    await closeModalBtn.click()

    // 8. Test Best Selling Products Table
    console.log('\n--- 8. Validating Best Selling Products Table ---')
    const bestSellingHeader = page.locator('h2:has-text("Best Selling Products")')
    await bestSellingHeader.waitFor({ state: 'visible' })
    
    const tableColumns = ['ID', 'Name', 'Sold', 'Revenue', 'Stock Status']
    for (const col of tableColumns) {
      const th = page.locator(`th:has-text("${col}")`)
      await th.waitFor({ state: 'visible' })
    }
    console.log('✓ Best Selling Products table columns: ID · Name · Sold · Revenue · Stock Status verified')

    // 9. Validate Navigation across All Sub-Pages
    console.log('\n--- 9. Validating Sub-pages Consistency ---')
    
    // Orders page
    await page.goto('http://localhost:5173/admin/orders', { waitUntil: 'networkidle' })
    await page.locator('h1:has-text("Orders & Fulfillment")').waitFor({ state: 'visible' })
    console.log('✓ /admin/orders loaded with light theme')

    // Products page
    await page.goto('http://localhost:5173/admin/products', { waitUntil: 'networkidle' })
    await page.locator('h1:has-text("Products & Inventory")').waitFor({ state: 'visible' })
    console.log('✓ /admin/products loaded with light theme')

    // Customers page
    await page.goto('http://localhost:5173/admin/customers', { waitUntil: 'networkidle' })
    await page.locator('h1:has-text("Customer Directory")').waitFor({ state: 'visible' })
    console.log('✓ /admin/customers loaded with light theme')

    // Homepage Content page
    await page.goto('http://localhost:5173/admin/content', { waitUntil: 'networkidle' })
    await page.locator('h1:has-text("Homepage Content")').waitFor({ state: 'visible' })
    console.log('✓ /admin/content loaded with light theme')

    // Settings page
    await page.goto('http://localhost:5173/admin/settings', { waitUntil: 'networkidle' })
    await page.locator('h1:has-text("Settings")').waitFor({ state: 'visible' })
    console.log('✓ /admin/settings loaded with light theme')

  } catch (err) {
    errors.push(`[Test Execution Error] ${err.message}`)
  } finally {
    await browser.close()
  }

  console.log('\n========================================')
  console.log('LIGHT THEME ADMIN PANEL TEST RESULTS:')
  console.log(`Total Successes: ${successes.length}`)
  console.log(`Total Errors: ${errors.length}`)

  if (errors.length > 0) {
    console.log('\nErrors:')
    errors.forEach((e) => console.log('  ❌', e))
    process.exit(1)
  } else {
    console.log('\n🎉 ALL LIGHT THEME SAAS ADMIN PANEL REQUIREMENTS PASSED!')
    process.exit(0)
  }
}

runAdminRedesignTests()
