
import { chromium } from 'playwright';

const launchOptions = {
	slowMo: 0,
  args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--deny-permission-prompts'],
  firefoxUserPrefs: {
      'media.navigator.streams.fake': true,
      'media.navigator.permission.disabled': true
  }
};

async function getManifestURL(url: string): Promise<any> {
  return new Promise(async (resolve, reject) => {

    const browser = await chromium.launch({...launchOptions, channel: 'chrome'});
    const context = await browser.newContext({
      viewport: { width: 1200, height: 800 },
      ignoreHTTPSErrors: true
    });
    const page = await context.newPage();

    let manifestContent:any = null;
    try {

      page.on('request', (request:any) => {
        
        if (request.resourceType() === 'xhr' && /manifest.m3u8$/i.test(request.url())) {
          console.log('>>', request.resourceType(), request.url());
          const manifestURL = request.url();
          console.log(`Manifest URL: ${manifestURL}`);

          request.response().then((res:any) => {
            res.text().then((text:any) => {
              manifestContent = text;
            });
          });
        }

        if (request.resourceType() === 'xhr' && /playlist.m3u8$/i.test(request.url())) {
          console.log('>>', request.resourceType(), request.url());
          const playlistURK = request.url();
          console.log(`Playlist URL: ${playlistURK}`);

          request.response().then((res:any) => {
            res.text().then((text:any) => {
              resolve({ manifestContent, playlistContent: text});
              // Close the browser
              browser.close();
            });
          });
        }

      })
      
      // const encodedUrl = encodeURIComponent(url);
      await page.goto(url, { waitUntil: 'networkidle' });
    } catch (error) {
      console.error('Error occurred during request interception:', error);
      reject('');
    } finally {
      await page.screenshot({ path: 'screenshot.png' });
      
    }
    
    
    })
  }