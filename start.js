const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.connect({
            browserURL: 'http://localhost:####',
            defaultViewport: null,
        });

        const pages = await browser.pages();
        const page = pages.length > 0 ? pages[0] : await browser.newPage(); // Utiliza la primera página abierta o crea una nueva

        // read the txt
        const songListPath = 'YOUR TXT DIRECTORY';
        const songs = require('fs').readFileSync(songListPath, 'utf-8').split('\n').map(song => song.trim()).filter(song => song.length > 0);

        let currentIndex = 0;

        console.log('Iniciando proceso de búsqueda y agregado de canciones...');

        // Iterate over the songs list
        for (const song of songs) {
            // Buscar la canción en YouTube
            await page.goto(`https://www.youtube.com/results?search_query=${encodeURIComponent(song)}`);
            await page.waitForSelector('ytd-video-renderer');

            // get first video link
            const video = await page.$('ytd-video-renderer');
            if (video) {
                const videoUrl = await page.evaluate(el => el.querySelector('#video-title').getAttribute('href'), video);

                // go to the video
                await page.goto(`https://www.youtube.com${videoUrl}`);
                await page.waitForSelector('ytd-video-view-count-renderer'); // Esperar a que cargue el video

                console.log(`Reproduciendo: ${song}`);

                // click on menu button
                try {
                    await page.waitForSelector('#button-shape > button > yt-touch-feedback-shape > div > div.yt-spec-touch-feedback-shape__fill');
                    await page.click('#button-shape > button > yt-touch-feedback-shape > div > div.yt-spec-touch-feedback-shape__fill');

                    // wait and click on save
                    await page.waitForSelector('#items > ytd-menu-service-item-renderer.style-scope.ytd-menu-popup-renderer.iron-selected > tp-yt-paper-item');
                    await page.click('#items > ytd-menu-service-item-renderer.style-scope.ytd-menu-popup-renderer.iron-selected > tp-yt-paper-item');

                    // Wait for the option of your playlist and click on it
                    await page.waitForSelector('THE CSS FROM THE PLAYLIST SELECTOR');
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
