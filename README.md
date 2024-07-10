# playlist-creator
i want to apologies for bad english

there's a puppiter script that you can use to import a list of names from a txt to your previous created youtube playlist, you should change the some parts of the code

before to execute the script you have to run a chrome remote debugger on the cmd
"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-de^Xbugging-port=####

1. chose a port
         6   browserURL: 'http://localhost:####', // URL de depuración remota de Chrome

2. change the directory from the tx
        14   const songListPath = 'RUTA DE TU TXT';

3. You should change the line 48
     await page.waitForSelector('YOUR CSS SELECTOR');
     changing the it for something like this                     await page.waitForSelector('ytd-playlist-add-to-option-       renderer:nth-child(2)');

how do you do it? you have to go the playlist selector inside of a video, open the inspector and serch for your playlist, then you do right click on the inspector line that contein the option, click "copy" and and "copy selector".

Now i have to warm you about some commun issues

the script could click on other buttons instead of save, so you have to pay atetion to quickly close them and add manually add the video, if it doesnt work, you will have to edit the txt to reestar from the next song

hope it be usefull for you
