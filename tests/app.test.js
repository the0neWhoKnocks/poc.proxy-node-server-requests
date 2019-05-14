const puppeteer = require('puppeteer');
const { resolve } = require('path');
const launchOpts = require('./launchOpts');
const testData = require('./testData');

const disableShots = process.env.DISABLE_SHOTS;

(async () => {
  const start = process.hrtime();
  await testData.use();
  
  const browser = await puppeteer.launch(launchOpts);
  const [ page ] = await browser.pages();
  const successfulApiResponse = response => response.url().includes('/api/data') && response.status() === 200;
  
  await page.goto(`http://localhost:${ process.env.HOST_SERVER_PORT }`);
  if(!disableShots) await page.screenshot({ path: './tests/shots/01 - page-load.png' });
  
  await page.click('button[name="sReq"][data-protocol="https"]');
  await page.waitForResponse(successfulApiResponse);
  if(!disableShots) await page.screenshot({ path: './tests/shots/02 - https-server-req.png' });
  
  await page.click('button[name="sReq"][data-protocol="http"]');
  await page.waitForResponse(successfulApiResponse);
  if(!disableShots) await page.screenshot({ path: './tests/shots/03 - http-server-req.png' });
  
  await page.click('button[name="cReq"][data-method="get"]');
  await page.waitForResponse('https://rickandmortyapi.com/api/character/1');
  if(!disableShots) await page.screenshot({ path: './tests/shots/04 - client-get-req.png' });
  
  await page.click('button[name="cReq"][data-method="post"]');
  await page.waitForResponse('https://jsonplaceholder.typicode.com/posts');
  if(!disableShots) await page.screenshot({ path: './tests/shots/05 - client-post-req.png' });
  
  await testData.update({ typicodeCallCount: 2 });
  await page.click('button[name="cReq"][data-method="post"]');
  await page.waitForResponse('https://jsonplaceholder.typicode.com/posts');
  if(!disableShots) await page.screenshot({ path: './tests/shots/06 - client-post-req-2nd-click.png' });
  
  await testData.update({ typicodeCallCount: 3 });
  await page.click('button[name="cReq"][data-method="post"]');
  await page.waitForResponse('https://jsonplaceholder.typicode.com/posts');
  if(!disableShots) await page.screenshot({ path: './tests/shots/07 - client-post-req-3rd-click.png' });
  
  await testData.reset();
  await browser.close();
  
  const end = process.hrtime(start);
  console.info('Execution time: %d.%ds', end[0], Math.round(end[1] / 1000000));
})();