const express = require('express');
const jspdf = require('jspdf');
const fs = require('fs');

const router = express.Router();

router.get('/v1/etiquetas/stickermedicinal', (req, res) => {
    // Get query parameters
    const { corp, lote, quantity, number } = req.query;

    if (!corp || !lote || !quantity || !number) {
        return res.status(400).send('Missing parameters');
    }

    // Fabrication day is today, and expiration day is in 5 years
    const fabricationDateFormatted = `${new Date().getDate() > 9 ? new Date().getDate() : `0${new Date().getDate()}`}/${new Date().getMonth() + 1 > 9 ? new Date().getMonth() + 1 : `0${new Date().getMonth() + 1}`}/${new Date().getFullYear()}`;
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 5);
    const expirationDateFormatted = `${expirationDate.getDate() > 9 ? expirationDate.getDate() : `0${expirationDate.getDate()}`}/${expirationDate.getMonth() + 1 > 9 ? expirationDate.getMonth() + 1 : `0${expirationDate.getMonth() + 1}`}/${expirationDate.getFullYear()}`;

    // Create a new PDF document
    const doc = new jspdf.jsPDF({
        orientation: 'landscape',
        format: [48, 25]
    })

    doc.setFontSize(8);

    doc.text(corp, 24, 4, { align: 'center' });
    doc.text(`Cliente: OXISERVI SRL`, 24, 7, { align: 'center' });
    doc.text(`Lote: ${lote}`, 24, 10, { align: 'center' });
    doc.text(`Fecha de Fabricación: ${fabricationDateFormatted}`, 24, 13, { align: 'center' });
    doc.text(`Fecha de Expiración: ${expirationDateFormatted}`, 24, 16, { align: 'center' });
    doc.text(`Contenido: ${quantity} Mt3`, 24, 19, { align: 'center' });
    doc.text(`N°: ${number}`, 24, 22, { align: 'center' });

    const randomName = `output-${Math.random().toString(36).substring(7)}.pdf`;

    // Save the PDF document
    doc.save(randomName);

    // Render the PDF document in the browser
    res.type('pdf');

    res.send(fs.readFileSync(randomName));
})

module.exports = router;