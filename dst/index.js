"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const playwright_1 = require("playwright");
const launchOptions = {
    headless: false,
    args: ["--start-maximized", "--disable-dev-shm-usage", "--no-sandbox", "--no-zygote", "--disable-setuid-sandbox"],
};
async function getManifestURL(url) {
    const browser = await playwright_1.chromium.launch(launchOptions);
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.setViewportSize({ width: 1200, height: 800 });
    try {
        page.on('request', request => console.log('>>', request.method(), request.url()));
        page.on('response', response => console.log('<<', response.status(), response.url()));
        const encodedUrl = encodeURIComponent(url);
        await page.goto(url, { waitUntil: 'networkidle' });
    }
    catch (error) {
        console.error('Error occurred during request interception:', error);
    }
    finally {
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
