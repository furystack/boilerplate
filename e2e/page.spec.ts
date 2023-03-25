import { test, expect, Locator, Page } from '@playwright/test'

test.describe('Example Application', () => {
  test('Login and logout roundtrip', async ({ page }) => {
    await page.goto('http://localhost:8080')

    const loginForm = await page.locator('shade-login>div>shade-paper>form')
    await expect(loginForm).toBeVisible()

    const usernameInput = await loginForm.locator('input[name="userName"]')
    await expect(usernameInput).toBeVisible()

    const passwordInput = await loginForm.locator('input[name="password"]')
    await expect(passwordInput).toBeVisible()

    await usernameInput.type('testuser')
    await passwordInput.type('password')

    const submitButton = await page.locator('button', { hasText: 'Login' })
    await expect(submitButton).toBeVisible()
    await expect(submitButton).toBeEnabled()

    await submitButton.click()

    const welcomeTitle = await page.locator('hello-world div h2')
    await expect(welcomeTitle).toBeVisible()
    await expect(welcomeTitle).toHaveText('Hello, testuser !')

    const logoutButton = await page.locator('shade-app-bar button >> text="Log Out"')
    await expect(logoutButton).toBeVisible()
    await expect(logoutButton).toBeEnabled()
    await expect(logoutButton).toHaveText('Log Out')
    await logoutButton.click()

    const loggedOutLoginForm = await page.locator('shade-login>div>shade-paper>form')
    await expect(loggedOutLoginForm).toBeVisible()
  })
})
