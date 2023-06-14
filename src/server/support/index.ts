
import { chromium } from 'playwright';
import {extractResolutionsFromManifest, parsePlaylistContent} from './utils'
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

      page.on('request', request => {
        
        if (request.resourceType() === 'xhr' && /manifest.m3u8$/i.test(request.url())) {
          // console.log('>>', request.resourceType(), request.url());
          const manifestURL = request.url();
          // console.log(`Manifest URL: ${manifestURL}`);

          request.response().then((res:any) => {
            res.text().then((text:any) => {
              manifestContent = text;
            });
          });
        }

        if (request.resourceType() === 'xhr' && /playlist.m3u8$/i.test(request.url())) {
          // console.log('>>', request.resourceType(), request.url());
          const playlistURK = request.url();
          // console.log(`Playlist URL: ${playlistURK}`);

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

 export async function testLogic(url:string){
  return new Promise((res,rej)=>{
  console.log('Starting to process data...');
      getManifestURL(url)
        .then(({manifestContent, playlistContent}) => {
          // console.log(manifestContent);
          let obj:any = {
            'numberBitrates': [],
            'totalBitrate': [],
            'fragmentsInfo': [],
          };

          if (manifestContent) {
            let {manBitrates, manBandwidth} = extractResolutionsFromManifest(manifestContent);
            if(manBitrates && manBitrates.length > 0){

                console.log(`This manifest has ${manBitrates.length} bitrates`);
                if(manBitrates.length == 2 || manBitrates.length == 3) obj['numberBitrates'].push('green');
                else if(manBitrates.length == 1 || manBitrates.length > 3 && manBitrates.length < 6) obj['numberBitrates'].push('yellow');
                else obj['numberBitrates'].push('red');
                obj['numberBitrates'].push(manBitrates.length);
                console.log('The highest Bitrate is:', manBitrates[0]);
                obj['numberBitrates'].push(manBitrates[0]);
            }
            if(manBandwidth && manBandwidth.length > 0){
              console.log(`Maximum bandwidth for this manifest is ${manBandwidth[0]}, this is equal to ${Number(manBandwidth[0])/1000000}Mbps`);
              if(Number(manBandwidth[0])/1000000 < 3.5) obj['totalBitrate'].push('green');
              else obj['totalBitrate'].push('red');
              obj['totalBitrate'].push(Number(manBandwidth[0])/1000000);
            }
          }

          if(playlistContent){
            let {targetDuration, fragmentCount} = parsePlaylistContent(playlistContent);

            if(targetDuration) console.log('The playlist have the following fragment duration:', targetDuration);
            if(fragmentCount) console.log('The amount of fragments are: ', fragmentCount);
            if(fragmentCount * targetDuration > 20 && targetDuration >= 2 && targetDuration <= 4) obj['fragmentsInfo'].push('green');
            else obj['fragmentsInfo'].push('yellow');
            obj['fragmentsInfo'].push(fragmentCount);
            obj['fragmentsInfo'].push(targetDuration);

          }
          console.log('Stopped processing data');
          res(obj);
        })
        .catch((error) => {
          rej({});
          console.error('Error:', error);
        });

      
    });
  }