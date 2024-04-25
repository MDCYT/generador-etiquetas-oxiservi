const express = require('express');
const jspdf = require('jspdf');
const fs = require('fs');

const router = express.Router();

router.get('/v1/etiquetas/stickerinventario', (req, res) => {
    // Get query parameters
    const { gas, numero } = req.query;

    if (!gas || !numero) {
        return res.status(400).send('Missing parameters');
    }

    // Format the date like this: DD/MM/YYYY
    const date = new Date();
    const dateFormatted = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // Create a new PDF document
    const doc = new jspdf.jsPDF({
        orientation: 'landscape',
        format: [48, 25]
    })

    doc.setFontSize(8);

    doc.text(`Inventario ${year}`, 24, 5, { align: 'center' });
    doc.text(`OXISERVI SRL`, 24, 8, { align: 'center' });
    doc.text(`Gas: ${gas}`, 24, 11, { align: 'center' });
    doc.text(`N°: ${numero}`, 24, 14, { align: 'center' });
    doc.text(`Fecha: ${dateFormatted}`, 24, 17, { align: 'center' });

    //  Set BarcodeFont font
    doc.setFont('BarcodeFont')
    //  Set the font size
    doc.setFontSize(16)
    doc.text(`${numero},${day}-${month}-${year}`, 24, 24, { align: 'center' });

    // Generate a random name for the PDF file
    const randomName = `output-${Math.random().toString(36).substring(7)}.pdf`;

    // Save the PDF document
    doc.save(randomName);

    // Render the PDF document in the browser
    res.type('pdf');

    res.send(fs.readFileSync(randomName));
})

module.exports = router;