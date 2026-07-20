const puppeteer = require('puppeteer');

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
    console.log("Navigating...");
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await delay(1000);
    
    // Launch
    const launchBtns = await page.$$('button');
    for(let b of launchBtns) {
        const text = await page.evaluate(el => el.textContent, b);
        if(text.includes('Launch')) { await b.click(); break; }
    }
    await delay(1500);

    // Start Call
    const startCallBtn = await page.$('#start-call-btn');
    if (startCallBtn) await startCallBtn.click();
    await delay(1000);
    
    console.log("Simulating Police Scam...");
    const policeBtn = await page.$('#simulate-attack-btn');
    if (policeBtn) await policeBtn.click();
    
    // Wait for lockdown (score > 90)
    await delay(12000);
    
    // View Investigation Report
    const reportBtns = await page.$$('button');
    for(let b of reportBtns) {
        const text = await page.evaluate(el => el.textContent, b);
        if(text.includes('View Investigation Report')) {
            await b.click();
            break;
        }
    }
    
    await delay(2000);
    await page.screenshot({ path: 'assets/screenshots/investigation-report.png', fullPage: true });
    console.log("Captured investigation-report.png");
    
  } catch (e) {
      console.error("Error during capture:", e);
  } finally {
      await browser.close();
      console.log("Browser closed.");
  }
}

run();
