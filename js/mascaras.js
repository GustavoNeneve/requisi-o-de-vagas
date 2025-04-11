export const mascaras = {
  aplicarMascaraTelefone(event) {
    let telefone = event.target.value.replace(/\D+/g, "");
    
    if (telefone.length > 11) telefone = telefone.slice(0, 11);
    
    if (telefone.length > 10) {
      telefone = telefone.replace(/^(\d{2})(\d{1})(\d{4})(\d{4})$/, "($1) $2 $3-$4");
    } else if (telefone.length > 6) {
      telefone = telefone.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
    } else if (telefone.length > 2) {
      telefone = telefone.replace(/^(\d{2})(\d{0,4})$/, "($1) $2");
    } else {
      telefone = telefone.replace(/^(\d*)$/, "($1");
    }
    
    event.target.value = telefone;
  },

  aplicarMascaraValor(event) {
    let valor = event.target.value.replace(/\D+/g, "");
    
    if (valor === "") {
      event.target.value = "R$0,00";
      return;
    }
    
    valor = (parseFloat(valor) / 100).toFixed(2);
    event.target.value = `R$${valor.replace(".", ",")}`;
  }
};
