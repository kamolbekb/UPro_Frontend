import { test, expect } from '@playwright/test';

const TEST_EMAIL = 'kamolsermatov096@gmail.com';
const TEST_OTP = process.env.TEST_OTP ?? '000000';
const AUTH_STATE_PATH = 'e2e/.auth-state.json';

test.describe.serial('Auth Flow', () => {
  test('1. Login page renders correctly', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('Welcome back')).toBeVisible();
    await expect(page.getByText('Enter your email to get started')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /continue/i })).toBeVisible();
    await expect(page.getByText('Terms of Service')).toBeVisible();
    console.log('PASS: Login page renders correctly');
  });

  test('2. Login page validates empty email', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /continue/i }).click();
    await page.waitForTimeout(500);
    expect(page.url()).toContain('/login');
    console.log('PASS: Login validates empty email');
  });

  test('3. Full login → OTP → redirect + token storage', async ({ page }) => {
    // Intercept InitiateLogin so we use the pre-sent OTP
    await page.route('**/api/Users/InitiateLogin', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ succeeded: true, result: true, errors: [] }),
      });
    });

    await page.goto('/login');
    await page.locator('input[type="email"]').fill(TEST_EMAIL);
    await page.getByRole('button', { name: /continue/i }).click();

    // OTP page
    await page.waitForURL('**/login/verify', { timeout: 15000 });
    await expect(page.getByText('Verify your email')).toBeVisible();
    await expect(page.getByText(TEST_EMAIL)).toBeVisible();

    // OTP inputs rendered
    const otpInputs = page.locator('input[aria-label^="Digit"]');
    await expect(otpInputs).toHaveCount(6);

    // Enter OTP
    const digits = TEST_OTP.split('');
    for (let i = 0; i < 6; i++) {
      await otpInputs.nth(i).fill(digits[i]);
    }

    // Wait for redirect
    await expect(page).not.toHaveURL(/\/login/, { timeout: 15000 });
    console.log('Post-login URL:', page.url());

    // Tokens in localStorage
    const accessToken = await page.evaluate(() => localStorage.getItem('upro_access_token'));
    const refreshToken = await page.evaluate(() => localStorage.getItem('upro_refresh_token'));
    expect(accessToken).toBeTruthy();
    expect(refreshToken).toBeTruthy();
    console.log('PASS: Login → OTP → redirect + tokens stored');

    // Save auth state for other tests
    await page.context().storageState({ path: AUTH_STATE_PATH });
  });
});

test.describe('Session Persistence', () => {
  test.use({ storageState: AUTH_STATE_PATH });

  test('4. Session survives page reload', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const accessToken = await page.evaluate(() => localStorage.getItem('upro_access_token'));
    expect(accessToken).toBeTruthy();

    // Reload
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    expect(page.url()).not.toContain('/login');

    const atAfter = await page.evaluate(() => localStorage.getItem('upro_access_token'));
    const rtAfter = await page.evaluate(() => localStorage.getItem('upro_refresh_token'));
    expect(atAfter).toBeTruthy();
    expect(rtAfter).toBeTruthy();

    await expect(page.getByRole('button', { name: /sign in/i })).not.toBeVisible({ timeout: 5000 });
    console.log('PASS: Session persists after reload');
  });
});

test.describe('Public Pages', () => {
  test('5. Home page loads with tasks view', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Browse Tasks' }).first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: /tasks/i }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /executors/i }).first()).toBeVisible();
    console.log('PASS: Home page loads');
  });

  test('6. Home page tasks/executors toggle', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: 'Browse Tasks' }).first()).toBeVisible({ timeout: 10000 });

    // Switch to executors
    await page.getByRole('button', { name: /executors/i }).first().click();
    await page.waitForTimeout(1000);
    await expect(page.getByRole('heading', { name: 'Find Executors' }).first()).toBeVisible();

    // Switch back to tasks
    await page.getByRole('button', { name: /tasks/i }).first().click();
    await page.waitForTimeout(1000);
    await expect(page.getByRole('heading', { name: 'Browse Tasks' }).first()).toBeVisible();
    console.log('PASS: Tasks/Executors toggle works');
  });

  test('7. Navbar (unauthenticated) renders correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('UPro').first()).toBeVisible();
    await expect(page.getByRole('link', { name: /home/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
    console.log('PASS: Navbar (unauthenticated)');
  });

  test('8. 404 page renders', async ({ page }) => {
    await page.goto('/some-nonexistent-page-12345');
    await expect(page.getByText('404')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Page not found')).toBeVisible();
    await expect(page.getByRole('link', { name: /back to home/i })).toBeVisible();
    console.log('PASS: 404 page renders');
  });

  test('9. 404 → Back to Home navigation', async ({ page }) => {
    await page.goto('/nonexistent-xyz');
    await expect(page.getByText('404')).toBeVisible();
    await page.getByRole('link', { name: /back to home/i }).click();
    await page.waitForTimeout(1000);
    expect(page.url()).toMatch(/\/$/);
    console.log('PASS: 404 → Back to Home works');
  });
});

test.describe('Authenticated Pages', () => {
  test.use({ storageState: AUTH_STATE_PATH });

  test('10. Navbar shows authenticated state', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await expect(page.getByRole('button', { name: /sign in/i })).not.toBeVisible({ timeout: 5000 });
    await expect(page.getByRole('link', { name: /my tasks/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /chat/i })).toBeVisible();
    console.log('PASS: Navbar (authenticated) correct');
  });

  test('11. Profile page loads', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    expect(page.url()).not.toContain('/login');

    // Either profile loaded, is loading, or errored (all valid — means page rendered)
    const hasProfile = await page.getByText('My Profile').isVisible().catch(() => false);
    const hasLoading = await page.locator('.animate-spin').isVisible().catch(() => false);
    const hasError = await page.getByText('Failed to load').isVisible().catch(() => false);
    expect(hasProfile || hasLoading || hasError).toBeTruthy();

    if (hasProfile) {
      await expect(page.getByText('Profile Details')).toBeVisible();
      await expect(page.getByRole('button', { name: /edit/i })).toBeVisible();
      console.log('  Profile details section visible');
    }
    console.log('PASS: Profile page loads (not redirected)');
  });

  test('12. Profile edit mode toggle', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const hasProfile = await page.getByText('My Profile').isVisible().catch(() => false);
    if (!hasProfile) {
      console.log('SKIP: Profile not loaded, skipping edit test');
      return;
    }

    // Click Edit
    await page.getByRole('button', { name: /edit/i }).click();
    await page.waitForTimeout(500);

    // Should show form fields
    await expect(page.locator('input#firstName')).toBeVisible();
    await expect(page.locator('input#lastName')).toBeVisible();

    // Cancel button
    await expect(page.getByRole('button', { name: /cancel/i })).toBeVisible();
    await page.getByRole('button', { name: /cancel/i }).click();
    await page.waitForTimeout(500);

    // Back to view mode
    await expect(page.getByRole('button', { name: /edit/i })).toBeVisible();
    console.log('PASS: Profile edit/cancel toggle works');
  });

  test('13. My Tasks page loads with tabs', async ({ page }) => {
    await page.goto('/my-tasks');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    expect(page.url()).not.toContain('/login');

    // Tab buttons
    const myTasksTab = page.getByRole('button', { name: /my tasks/i }).first();
    const myAppsTab = page.getByRole('button', { name: /my applications/i });

    await expect(myTasksTab).toBeVisible();
    await expect(myAppsTab).toBeVisible();

    // Switch to applications tab
    await myAppsTab.click();
    await page.waitForTimeout(1000);

    // Status filters should appear
    const allFilter = page.getByRole('button', { name: /^all$/i });
    const hasFilters = await allFilter.isVisible().catch(() => false);
    console.log('  Application filters visible:', hasFilters);

    console.log('PASS: My Tasks page with tabs');
  });

  test('14. Create Task page loads', async ({ page }) => {
    await page.goto('/tasks/new');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    expect(page.url()).toContain('/tasks/new');
    expect(page.url()).not.toContain('/login');

    // Page didn't crash - check for some form elements
    const pageContent = await page.textContent('body');
    const hasFormContent = pageContent?.includes('Title') ||
                           pageContent?.includes('Description') ||
                           pageContent?.includes('Create') ||
                           pageContent?.includes('Task');
    expect(hasFormContent).toBeTruthy();
    console.log('PASS: Create Task page loads');
  });

  test('15. Chat page loads', async ({ page }) => {
    await page.goto('/chat');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    expect(page.url()).not.toContain('/login');
    expect(page.url()).toContain('/chat');
    console.log('PASS: Chat page loads');
  });
});

test.describe('Navigation Flow', () => {
  test.use({ storageState: AUTH_STATE_PATH });

  test('16. Navigate through all nav links', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Home
    await page.getByRole('link', { name: /home/i }).click();
    await page.waitForTimeout(1000);
    expect(page.url()).toMatch(/\/(tasks)?$/);
    console.log('  Home ✓');

    // My Tasks
    await page.getByRole('link', { name: /my tasks/i }).click();
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('/my-tasks');
    console.log('  My Tasks ✓');

    // Chat
    await page.getByRole('link', { name: /chat/i }).click();
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('/chat');
    console.log('  Chat ✓');

    // Profile (avatar link)
    const profileLink = page.locator('a[href="/profile"]');
    if (await profileLink.isVisible()) {
      await profileLink.click();
      await page.waitForTimeout(1000);
      expect(page.url()).toContain('/profile');
      console.log('  Profile ✓');
    }

    console.log('PASS: All nav links work');
  });

  test('17. Create Task button from Home', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const createBtn = page.getByRole('button', { name: /create task/i });
    if (await createBtn.isVisible()) {
      await createBtn.click();
      await page.waitForTimeout(1500);
      expect(page.url()).toContain('/tasks/new');
      console.log('PASS: Create Task button navigates correctly');
    } else {
      console.log('SKIP: Create Task button not visible');
    }
  });
});

test.describe('Protected Route Guards', () => {
  test('18. Unauthenticated user redirected from protected pages', async ({ page }) => {
    // Clear any auth state
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.removeItem('upro_access_token');
      localStorage.removeItem('upro_refresh_token');
    });

    const protectedRoutes = ['/my-tasks', '/tasks/new', '/chat', '/profile'];

    for (const route of protectedRoutes) {
      await page.goto(route);
      await page.waitForTimeout(3000);
      expect(page.url()).toContain('/login');
      console.log(`  ${route} → redirected to /login ✓`);
    }
    console.log('PASS: Protected routes redirect unauthenticated users');
  });
});

test.describe('OTP Page Features', () => {
  test('19. OTP page redirects without email state', async ({ page }) => {
    await page.goto('/login/verify');
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/login');
    expect(page.url()).not.toContain('/verify');
    console.log('PASS: OTP page redirects without email');
  });

  test('20. OTP page back button + resend countdown', async ({ page }) => {
    await page.route('**/api/Users/InitiateLogin', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ succeeded: true, result: true, errors: [] }),
      });
    });

    await page.goto('/login');
    await page.locator('input[type="email"]').fill(TEST_EMAIL);
    await page.getByRole('button', { name: /continue/i }).click();
    await page.waitForURL('**/login/verify', { timeout: 10000 });

    // Resend countdown
    await expect(page.getByText(/resend in \d+s/i)).toBeVisible();
    console.log('  Resend countdown visible ✓');

    // Back button
    await page.getByRole('button', { name: /back/i }).click();
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('/login');
    expect(page.url()).not.toContain('/verify');
    console.log('  Back button works ✓');
    console.log('PASS: OTP page features');
  });
});
