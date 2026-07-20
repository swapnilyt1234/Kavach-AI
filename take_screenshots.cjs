const puppeteer = require('puppeteer');
const fs = require('fs');

const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function run() {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,1080']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1080 });

  const url = 'http://localhost:5173';

  try {
    console.log("Navigating to landing page...");
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await delay(1000);

    // 1. Landing Page
    await page.screenshot({ path: 'assets/screenshots/landing-page.png' });
    console.log("Captured landing-page.png");

    // Click 'Launch Secure Banking Sandbox'
    const [launchBtn] = await page.$$("::-p-xpath(//button[contains(., 'Launch')])");
    if (launchBtn) {
      await launchBtn.click();
      await delay(1500);
    }

    // 2. Dashboard
    await page.screenshot({ path: 'assets/screenshots/dashboard.png' });
    console.log("Captured dashboard.png");

    // 3. Payment Safe
    // Fill out payment form
    await page.type('input[placeholder="Full Name"]', 'Swapnil');
    await page.type('input[placeholder="username@bank"]', 'Swapnil@upi');
    await page.type('input[placeholder="0"]', '1000');

    const sendBtn = await page.$('button[type="submit"]');
    if (sendBtn) await sendBtn.click();
    await delay(1000);

    // It should show PaymentSuccessModal since risk is 5%
    await page.screenshot({ path: 'assets/screenshots/payment-safe.png' });
    console.log("Captured payment-safe.png");

    // Close success modal
    const [closeSuccessBtn] = await page.$$("::-p-xpath(//button[contains(., 'Close')])");
    if (closeSuccessBtn) {
      await closeSuccessBtn.click();
      await delay(500);
    }

    // Start Call
    const startCallBtn = await page.$('#start-call-btn');
    if (startCallBtn) {
      await startCallBtn.click();
      await delay(1000);
    }

    // Click KYC Fraud to get Warning Dialog / High Risk (Score goes up to ~70-90)
    console.log("Simulating KYC Fraud...");
    const kycBtn = await page.$('#simulate-kyc-btn');
    if (kycBtn) await kycBtn.click();

    // Wait until score is around 40 (for warning banner)
    await delay(4000);
    await page.screenshot({ path: 'assets/screenshots/payment-warning.png' });
    console.log("Captured payment-warning.png");

    // Click send again to trigger modal
    if (sendBtn) await sendBtn.click();
    await delay(1000);
    await page.screenshot({ path: 'assets/screenshots/warning-dialog.png' });
    console.log("Captured warning-dialog.png");

    // Click cancel
    const [cancelBtn] = await page.$$("::-p-xpath(//button[contains(., 'Cancel')])");
    if (cancelBtn) {
      await cancelBtn.click();
      await delay(500);
    }

    // Wait for score to get to 70-90 for High Risk Confirmation
    await delay(5000);
    if (sendBtn) await sendBtn.click();
    await delay(1000);
    await page.screenshot({ path: 'assets/screenshots/high-risk-confirmation.png' });
    console.log("Captured high-risk-confirmation.png");

    // Cancel again
    const [cancelBtn2] = await page.$$("::-p-xpath(//button[contains(., 'Cancel')])");
    if (cancelBtn2) {
      await cancelBtn2.click();
      await delay(500);
    }

    // Click End Call and Reset
    const endCallBtn = await page.$('#end-call-btn');
    if (endCallBtn) await endCallBtn.click();
    await delay(1000);

    // Start call and click Police scam for block
    if (startCallBtn) await startCallBtn.click();
    await delay(1000);

    console.log("Simulating Police Scam...");
    const policeBtn = await page.$('#simulate-attack-btn');
    if (policeBtn) await policeBtn.click();

    // Wait for lockdown (score > 90)
    await delay(12000);
    await page.screenshot({ path: 'assets/screenshots/transaction-blocked.png' });
    console.log("Captured transaction-blocked.png");

    // View Investigation Report
    const [reportBtn] = await page.$$("::-p-xpath(//button[contains(., 'View Investigation Report')])");
    if (reportBtn) {
      await reportBtn.click();
      await delay(2000);
      await page.screenshot({ path: 'assets/screenshots/investigation-report.png', fullPage: true });
      console.log("Captured investigation-report.png");
    }

  } catch (e) {
    console.error("Error during capture:", e);
  } finally {
    await browser.close();
    console.log("Browser closed.");
  }
}

run();
