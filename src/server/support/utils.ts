



export function extractResolutionsFromManifest(manifestContent: string): any {
  const regexResolution = /RESOLUTION=(\d+x\d+)/g;
  const matches = manifestContent.match(regexResolution);

  const regexBandwidth = /BANDWIDTH=(\d+)/g;
  const matches2 = manifestContent.match(regexBandwidth);
  if (matches && matches2) {
    return {
      manBitrates: matches.map((match) => match.split('=')[1]),
      manBandwidth: matches2.map((match) => match.split('=')[1]),
      };
  }
  return {};
}


export function parsePlaylistContent(playlistContent: string): { targetDuration: number; fragmentCount: number } {
    const lines = playlistContent.split('\n');
    let targetDuration = 0;
    let fragmentCount = 0;
  
    for (const line of lines) {
      if (line.startsWith('#EXT-X-TARGETDURATION:')) {
        const durationStr = line.split(':')[1];
        targetDuration = parseInt(durationStr, 10);
      } else if (line.startsWith('#EXTINF:')) {
        fragmentCount++;
      }
    }
  
    return { targetDuration, fragmentCount };
  }



const config = {

  "HLS": {
    "ticket": "https://api-test.hivestreaming.com/v1/events/9001/15/2060/cV1AMV4P9FOyf3cl",
    "manifest": "https://streaming-simulator-prod.hivestreaming.com/generic/live/beta-big-bunny-multi/manifest.m3u8"
  },
  "DASH": {
    "ticket": "https://api-test.hivestreaming.com/v1/events/9001/6/1842/8KAiaYDvMgfJAD24",
    "manifest": "https://streaming-simulator-prod.hivestreaming.com/wams/live/beta-llamaDrama.ism/manifest(format=mpd-time-csf)"
  },
  "WOWZA": {
    "ticket": "https://api-test.hivestreaming.com/v1/events/9001/15/1561/TqqkQLKAJDEN5hLX",
    "manifest": "https://wowzaec2demo.streamlock.net/live/bigbuckbunny/manifest_mpm4sav_mvtime.mpd"
  }
}