const puppeteer = require('puppeteer');
const { resolve } = require('path');
const launchOpts = require('./launchOpts');

(async () => {
  const browser = await puppeteer.launch(launchOpts);
  const [ page ] = await browser.pages();
  
  await page.goto(`http://localhost:${ process.env.HOST_SERVER_PORT }`);
  await page.screenshot({ path: './tests/shots/01 - page-load.png' });
  
  await page.click('button[name="sReq"][data-protocol="https"]');
  await page.screenshot({ path: './tests/shots/02 - https-server-req.png' });
  
  await page.click('button[name="sReq"][data-protocol="http"]');
  await page.screenshot({ path: './tests/shots/03 - http-server-req.png' });
  
  await page.click('button[name="cReq"]');
  await page.screenshot({ path: './tests/shots/04 - client-req.png' });
  
  await browser.close();
})();