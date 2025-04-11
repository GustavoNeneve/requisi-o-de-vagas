export const pdf = {
  async confirmarEnvio() {
    return await Swal.fire({
      title: "Confirmar envio?",
      text: "Verifique se todos os dados estão corretos",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim, enviar",
      cancelButtonText: "Revisar dados"
    });
  },

  async salvarPDF() {
    const element = document.getElementById("vagaForm");
    return html2pdf().from(element).save();
  },

  async previewPDF() {
    const element = document.getElementById("vagaForm");
    const pdf = await html2pdf().from(element).output("datauristring");
    
    return Swal.fire({
      title: "Preview do PDF",
      html: `<iframe src="${pdf}" width="100%" height="500px"></iframe>`,
      width: "80%",
      confirmButtonText: "Salvar PDF",
      showCancelButton: true
    });
  }
};
