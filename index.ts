import * as puppeteer from 'puppeteer';

async function getManifestURL(url: string): Promise<string | null> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    // Habilitar el evento 'request' en la página
    await page.setRequestInterception(true);
  
    // Escuchar el evento 'request'
    page.on('request', (request) => {
      // Verificar si la solicitud es para el manifest (puedes ajustar esta verificación según tus necesidades)
      if (request.resourceType() === 'manifest') {
        // Obtener la URL del manifest
        const manifestURL = request.url();
        console.log(`Manifest URL: ${manifestURL}`);
  
        // Detener el procesamiento de solicitudes adicionales
        request.abort();
      } else {
        // Continuar con otras solicitudes
        request.continue();
      }
    });
  
    // Navegar a la página web y esperar a que cargue completamente
    await page.goto(url, { waitUntil: 'networkidle0' });
  
    // Cerrar el navegador
    await browser.close();
  
    return null;
  }
  
  // Llamar a la función y proporcionar la URL de la página web
  const url = 'https://www.example.com';
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