import { expect, test } from '@playwright/test'

test.describe('Example Application', () => {
  test('Login and logout roundtrip', async ({ page }) => {
    await page.goto('/')

    const loginForm = page.locator('shade-login form')
    await expect(loginForm).toBeVisible()

    const usernameInput = loginForm.locator('input[name="userName"]')
    await expect(usernameInput).toBeVisible()

    const passwordInput = loginForm.locator('input[name="password"]')
    await expect(passwordInput).toBeVisible()

    await usernameInput.type('testuser')
    await passwordInput.type('password')

    const submitButton = page.locator('button', { hasText: 'Sign In' })
    await expect(submitButton).toBeVisible()
    await expect(submitButton).toBeEnabled()

    await submitButton.click()

    const welcomeTitle = page.locator('[data-testid="page-header-title"]')
    await expect(welcomeTitle).toBeVisible()
    await expect(welcomeTitle).toContainText('Hello, testuser!')

    const logoutButton = page.locator('button', { hasText: 'Log Out' })
    await expect(logoutButton).toBeVisible()
    await expect(logoutButton).toBeEnabled()
    await logoutButton.click()

    const loggedOutLoginForm = page.locator('shade-login form')
    await expect(loggedOutLoginForm).toBeVisible()
  })
})
