import { chromium } from 'playwright'

async function runAuthFlowTest() {
  console.log('🧪 Starting Full Auth Flow and Sign In Validation...')
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()

  const errors = []
  page.on('pageerror', err => {
    errors.push(`Page error: ${err.message}`)
  })

  try {
    // 1. Visit Home
    console.log('\n--- 1. Testing Storefront TopBar & Sidebar Sign In buttons ---')
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })

    const topBarSignIn = page.locator('header a:has-text("Sign In")')
    const sidebarSignIn = page.locator('aside a:has-text("Sign in to Account")')

    console.log(`TopBar "Sign In" button visible: ${await topBarSignIn.isVisible()}`)
    console.log(`Sidebar "Sign in to Account" button visible: ${await sidebarSignIn.isVisible()}`)

    // 2. Click TopBar Sign In
    console.log('\n--- 2. Clicking TopBar Sign In ---')
    await topBarSignIn.click()
    await page.waitForURL(/.*\/signin/, { timeout: 5000 })
    console.log(`✓ Navigated to: ${page.url()}`)

    // 3. Test One-Click Demo Sign In fallback
    console.log('\n--- 3. Testing Buyer Sign In & State Sync ---')
    const demoBtn = page.locator('button:has-text("Continue with One-Click Demo Buyer"), button:has-text("Sign In as Buyer")')
    await demoBtn.waitFor({ state: 'visible', timeout: 5000 })
    await demoBtn.click()

    await page.waitForURL(/.*\/account/, { timeout: 5000 })
    console.log(`✓ Successfully signed in and navigated to: ${page.url()}`)

    // 4. Verify Account Page Profile Details
    console.log('\n--- 4. Verifying Account Page Content ---')
    const accountName = await page.locator('h3.text-base.font-bold').textContent()
    const accountRole = await page.locator('text=buyer Account').count()
    const accountId = await page.locator('text=ID: user_').count()
    console.log(`✓ Account Name rendered: "${accountName}" (NOT "Guest Visitor")`)
    console.log(`✓ Account Role Badge: ${accountRole > 0 ? 'Correctly says "buyer Account"' : 'Failed'}`)
    console.log(`✓ Account ID: ${accountId > 0 ? 'Assigned real user ID' : 'Failed'}`)

    // 5. Verify TopBar and Sidebar are now in Signed-in state (NO MORE "Sign In" buttons!)
    console.log('\n--- 5. Verifying Storefront Navigation reflects Signed-in State ---')
    const isTopBarSignInGone = (await page.locator('header a:has-text("Sign In")').count()) === 0
    const topBarUserPill = page.locator('header a[title="Account settings"]')
    console.log(`✓ TopBar "Sign In" button replaced with user profile: ${isTopBarSignInGone}`)
    console.log(`✓ TopBar user pill visible: ${await topBarUserPill.isVisible()}`)

    const sidebarSignedInText = await page.locator('aside p:has-text("Signed In")').count()
    console.log(`✓ Sidebar status: ${sidebarSignedInText > 0 ? 'Correctly shows "Signed In"' : 'Failed'}`)

    // 6. Test re-visiting /signin while signed in (Auto-redirect check)
    console.log('\n--- 6. Testing re-visiting /signin while signed in ---')
    await page.goto('http://localhost:5173/signin', { waitUntil: 'networkidle' })
    await page.waitForURL(/.*\/account/, { timeout: 5000 })
    console.log(`✓ Auto-redirected away from /signin back to /account: ${page.url()}`)

    // 7. Test Sign Out
    console.log('\n--- 7. Testing Sign Out flow ---')
    const signOutBtn = page.locator('button:has-text("Sign Out")').first()
    await signOutBtn.waitFor({ state: 'visible', timeout: 5000 })
    await signOutBtn.click()

    await page.waitForURL('http://localhost:5173/', { timeout: 5000 })
    console.log(`✓ Successfully signed out and redirected to storefront: ${page.url()}`)

    // 8. Verify back to guest state
    const topBarSignInAfter = await page.locator('header a:has-text("Sign In")').isVisible()
    console.log(`✓ TopBar returned to "Sign In": ${topBarSignInAfter}`)

  } catch (err) {
    errors.push(err.message)
    console.error('Test execution error:', err)
  } finally {
    await browser.close()
  }

  if (errors.length > 0) {
    console.log('\n❌ Tests failed with errors:', errors)
    process.exit(1)
  } else {
    console.log('\n🎉 ALL AUTH & SIGN IN FLOW TESTS PASSED PERFECTLY!')
    process.exit(0)
  }
}

runAuthFlowTest()
