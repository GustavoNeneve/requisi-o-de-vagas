async function gerarPDFCompleto(formId, filename) {
    const { PDFDocument, StandardFonts, rgb } = PDFLib;
  
    const formEl = document.getElementById(formId);
    const formData = new FormData(formEl);
  
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4 dimensions in pt
  
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;
    let y = 800;
  
    page.drawText('Formulário de Vaga - Dados Preenchidos', {
      x: 50,
      y,
      size: 18,
      font,
      color: rgb(0, 0.2, 0.6),
    });
  
    y -= 30;
  
    formData.forEach((value, key) => {
      // Para múltiplos valores (ex: bairros selecionados)
      const displayValue = typeof value === 'string' ? value : [...value].join(', ');
  
      // Quebra linha se necessário
      const lines = `${key}: ${displayValue}`.match(/.{1,80}/g) || [];
  
      lines.forEach((line) => {
        if (y < 50) {
          page = pdfDoc.addPage([595, 842]);
          y = 800;
        }
        page.drawText(line, {
          x: 50,
          y,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });
        y -= 20;
      });
    });
  
    const pdfBytes = await pdfDoc.save();
  
    // Download automático
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename || 'formulario_completo.pdf';
    link.click();
  }
  