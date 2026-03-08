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

    await page.getByRole('button', { name: 'Continue with local test mode' }).click()
    await page.getByRole('heading', { name: 'Prototype Shell' }).waitFor()

    await page.getByRole('link', { name: 'Places' }).click()
    await page.getByRole('button', { name: 'Create first place' }).waitFor()
    await page.getByRole('button', { name: 'Create first place' }).click()

    await page.locator('#place-name').fill(placeName)
    await page.getByRole('button', { name: 'Create place' }).click()
    await page.getByText(`Created ${placeName}`).waitFor()

    await page.getByRole('button', { name: 'Open' }).click()
    await page.getByRole('heading', { name: `Upload a new photo for ${placeName}` }).waitFor()

    await page.locator('#place-capture-input').setInputFiles(fixturePath)
    await page.getByText(/Uploaded capture/).waitFor()
    await page.getByText('analysis_pending').first().waitFor()

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
