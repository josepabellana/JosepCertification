
import * as puppeteer from 'puppeteer';
import { chromium } from 'playwright';

const launchOptions = {
	slowMo: 0,
  args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--deny-permission-prompts'],
  firefoxUserPrefs: {
      'media.navigator.streams.fake': true,
      'media.navigator.permission.disabled': true
  }
};

async function getManifestURL(url: string): Promise<string | null> {
    const browser = await chromium.launch({...launchOptions, channel: 'chrome'});
    const context = await browser.newContext({
      viewport: { width: 1200, height: 800 },
      ignoreHTTPSErrors: true
    });
    const page = await context.newPage();
  
    try {
      page.on('request', request => console.log('>>', request.method(), request.url()))
      page.on('response', response => console.log('<<', response.status(), response.url()))
      

      const encodedUrl = encodeURIComponent(url);
      await page.goto(url, { waitUntil: 'networkidle' });
    } catch (error) {
      console.error('Error occurred during request interception:', error);
    } finally {
      await page.screenshot({ path: 'screenshot.png' });
    }
    
    return null;
  }
  
  // Llamar a la función y proporcionar la URL de la página web
  const url = 'https://hivejsartifacts.blob.core.windows.net/artifacts/plugins/102147/html5/dist/reference/html5/9.2.0/hivejs/silent-videojs.test.html?manifest=https://streaming-simulator-prod.hivestreaming.com/generic/live/beta-big-bunny-multi/manifest.m3u8?callback=https://api.hivestreaming.com/v1/events/9001/15/1894266/mWnCvsg73dQRIfoj';
  getManifestURL(url)
    .then((manifestURL) => {
      // Hacer algo con la URL del manifest, como procesarlo o guardarlo en una base de datos
      if (manifestURL) {
        // Realizar acciones adicionales con la URL del manifest
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });