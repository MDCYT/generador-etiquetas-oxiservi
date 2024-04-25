const express = require('express');
const jspdf = require('jspdf');
const fs = require('fs');

const router = express.Router();

router.get('/v1/etiquetas/stickerindustrial', (req, res) => {
    // Get query parameters
    const { gas, contenido, oc, ubicacion} = req.query;

    if (!gas || !contenido || !oc || !ubicacion) {
        return res.status(400).send('Missing parameters');
    }

    // Format the date like this: DD/MM/YYYY
    const date = new Date();
    const dateFormatted = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

    // Create a new PDF document
    const doc = new jspdf.jsPDF({
        orientation: 'landscape',
        format: [48, 25]
    })

   doc.setFontSize(8);

    doc.text("OXISERVI SRL", 24, 6, { align: 'center' });
    doc.text(`Gas: ${gas}`, 24, 9, { align: 'center' });
    doc.text(`Contenido: ${contenido} ${(gas === 'Acetileno' || gas === 'CO2') ? 'Kg' : 'Mt3'}`, 24, 12, { align: 'center' });
    doc.text(`OC: ${oc}`, 24, 15, { align: 'center' });
    doc.text(`Destino: ${ubicacion}`, 24, 18, { align: 'center' });
    doc.text(`Fecha: ${dateFormatted}`, 24, 21, { align: 'center' });

    // Generate a random name for the PDF file
    const randomName = `output-${Math.random().toString(36).substring(7)}.pdf`;

    // Save the PDF document
    doc.save(randomName);

    // Render the PDF document in the browser
    res.type('pdf');

    res.send(fs.readFileSync(randomName));
})

module.exports = router;