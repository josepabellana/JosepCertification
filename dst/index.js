"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const playwright_1 = require("playwright");
const launchOptions = {
    slowMo: 0,
    args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--deny-permission-prompts'],
    firefoxUserPrefs: {
        'media.navigator.streams.fake': true,
        'media.navigator.permission.disabled': true
    }
};
async function getManifestURL(url) {
    return new Promise(async (resolve, reject) => {
        const browser = await playwright_1.chromium.launch({ ...launchOptions, channel: 'chrome' });
        const context = await browser.newContext({
            viewport: { width: 1200, height: 800 },
            ignoreHTTPSErrors: true
        });
        const page = await context.newPage();
        let manifestContent = null;
        try {
            page.on('request', request => {
                if (request.resourceType() === 'xhr' && /manifest.m3u8$/i.test(request.url())) {
                    console.log('>>', request.resourceType(), request.url());
                    const manifestURL = request.url();
                    console.log(`Manifest URL: ${manifestURL}`);
                    request.response().then((res) => {
                        res.text().then((text) => {
                            manifestContent = text;
                        });
                    });
                }
                if (request.resourceType() === 'xhr' && /playlist.m3u8$/i.test(request.url())) {
                    console.log('>>', request.resourceType(), request.url());
                    const playlistURK = request.url();
                    console.log(`Playlist URL: ${playlistURK}`);
                    request.response().then((res) => {
                        res.text().then((text) => {
                            resolve({ manifestContent, playlistContent: text });
                            // Close the browser
                            browser.close();
                        });
                    });
                }
            });
            // const encodedUrl = encodeURIComponent(url);
            await page.goto(url, { waitUntil: 'networkidle' });
        }
        catch (error) {
            console.error('Error occurred during request interception:', error);
            reject('');
        }
        finally {
            await page.screenshot({ path: 'screenshot.png' });
        }
    });
}
// Llamar a la función y proporcionar la URL de la página web
// const url = 'https://hivejsartifacts.blob.core.windows.net/artifacts/plugins/102147/html5/dist/reference/html5/9.2.0/hivejs/silent-videojs.test.html?manifest=https://streaming-simulator-prod.hivestreaming.com/generic/live/beta-big-bunny-multi/manifest.m3u8?callback=https://api.hivestreaming.com/v1/events/9001/15/1894266/mWnCvsg73dQRIfoj';
// getManifestURL(url)
//   .then(({manifestContent, playlistContent}) => {
//     // console.log(manifestContent);
//     if (manifestContent) {
//      let manifestBitrates = extractResolutionsFromManifest(manifestContent);
//      if(manifestBitrates && manifestBitrates.length > 0){
//         console.log('This manifest has:', manifestBitrates.length);
//         console.log('The highest Bitrate is:', manifestBitrates[0]);
//      }
//     }
//     if(playlistContent){
//       let {targetDuration, fragmentCount} = parsePlaylistContent(playlistContent);
//       if(targetDuration) console.log('The playlist have the following fragment duration:', targetDuration);
//       if(fragmentCount) console.log('The amount of fragments are: ', fragmentCount);
//     }
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   });
