import { resolve } from 'node:path'
import { chromium } from 'playwright'

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:4173'
const fixturePath = resolve(
  process.cwd(),
  'prototype/mobile-web/e2e/fixtures/fixture-capture.svg',
)
const placeName = `Hall Closet ${Date.now().toString().slice(-5)}`

function assertCondition(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

async function main() {
  const browser = await chromium.launch({
    headless: true,
  })
  const context = await browser.newContext()
  const page = await context.newPage()

  try {
    await page.goto(baseUrl, {
      waitUntil: 'networkidle',
    })

    await page.getByTestId('local-sign-in').waitFor()
    const localSignInLabel = await page.getByTestId('local-sign-in').textContent()
    assertCondition(
      localSignInLabel?.includes('로컬 테스트 모드로 계속') ?? false,
      'Default locale should render Korean sign-in copy.',
    )

    await page.getByTestId('locale-select').selectOption('en')
    await page.getByTestId('local-sign-in').waitFor({
      state: 'visible',
    })
    const englishLocalSignInLabel = await page.getByTestId('local-sign-in').textContent()
    assertCondition(
      englishLocalSignInLabel?.includes('Continue with local test mode') ?? false,
      'Locale switcher should render English sign-in copy.',
    )

    await page.getByTestId('local-sign-in').click()
    await page.getByRole('heading', { name: 'Prototype Shell' }).waitFor()

    await page.getByTestId('tab-settings').click()
    await page.locator('[data-testid="locale-select"]').first().selectOption('ko')

    await page.getByTestId('tab-places').click()
    const placesHeading = await page.getByTestId('selected-place-heading').textContent()
    assertCondition(
      placesHeading?.includes('장소 계층') ?? false,
      'App shell should switch back to Korean after locale change.',
    )

    await page.getByTestId('create-first-place').waitFor()
    await page.getByTestId('create-first-place').click()

    await page.getByTestId('place-name-input').fill(placeName)
    await page.getByTestId('create-place-submit').click()
    await page.getByRole('heading', { name: placeName, exact: true }).waitFor()

    await page.getByTestId('capture-section').waitFor()

    await page.getByTestId('place-capture-input').setInputFiles(fixturePath)
    await page.locator('[data-testid="capture-card"][data-capture-status="analysis_pending"]').first().waitFor()

    const placeHeading = await page.getByRole('heading', { name: placeName, exact: true }).isVisible()
    assertCondition(placeHeading, 'Selected place heading was not visible after upload.')
  } finally {
    await context.close()
    await browser.close()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
