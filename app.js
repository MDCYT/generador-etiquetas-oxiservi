const express = require('express');
const jspdf = require('jspdf');
const fs = require('fs');
const path = require('path');

require("./fonts/BarcodeFont-normal.js");

const app = express();
const port = 3000;

app.use(express.static('public'));

fs.readdir('./routes', (err, files) => {
    if (err) {
        return console.error(err);
    }

    /* Iterate over the files in the directory, example, /routes/v1/etiquetas/medicinal.js, /routes/v1/etiquetas/industrial.js, etc */

    function readRoutes(directory) {
        fs.readdir(directory, (err, files) => {
            if (err) {
                return console.error(err);
            }

            files.forEach(file => {
                const filePath = path.join(directory, file);

                // Check if the file is a directory
                if (fs.lstatSync(filePath).isDirectory()) {
                    readRoutes(filePath);
                } else if (file.endsWith('.js')) {
                    app.use(require("./" + filePath));
                }
            });
        });
    }

    readRoutes('./routes');
})

// Make a for loop to create the routes for the stickers, only for files html in the public folder with start with Sticker, the routes is likes /stickerinventario => /public/StickerInventario.html, /stickerasignado => /public/StickerAsignado.html, /StICkErInFoRmAcIoN => /public/StickerInformacion.html

fs.readdir('./public', (err, files) => {
    if (err) {
        return console.error(err);
    }

    files.forEach(file => {
        if (file.startsWith('Sticker') && file.endsWith('.html')) {
            const route = file.replace('.html', '').toLowerCase();
            app.get(`/${route}`, (req, res) => {
                res.sendFile(__dirname + `/public/${file}`);
            })
        }
    })
})

// Every 5 minutes, check if there are any PDF files older than 5 minutes and delete them
setInterval(() => {
    const directory = './';
    const now = Date.now();

    fs.readdir(directory, (err, files) => {
        if (err) {
            return console.error(err);
        }

        files.forEach(file => {
            // Check if the file is a PDF
            if (file.endsWith('.pdf')) {
                const filePath = `${directory}${file}`;

                console.log(filePath);

                fs.stat(filePath, (err, stats) => {
                    if (err) {
                        return console.error(err);
                    }

                    const creationDate = new Date(stats.birthtime).getTime();
                    const difference = now - creationDate;

                    // If the file is more than 5 minutes old, delete it
                    if (difference > 1000 * 60 * 5) {
                        fs.unlink(filePath, (err) => {
                            if (err) {
                                return console.error(err);
                            }
                        })
                    }
                })
            }
        })
    })
}, 1000 * 60 * 5)

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})