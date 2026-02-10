const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(2000); // Wait for page to fully load
  await page.screenshot({ path: 'screenshot.png', fullPage: true });
  await browser.close();
  console.log('Screenshot saved as screenshot.png');
})();
