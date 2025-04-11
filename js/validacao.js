import { elementos } from './elementos.js';

export const validacao = {
  validarCampo(input) {
    if (input.validity.valid) {
      input.classList.remove("invalid");
      input.classList.add("valid");
    } else {
      input.classList.remove("valid");
      input.classList.add("invalid");
    }
  },

  validarCamposCondicionais() {
    const erros = [];

    // Usando referências do elementos.js
    if (!elementos.divulgaLogo.value.trim()) {
      erros.push("Pode divulgar logo é obrigatório");
      elementos.divulgaLogo.classList.add('invalid');
    }

    // Validação de campos básicos
    const camposObrigatorios = {
      'analista': 'Nome do analista',
      'whatsapp': 'WhatsApp',
      'divulgaLogo': 'Pode divulgar logo',
      'producao': 'É produção',
      'cargo': 'Nome do cargo',
      'vagas': 'Quantas vagas',
      'joinville': 'É para Joinville',
      'impulsionar': 'É para impulsionar',
      'temDataDefinida': 'Tem data definida',
      'temHorarioDefinido': 'Tem horário definido'
    };

    Object.entries(camposObrigatorios).forEach(([campo, label]) => {
      const elemento = document.querySelector(`[name="${campo}"], #${campo}`);
      if (!elemento?.value.trim()) {
        erros.push(`${label} é obrigatório`);
        elemento?.classList.add('invalid');
      }
    });

    // Validação condicional: Logo e Nome da Empresa
    if (elementos.divulgaLogo.value === "Sim") {
      if (!elementos.nomeEmpresaContainer.querySelector('input').value.trim()) {
        erros.push("Nome da empresa é obrigatório quando logo pode ser divulgada");
        elementos.nomeEmpresaContainer.querySelector('input').classList.add('invalid');
      }
    }

    // Validação de datas
    if (elementos.temDataDefinida.value === "Sim") {
      const tipoData = document.querySelector('input[name="tipoData"]:checked');
      if (!tipoData) {
        erros.push("Selecione o tipo de data (Única ou Intervalo)");
      } else {
        if (tipoData.value === "unico") {
          const datas = document.querySelectorAll('input[name="datas[]"]');
          if (![...datas].some(d => d.value)) {
            erros.push("Preencha pelo menos uma data");
            datas.forEach(d => d.classList.add('invalid'));
          }
        } else {
          const dataInicio = document.querySelector('input[name="dataInicio[]"]');
          const dataFim = document.querySelector('input[name="dataFim[]"]');
          if (!dataInicio?.value || !dataFim?.value) {
            erros.push("Preencha o intervalo de datas completo");
            dataInicio?.classList.add('invalid');
            dataFim?.classList.add('invalid');
          }
        }
      }
    }

    // Validação de horários
    if (elementos.temHorarioDefinido.value === "Sim") {
      const tipoHorario = document.querySelector('input[name="tipoHorario"]:checked');
      if (!tipoHorario) {
        erros.push("Selecione o tipo de horário (Único ou Intervalo)");
      } else {
        if (tipoHorario.value === "unico") {
          const horarios = document.querySelectorAll('input[name="horarios[]"]');
          if (![...horarios].some(h => h.value)) {
            erros.push("Preencha pelo menos um horário");
            horarios.forEach(h => h.classList.add('invalid'));
          }
        } else {
          const horaInicio = document.querySelector('input[name="horaInicio[]"]');
          const horaFim = document.querySelector('input[name="horaFim[]"]');
          if (!horaInicio?.value || !horaFim?.value) {
            erros.push("Preencha o intervalo de horários completo");
            horaInicio?.classList.add('invalid');
            horaFim?.classList.add('invalid');
          }
        }
      }
    }

    // Validação de localização
    if (elementos.joinville.value === "Não") {
      const cidade = document.querySelector('input[name="outraCidade"]');
      const bairros = document.querySelector('input[name="outrosBairros"]');
      if (!cidade.value.trim()) erros.push("Informe a cidade");
      if (!bairros.value.trim()) erros.push("Informe os bairros");
    } else {
      const bairrosJoinville = document.querySelector('select[name="bairros"]');
      if (!bairrosJoinville.value) erros.push("Selecione os bairros de Joinville");
    }

    // Validação de impulsionamento usando elementos centralizados
    if (elementos.impulsionar.value === "Sim") {
      if (!elementos.idadeMinima.value.trim()) {
        erros.push("Idade mínima é obrigatória");
        elementos.idadeMinima.classList.add('invalid');
      }
      
      if (!elementos.idadeMaxima.value.trim()) {
        erros.push("Idade máxima é obrigatória");
        elementos.idadeMaxima.classList.add('invalid');
      }

      if (!elementos.bairrosSelect.value) {
        erros.push("Selecione os bairros para impulsionamento");
        elementos.bairrosSelect.classList.add('invalid');
      }
    }

    return erros;
  },

  exibirErrosValidacao(erros) {
    if (erros.length === 0) return true;

    Swal.fire({
      icon: 'error',
      title: 'Campos Incompletos',
      html: `
        <div class="error-list">
          <p>Por favor, corrija:</p>
          ${erros.map(erro => `<p>• ${erro}</p>`).join('')}
        </div>
      `,
      confirmButtonText: 'OK'
    });

    const primeiroInvalido = document.querySelector('.invalid');
    if (primeiroInvalido) {
      primeiroInvalido.scrollIntoView({ behavior: "smooth", block: "center" });
      primeiroInvalido.focus();
    }

    return false;
  },

  // Adicionar método para validar campos específicos
  validarCamposEspecificos(campos) {
    campos.forEach(campo => this.validarCampo(campo));
  }
};
