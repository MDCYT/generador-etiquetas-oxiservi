const express = require('express');
const jspdf = require('jspdf');
const fs = require('fs');

const router = express.Router();

router.get('/v1/etiquetas/stickerasignado', (req, res) => {
    // Get query parameters
    const { corp } = req.query;

    if (!corp) {
        return res.status(400).send('Missing parameters');
    }

    // Format the date like this: DD/MM/YYYY
    const dateFormatted = `${new Date().getDate() > 9 ? new Date().getDate() : `0${new Date().getDate()}`}/${new Date().getMonth() + 1 > 9 ? new Date().getMonth() + 1 : `0${new Date().getMonth() + 1}`}/${new Date().getFullYear()}`;;

    // Create a new PDF document
    const doc = new jspdf.jsPDF({
        orientation: 'landscape',
        format: [48, 25]
    })

    doc.setFontSize(8);

    doc.text(`OXISERVI SRL`, 24, 6, { align: 'center' });
    doc.text(`Asignado a: ${corp}`, 24, 9, { align: 'center' });
    doc.text(`Fecha: ${dateFormatted}`, 24, 12, { align: 'center' });

    doc.setFont('BarcodeFont')
    doc.setFontSize(24)
    doc.text(`${corp}`, 24, 22, { align: 'center' });

    // Generate a random name for the PDF file
    const randomName = `output-${Math.random().toString(36).substring(7)}.pdf`;

    // Save the PDF document
    doc.save(randomName);

    // Render the PDF document in the browser
    res.type('pdf');

    res.send(fs.readFileSync(randomName));
})

module.exports = router;