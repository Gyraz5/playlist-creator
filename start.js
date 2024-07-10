const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.connect({
            browserURL: 'http://localhost:9222', // URL de depuración remota de Chrome
            defaultViewport: null,
        });

        const pages = await browser.pages();
        const page = pages.length > 0 ? pages[0] : await browser.newPage(); // Utiliza la primera página abierta o crea una nueva

        // Leer el archivo songlist.txt
        const songListPath = 'C:\\Users\\Gyraz\\Documents\\scrypt\\gith\\songlist.txt';
        const songs = require('fs').readFileSync(songListPath, 'utf-8').split('\n').map(song => song.trim()).filter(song => song.length > 0);

        let currentIndex = 0; // Índice actual de la canción

        console.log('Iniciando proceso de búsqueda y agregado de canciones...');

        // Iterar sobre la lista de canciones
        for (const song of songs) {
            // Buscar la canción en YouTube
            await page.goto(`https://www.youtube.com/results?search_query=${encodeURIComponent(song)}`);
            await page.waitForSelector('ytd-video-renderer');

            // Obtener el enlace del primer video
            const video = await page.$('ytd-video-renderer');
            if (video) {
                const videoUrl = await page.evaluate(el => el.querySelector('#video-title').getAttribute('href'), video);

                // Navegar al video específico
                await page.goto(`https://www.youtube.com${videoUrl}`);
                await page.waitForSelector('ytd-video-view-count-renderer'); // Esperar a que cargue el video

                console.log(`Reproduciendo: ${song}`);

                // Intentar hacer clic en el botón de menú
                try {
                    await page.waitForSelector('#button-shape > button > yt-touch-feedback-shape > div > div.yt-spec-touch-feedback-shape__fill');
                    await page.click('#button-shape > button > yt-touch-feedback-shape > div > div.yt-spec-touch-feedback-shape__fill');

                    // Esperar y hacer clic en "Guardar" en el menú desplegable
                    await page.waitForSelector('#items > ytd-menu-service-item-renderer.style-scope.ytd-menu-popup-renderer.iron-selected > tp-yt-paper-item');
                    await page.click('#items > ytd-menu-service-item-renderer.style-scope.ytd-menu-popup-renderer.iron-selected > tp-yt-paper-item');

                    // Esperar a que aparezca la opción "Songs" y hacer clic
                    await page.waitForSelector('ytd-playlist-add-to-option-renderer:nth-child(2)');
                    await page.click('ytd-playlist-add-to-option-renderer:nth-child(2)');

                    console.log(`"${song}" agregada a la playlist.`);
                } catch (error) {
                    console.error(`Error al intentar guardar la canción "${song}": ${error.message}`);
                }
            } else {
                console.error(`No se encontró ningún video para la canción "${song}".`);
            }
        }

        console.log('Proceso completado. Todas las canciones han sido agregadas a la playlist.');
        await browser.close();

    } catch (error) {
        console.error('Error:', error);
    }
})();
