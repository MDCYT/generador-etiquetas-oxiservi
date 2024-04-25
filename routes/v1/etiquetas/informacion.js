const express = require('express');
const jspdf = require('jspdf');
const fs = require('fs');

const router = express.Router();

router.get('/v1/etiquetas/stickerinformacion', (req, res) => {
        // Create a new PDF document
        const doc = new jspdf.jsPDF({
            orientation: 'landscape',
            format: [48, 25]
        })
    
        doc.setFontSize(12);
    
        doc.text(`OXISERVI SRL`, 24, 6, { align: 'center' });
        doc.text(`Pedidos:`, 24, 14, { align: 'center' });
        doc.text(`Telefono: 990892713`, 24, 22, { align: 'center' });
    
    
        // Generate a random name for the PDF file
        const randomName = `output-${Math.random().toString(36).substring(7)}.pdf`;
    
        // Save the PDF document
        doc.save(randomName);
    
        // Render the PDF document in the browser
        res.type('pdf');
    
        res.send(fs.readFileSync(randomName));
})

module.exports = router;