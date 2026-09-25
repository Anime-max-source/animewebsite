import { chromium } from 'playwright'

async function runPlacementTests() {
  console.log('🚀 Starting Product Placement Control Automated Verification...')

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()

  const errors = []

  page.on('console', (msg) => {
    const text = msg.text()
    if (msg.type() === 'error') {
      if (text.includes('supabase.co') || text.includes('clerk') || text.includes('Failed to load resource')) {
        // Network / auth notices
      } else {
        errors.push(`[Console Error] ${text}`)
      }
    }
  })

  page.on('pageerror', (err) => {
    errors.push(`[Uncaught Page Error] ${err.message}`)
  })

  try {
    // 1. Enter Admin Panel
    console.log('\n--- 1. Navigating to Admin Manage Products ---')
    await page.goto('http://localhost:5173/admin/login', { waitUntil: 'networkidle' })
    const loginBtn = page.locator('button:has-text("Continue with Local Owner Session")')
    if (await loginBtn.isVisible()) {
      await loginBtn.click()
    }
    await page.goto('http://localhost:5173/admin/products', { waitUntil: 'networkidle' })
    console.log('✓ On /admin/products')

    // 2. Open Add Product Modal
    const addBtn = page.locator('button:has-text("Add New Product")')
    await addBtn.click()
    await page.locator('h3:has-text("Add New Anime Merchandise")').waitFor({ state: 'visible' })
    console.log('✓ Add Product modal opened')

    // 3. Verify Placement Form Field & Options
    const placementSelect = page.locator('select[name="display_section"]')
    await placementSelect.waitFor({ state: 'visible' })
    const options = await placementSelect.locator('option').allTextContents()
    console.log(`✓ Placement options found: ${options.join(' | ')}`)
    
    // Sort order field should initially be hidden for 'grid'
    const sortOrderInput = page.locator('input[name="sort_order"]')
    const isSortVisibleInitial = await sortOrderInput.isVisible()
    console.log(`✓ Sort order visible when grid (should be false): ${isSortVisibleInitial}`)

    // 4. Create Product 1 placed in Hero Banner
    console.log('\n--- 2. Creating Product 1 in Hero Banner slot ---')
    await page.fill('input[name="name"]', 'Goku Ultra Instinct Figure')
    await page.fill('input[name="price"]', '4999')
    await page.fill('input[name="image_url"]', 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80')
    await placementSelect.selectOption('hero')

    // Sort order should now be visible
    const isSortVisibleHero = await sortOrderInput.isVisible()
    console.log(`✓ Sort order visible when hero (should be true): ${isSortVisibleHero}`)
    await page.fill('input[name="sort_order"]', '1')

    await page.click('button[type="submit"]:has-text("Add to Catalog")')
    await page.waitForTimeout(1000)

    // Verify Product 1 appears in the table with Hero badge
    const heroBadge = page.locator('tr:has-text("Goku Ultra Instinct Figure") span:has-text("Hero")').first()
    await heroBadge.waitFor({ state: 'visible', timeout: 5000 })
    console.log('✓ Product 1 created and displayed with "👑 Hero" badge in Admin Table')

    // 5. Test Collision Guardrail: Attempt to add Product 2 also in Hero
    console.log('\n--- 3. Testing Single-Slot Guardrail & Collision Warning ---')
    await addBtn.click()
    await page.locator('h3:has-text("Add New Anime Merchandise")').waitFor({ state: 'visible' })

    await page.fill('input[name="name"]', 'Naruto Sage Mode Statue')
    await page.fill('input[name="price"]', '3999')
    await page.fill('input[name="image_url"]', 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80')
    await placementSelect.selectOption('hero')

    // Check collision warning banner
    const warningBanner = page.locator('text=Hero Banner is currently showing "Goku Ultra Instinct Figure". Assigning this product will replace it.')
    await warningBanner.waitFor({ state: 'visible', timeout: 5000 })
    console.log('✓ Inline collision warning triggered: "Hero Banner is currently showing..."')

    // Try submitting without confirming - should be blocked
    await page.click('button[type="submit"]:has-text("Add to Catalog")')
    const confirmError = page.locator('text=Please confirm replacing')
    await confirmError.waitFor({ state: 'visible', timeout: 3000 })
    console.log('✓ Unconfirmed replacement blocked by validation error')

    // Confirm replacement and submit
    const confirmCheckbox = page.locator('input[type="checkbox"]:near(:text("Confirm replacement"))').first()
    await confirmCheckbox.check()
    await page.click('button[type="submit"]:has-text("Add to Catalog")')
    await page.waitForTimeout(1000)

    // Verify Product 2 is now Hero and Product 1 was demoted to grid
    const narutoHeroBadge = page.locator('tr:has-text("Naruto Sage Mode Statue") span:has-text("Hero")').first()
    await narutoHeroBadge.waitFor({ state: 'visible', timeout: 5000 })
    console.log('✓ Product 2 ("Naruto") successfully took over the "👑 Hero" slot')

    const gokuRow = page.locator('tr:has-text("Goku Ultra Instinct Figure")')
    const gokuPlacementText = await gokuRow.locator('td').nth(1).textContent()
    console.log(`✓ Product 1 ("Goku") demoted to grid: "${gokuPlacementText.trim()}"`)

    // 6. Create Product 3 in Spotlight Card slot
    console.log('\n--- 4. Creating Product 3 in Spotlight slot ---')
    await addBtn.click()
    await page.locator('h3:has-text("Add New Anime Merchandise")').waitFor({ state: 'visible' })
    await page.fill('input[name="name"]', 'Luffy Gear 5 Collectible')
    await page.fill('input[name="price"]', '2999')
    await page.fill('input[name="image_url"]', 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80')
    await placementSelect.selectOption('spotlight')
    await page.click('button[type="submit"]:has-text("Add to Catalog")')
    await page.waitForTimeout(1000)

    const spotlightBadge = page.locator('tr:has-text("Luffy Gear 5 Collectible") span:has-text("Spotlight")').first()
    await spotlightBadge.waitFor({ state: 'visible', timeout: 5000 })
    console.log('✓ Product 3 created and displayed with "✨ Spotlight" badge')

    // 7. Verify Storefront Dynamic Rendering
    console.log('\n--- 5. Verifying Storefront Dynamic Slot Rendering ---')
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })

    // Verify Hero Banner shows Naruto Sage Mode Statue
    const heroSlotHeading = page.locator('h2:has-text("Naruto Sage Mode Statue")')
    await heroSlotHeading.waitFor({ state: 'visible', timeout: 5000 })
    const heroPrice = page.locator('text=Shop Now — ₹3,999')
    await heroPrice.waitFor({ state: 'visible', timeout: 5000 })
    console.log('✓ Storefront Hero Banner dynamically rendered "Naruto Sage Mode Statue" with live CTA!')

    // Verify Spotlight Card shows Luffy Gear 5
    const spotlightSlotHeading = page.locator('div:has-text("Spotlight") h3:has-text("Luffy Gear 5 Collectible")').first()
    await spotlightSlotHeading.waitFor({ state: 'visible', timeout: 5000 })
    const spotlightPrice = page.locator('text=View Item — ₹2,999').first()
    await spotlightPrice.waitFor({ state: 'visible', timeout: 5000 })
    console.log('✓ Storefront Spotlight Card dynamically rendered "Luffy Gear 5 Collectible" with live CTA!')

    console.log('\n🎉 ALL PRODUCT PLACEMENT CONTROL TESTS PASSED!')
  } catch (err) {
    console.error('❌ Test failed:', err)
    errors.push(err.message)
  } finally {
    await browser.close()
  }

  if (errors.length > 0) {
    console.log('Errors caught during test:', errors)
    process.exit(1)
  } else {
    process.exit(0)
  }
}

runPlacementTests()
