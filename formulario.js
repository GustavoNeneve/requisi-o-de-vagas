document.addEventListener("DOMContentLoaded", function () {
  const hoje = new Date().toISOString().split("T")[0];

  // Inicializar datas mínimas
  document.querySelectorAll('input[type="date"]').forEach((input) => {
    input.min = hoje;
    input.addEventListener("change", () => funcoes.formatarData(input));
  });

  // Elementos DOM
  const elementos = {
    divulgaLogo: document.getElementById("divulgaLogo"),
    producao: document.getElementById("producao"),
    avisoMarketing: document.getElementById("avisoMarketing"),
    nomeEmpresaContainer: document.getElementById("nomeEmpresaContainer"),
    joinville: document.getElementById("joinville"),
    cidadeOutras: document.getElementById("cidadeOutras"),
    impulsionar: document.getElementById("impulsionar"),
    impulsionamento: document.getElementById("impulsionamento"),
    presencial: document.getElementById("presencial"),
    outroLugar: document.getElementById("outroLugar"),
    eventoContainer: document.getElementById("eventoContainer"),
    temDataDefinida: document.getElementById("temDataDefinida"),
    datasContainer: document.getElementById("datasContainer"),
    temHorarioDefinido: document.getElementById("temHorarioDefinido"),
    horariosContainer: document.getElementById("horariosContainer"),
    avisoImpulsionamento: document.getElementById("avisoImpulsionamento"),
    progressSteps: document.querySelectorAll(".progress-step"),
    telefone: document.querySelector('input[name="whatsapp"]'),
    dataUnica: document.getElementById("dataUnica"),
    dataIntervalo: document.getElementById("dataIntervalo"),
    datasUnicas: document.getElementById("datasUnicas"),
    datasIntervalo: document.getElementById("datasIntervalo"),
  };

  // Funções auxiliares
  const funcoes = {
    validarCampo(input) {
      if (input.validity.valid) {
        input.classList.remove("invalid");
        input.classList.add("valid");
      } else {
        input.classList.remove("valid");
        input.classList.add("invalid");
      }
    },

    aplicarMascaraTelefone(event) {
      let telefone = event.target.value.replace(/\D+/g, "");
      if (telefone.length > 11) telefone = telefone.slice(0, 11);

      if (telefone.length > 10) {
        telefone = telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
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
    },

    formatarData(input) {
      const data = new Date(input.value);
      const hoje = new Date();
      input.classList.remove("data-passada", "data-hoje");
      if (data < hoje) {
        input.classList.add("data-passada");
      } else if (data.toDateString() === hoje.toDateString()) {
        input.classList.add("data-hoje");
      }
    },

    updateAviso() {
      const showAviso =
        elementos.divulgaLogo.value === "Não" &&
        elementos.producao.value === "Sim";
      elementos.avisoMarketing.style.display = showAviso ? "block" : "none";
    },

    updateCidadeOutras() {
      const display = elementos.joinville.value === "Não";
      elementos.cidadeOutras.style.display = display ? "block" : "none";
      elementos.cidadeOutras.querySelector("input").required = display;
    },

    updateImpulsionamento() {
      const display = elementos.impulsionar.value === "Sim";
      elementos.impulsionamento.style.display = display ? "block" : "none";
      funcoes.checkAvisoImpulsionamento();
    },

    updatePresencial() {
      const valor = elementos.presencial.value;
      elementos.outroLugar.style.display = valor === "Outro" ? "block" : "none";
      elementos.eventoContainer.style.display = valor ? "block" : "none";
    },

    updateDatas() {
      const display = elementos.temDataDefinida.value === "Sim";
      
      // Resetar toda a exibição
      elementos.datasContainer.style.display = "none";
      elementos.dataUnica.style.display = "none";
      elementos.dataIntervalo.style.display = "none";

      if (display) {
        elementos.datasContainer.style.display = "block";
        const tipoData = document.querySelector('input[name="tipoData"]:checked');
        if (tipoData) {
          if (tipoData.value === "unico") {
            elementos.dataUnica.style.display = "block";
          } else {
            elementos.dataIntervalo.style.display = "block";
          }
        }
      }
      
      // Limpar campos quando não estiverem visíveis
      if (!display) {
        document.querySelectorAll('input[type="date"]').forEach(input => input.value = "");
      }
      funcoes.checkAvisoImpulsionamento();
    },

    updateHorarios() {
      const display = elementos.temHorarioDefinido.value === "Sim";
      elementos.horariosContainer.style.display = display ? "block" : "none";
    },

    toggleNomeEmpresa() {
      const display = elementos.divulgaLogo.value === "Sim";
      elementos.nomeEmpresaContainer.style.display = display ? "block" : "none";
      elementos.nomeEmpresaContainer.querySelector("input").required = display;
    },

    toggleAvisoLogo() {
      const display = elementos.divulgaLogo.value === "Sim";
      document.getElementById("avisoLogo").style.display = display
        ? "block"
        : "none";
    },

    checkAvisoImpulsionamento() {
      if (elementos.impulsionar.value !== "Sim") return;

      const hoje = new Date();
      const limite = new Date(hoje);
      limite.setDate(hoje.getDate() + 3);

      let dentroDoPrazo = false;

      if (elementos.temDataDefinida.value === "Sim") {
        const tipoData = document.querySelector(
          'input[name="tipoData"]:checked'
        ).value;

        if (tipoData === "unico") {
          document
            .querySelectorAll('input[name="datas[]"]')
            .forEach((input) => {
              const data = new Date(input.value);
              if (data <= limite) dentroDoPrazo = true;
            });
        } else {
          const inicio = new Date(
            document.querySelector('input[name="dataInicio"]').value
          );
          const fim = new Date(
            document.querySelector('input[name="dataFim"]').value
          );
          if (inicio <= limite || fim <= limite) dentroDoPrazo = true;
        }
      }

      elementos.avisoImpulsionamento.style.display = dentroDoPrazo
        ? "block"
        : "none";
    },

    // Exibe mensagens motivacionais em cada etapa do preenchimento
    // Isso reforça a sensação de progresso e engaja mais o analista durante o processo
    mensagemEtapa(etapa) {
      const mensagens = [
        "🚀 Vamos começar! Essa vaga vai ser um sucesso!",
        "✨ Agora só precisamos das datas e horários.",
        "📣 Quase lá! Vamos garantir mais visibilidade para sua vaga.",
      ];
      Swal.fire({
        title: "Etapa atual",
        text: mensagens[etapa],
        toast: true,
        timer: 3000,
        showConfirmButton: false,
        position: "top-end",
        icon: "info",
      });
    },

    // Atualiza visualmente a barra de progresso e mostra a mensagem correspondente à etapa
    // Também exibe uma mensagem final quando todas as etapas forem preenchidas
    updateProgress(step) {
      elementos.progressSteps.forEach((stepElement, index) => {
        stepElement.classList.toggle("active", index < step);
      });
      this.mensagemEtapa(step);
      if (step === elementos.progressSteps.length) {
        document.getElementById("finalMessage").style.display = "block";
      }
    },

    // Leva o usuário diretamente ao primeiro campo inválido do formulário
    // Facilita a correção de erros sem que a pessoa precise procurar manualmente
    validarTodosCampos() {
      const primeiroInvalido = document.querySelector(":invalid");
      if (primeiroInvalido) {
        primeiroInvalido.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        primeiroInvalido.focus();
      }
    },

    async confirmarEnvio() {
      const result = await Swal.fire({
        title: "Confirmar envio?",
        text: "Verifique se todos os dados estão corretos",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sim, enviar",
        cancelButtonText: "Revisar dados",
      });

      return result.isConfirmed;
    },

    async salvarPDF() {
      const confirmado = await this.confirmarEnvio();
      if (confirmado) {
        html2pdf()
          .from(document.getElementById("vagaForm"))
          .save()
          .then(() => {
            // Mostra uma mensagem de sucesso após o formulário ser salvo como PDF
            // Isso gera um feedback positivo, reforçando a sensação de tarefa concluída com êxito
            Swal.fire({
              icon: "success",
              title: "Vaga salva com sucesso!",
              text: "Obrigado por preencher. Vamos divulgar essa oportunidade com excelência!",
              confirmButtonText: "Fechar",
            });
          });
      } else {
        // Caso o envio seja cancelado, direciona o usuário para o campo com erro
        // Reduz a frustração ao ajudar na correção de forma imediata
        this.validarTodosCampos();
      }
    },

    async previewPDF() {
      const element = document.getElementById("vagaForm");
      const pdf = await html2pdf().from(element).output("datauristring");

      Swal.fire({
        title: "Preview do PDF",
        html: `<iframe src="${pdf}" width="100%" height="500px"></iframe>`,
        width: "80%",
        confirmButtonText: "Salvar PDF",
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          html2pdf().from(element).save();
        }
      });
    },

    filtrarBairros() {
      const searchInput = document
        .getElementById("bairroSearch")
        .value.toLowerCase();
      const options = document.querySelectorAll(".bairros-list select option");
      options.forEach((option) => {
        const text = option.textContent.toLowerCase();
        option.style.display = text.includes(searchInput) ? "" : "none";
      });
    },
  };

  // Event Listeners
  document.querySelectorAll("input, select, textarea").forEach((input) => {
    input.addEventListener("input", () => funcoes.validarCampo(input));
  });

  document
    .querySelector('input[name="orcamento"]')
    .addEventListener("input", funcoes.aplicarMascaraValor);

  elementos.telefone.addEventListener("input", funcoes.aplicarMascaraTelefone);

  elementos.divulgaLogo.addEventListener("change", () => {
    funcoes.updateAviso();
    funcoes.toggleNomeEmpresa();
    funcoes.toggleAvisoLogo();
  });
  elementos.producao.addEventListener("change", funcoes.updateAviso);
  elementos.joinville.addEventListener("change", () => {
    funcoes.updateCidadeOutras();
    funcoes.updateImpulsionamento();
  });
  elementos.impulsionar.addEventListener(
    "change",
    funcoes.updateImpulsionamento
  );
  elementos.presencial.addEventListener("change", funcoes.updatePresencial);
  elementos.temDataDefinida.addEventListener("change", function () {
    funcoes.updateDatas();
  });
  elementos.temHorarioDefinido.addEventListener("change", function () {
    const display = this.value === "Sim";
    elementos.horariosContainer.style.display = display ? "block" : "none";
  });

  // Inicializar radio buttons
  document.querySelectorAll('input[name="tipoData"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      const isUnico = radio.value === "unico";
      document.getElementById("datasUnicas").style.display = isUnico
        ? "block"
        : "none";
      document.getElementById("dataIntervalo").style.display = isUnico
        ? "none"
        : "block";
    });
  });

  document.querySelectorAll('input[name="tipoHorario"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      const isUnico = radio.value === "unico";
      document.getElementById("horarioUnico").style.display = isUnico ? "block" : "none";
      document.getElementById("horarioIntervalo").style.display = isUnico ? "none" : "block";
    });
  });

  // Funções de manipulação de campos dinâmicos
  window.adicionarData = function () {
    const container = document.createElement("div");
    container.className = "campo-data";
    container.innerHTML = `
      <label>Data:</label>
      <input type="date" name="datas[]" required min="${hoje}" />
      <span class="remove-btn" onclick="removerData(this)">&times;</span>
    `;
    document
      .getElementById("dataUnica")
      .insertBefore(
        container,
        document.getElementById("dataUnica").querySelector("button")
      );
    // Aplica foco automático no novo campo de data adicionado
    // Isso evita que o usuário tenha que clicar manualmente e torna o preenchimento mais fluido
    container.querySelector('input[type="date"]').focus(); // foco automático
    verificarDataImpulsionamento();
  };

  window.removerData = function (elemento) {
    const campos = document.querySelectorAll(".campo-data");
    if (campos.length > 1) {
      elemento.closest(".campo-data").remove();
    }
    verificarDataImpulsionamento();
  };

  window.adicionarHorario = function () {
    const container = document.createElement("div");
    container.className = "campo-horario";
    container.innerHTML = `
      <label>Horário:</label>
      <input type="time" name="horarios[]" required>
      <span class="remove-btn" onclick="removerHorario(this)">&times;</span>
    `;
    document.getElementById("horarioUnico").insertBefore(
      container,
      document.getElementById("horarioUnico").querySelector("button")
    );
    container.querySelector('input[type="time"]').focus();
  };

  window.removerHorario = function (elemento) {
    const campos = document.querySelectorAll(".campo-horario");
    if (campos.length > 1) {
      elemento.closest(".campo-horario").remove();
    }
  };

  window.adicionarCampo = function (tipo) {
    const hoje = new Date().toISOString().split("T")[0];
    const container = document.createElement("div");
    container.className = "campo-container";

    if (tipo === "data") {
      container.innerHTML = `
        <label>Data:</label>
        <input type="date" name="datas[]" required min="${hoje}">
        <span onclick="removerCampo(this)">&times;</span>
      `;
      document.getElementById("datasContainer").appendChild(container);
    }
  };

  window.adicionarIntervalo = function () {
    const container = document.createElement("div");
    container.className = "campo-intervalo";
    container.innerHTML = `
      <label>De</label>
      <input type="date" name="dataInicio[]" required min="${hoje}" />
      <label>até</label>
      <input type="date" name="dataFim[]" required min="${hoje}" />
      <span class="remove-btn" onclick="removerIntervalo(this)">&times;</span>
    `;

    const button = document.querySelector("#dataIntervalo button");
    document.getElementById("dataIntervalo").insertBefore(container, button);
    verificarDataImpulsionamento();
  };

  window.removerIntervalo = function (elemento) {
    const intervalos = document.querySelectorAll(
      "#dataIntervalo .campo-intervalo"
    );
    if (intervalos.length > 1) {
      elemento.closest(".campo-intervalo").remove();
    }
    verificarDataImpulsionamento();
  };

  function verificarDataImpulsionamento() {
    if (elementos.impulsionar.value !== "Sim") return;

    const hoje = new Date();
    const quatroDias = new Date(hoje);
    quatroDias.setDate(hoje.getDate() + 4); // Alterado de 3 para 4 dias

    let temDataRecente = false;

    if (
      document.querySelector('input[name="tipoData"]:checked').value === "unico"
    ) {
      document.querySelectorAll('input[name="datas[]"]').forEach((input) => {
        const data = new Date(input.value);
        if (data < quatroDias) temDataRecente = true;
      });
    } else {
      document
        .querySelectorAll('input[name="dataInicio[]"]')
        .forEach((input) => {
          const dataInicio = new Date(input.value);
          if (dataInicio < quatroDias) temDataRecente = true;
        });
    }

    elementos.avisoImpulsionamento.style.display = temDataRecente
      ? "block"
      : "none";
  }

  // Função para salvar PDF
  window.salvarPDF = async function () {
    const formulario = document.getElementById("vagaForm");
    const camposInvalidos = formulario.querySelectorAll(":invalid");

    if (camposInvalidos.length > 0) {
      // Exibir mensagem de erro e focar no primeiro campo inválido
      const errorContainer = document.getElementById("errorMessages");
      const errorList = errorContainer.querySelector("ul");
      errorList.innerHTML = Array.from(camposInvalidos)
        .map((campo) => `<li>Campo obrigatório: ${campo.name || "não preenchido"}</li>`)
        .join("");
      errorContainer.style.display = "block";

      camposInvalidos[0].scrollIntoView({ behavior: "smooth", block: "center" });
      camposInvalidos[0].focus();
      return;
    }

    // Se não houver campos inválidos, confirmar envio
    const confirmado = await funcoes.confirmarEnvio();
    if (confirmado) {
      html2pdf()
        .from(formulario)
        .save()
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Vaga salva com sucesso!",
            text: "Obrigado por preencher. Vamos divulgar essa oportunidade com excelência!",
            confirmButtonText: "Fechar",
          });
        });
    }
  };

  // Função para preview do PDF
  window.previewPDF = funcoes.previewPDF;

  // Atualizar progresso ao mudar de seção
  document.getElementById("vagaForm").addEventListener("change", function () {
    const step = elementos.temDataDefinida.value === "Sim" ? 2 : 1;
    funcoes.updateProgress(step);
  });

  // Event Listener para busca de bairros
  document
    .getElementById("bairroSearch")
    .addEventListener("input", funcoes.filtrarBairros);

  elementos.temDataDefinida.addEventListener("change", function () {
    const mostraDataDefinida = this.value === "Sim";
    elementos.dataUnica.style.display = mostraDataDefinida ? "block" : "none";
    elementos.dataIntervalo.style.display = "none";
    verificarDataImpulsionamento();
  });

  elementos.joinville.addEventListener("change", function () {
    const ehJoinville = this.value === "Sim";
    document.querySelector(
      'input[name="outraCidade"]'
    ).parentElement.style.display = ehJoinville ? "none" : "block";
    document.querySelector(".bairros-container").style.display = ehJoinville
      ? "block"
      : "none";
    document.querySelector(
      'input[name="outrosBairros"]'
    ).parentElement.style.display = ehJoinville ? "none" : "block";
  });

  elementos.impulsionar.addEventListener("change", function () {
    const sessao2 = document.querySelector(".sessao-2");
    const btnContinuar = document.getElementById("btnContinuar");
    const btnSalvar = document.getElementById("btnSalvar");

    if (this.value === "Sim") {
      sessao2.style.display = "block";
      btnContinuar.style.display = "block";
      btnSalvar.style.display = "none";

      document.querySelector('input[name="idadeMinima"]').required = true;
      document.querySelector('input[name="idadeMaxima"]').required = true;
      document.querySelector('input[name="dias"]').required = true;
      document.querySelector('input[name="orcamento"]').required = true;
    } else {
      sessao2.style.display = "none";
      btnContinuar.style.display = "none";
      btnSalvar.style.display = "block";

      document.querySelector('input[name="idadeMinima"]').required = false;
      document.querySelector('input[name="idadeMaxima"]').required = false;
      document.querySelector('input[name="dias"]').required = false;
      document.querySelector('input[name="orcamento"]').required = false;
    }

    verificarDataImpulsionamento();
  });

  elementos.impulsionar.addEventListener("change", function () {
    const btnContinuar = document.getElementById("btnContinuar");
    const btnFinalizar = document.getElementById("btnFinalizar");

    if (this.value === "Sim") {
      btnContinuar.style.display = "block";
      btnFinalizar.style.display = "none";
    } else {
      btnContinuar.style.display = "none";
      btnFinalizar.style.display = "block";
    }
  });

  // Validação da idade
  document
    .querySelector('input[name="idadeMaxima"]')
    .addEventListener("change", function () {
      const idadeMin = parseInt(
        document.querySelector('input[name="idadeMinima"]').value
      );
      const idadeMax = parseInt(this.value);

      if (idadeMax < idadeMin) {
        this.value = idadeMin;
      }
    });

  // Configuração inicial
  document.querySelector('select[name="evento"]').value = "Não";

  function validarCamposCondicionais() {
    const erros = [];

    // Campos sempre obrigatórios
    const camposObrigatorios = {
      'analista': 'Nome do analista',
      'whatsapp': 'WhatsApp',
      'divulgaLogo': 'Pode divulgar logo',
      'producao': 'É produção',
      'cargo': 'Nome do cargo',
      'vagas': 'Quantas vagas',
      'joinville': 'É para Joinville',
      'impulsionar': 'É para impulsionar'
    };

    // Validar campos sempre obrigatórios
    Object.entries(camposObrigatorios).forEach(([campo, label]) => {
      const elemento = document.querySelector(`[name="${campo}"], #${campo}`);
      if (!elemento || !elemento.value.trim()) {
        erros.push(`${label} é obrigatório`);
        if (elemento) elemento.classList.add('invalid');
      }
    });

    // Validação condicional: Logo e Nome da Empresa
    if (elementos.divulgaLogo.value === "Sim") {
      const empresa = document.querySelector('input[name="empresa"]');
      if (!empresa.value.trim()) {
        erros.push("Nome da empresa é obrigatório quando logo pode ser divulgada");
        empresa.classList.add('invalid');
      }
    }

    // Validação condicional: Data Definida
    if (elementos.temDataDefinida.value === "Sim") {
      const tipoData = document.querySelector('input[name="tipoData"]:checked');
      if (tipoData.value === "unico") {
        const datas = document.querySelectorAll('input[name="datas[]"]');
        if (!Array.from(datas).some(d => d.value)) {
          erros.push("Pelo menos uma data é obrigatória");
          datas.forEach(d => d.classList.add('invalid'));
        }
      } else {
        const dataInicio = document.querySelector('input[name="dataInicio[]"]');
        const dataFim = document.querySelector('input[name="dataFim[]"]');
        if (!dataInicio.value || !dataFim.value) {
          erros.push("Início e fim do intervalo de datas são obrigatórios");
          if (!dataInicio.value) dataInicio.classList.add('invalid');
          if (!dataFim.value) dataFim.classList.add('invalid');
        }
      }
    }

    // Validação condicional: Horário Definido
    if (elementos.temHorarioDefinido.value === "Sim") {
      const tipoHorario = document.querySelector('input[name="tipoHorario"]:checked');
      if (tipoHorario.value === "unico") {
        const horarios = document.querySelectorAll('input[name="horarios[]"]');
        if (!Array.from(horarios).some(h => h.value)) {
          erros.push("Pelo menos um horário é obrigatório");
          horarios.forEach(h => h.classList.add('invalid'));
        }
      } else {
        const horaInicio = document.querySelector('input[name="horaInicio"]');
        const horaFim = document.querySelector('input[name="horaFim"]');
        if (!horaInicio.value || !horaFim.value) {
          erros.push("Início e fim do intervalo de horários são obrigatórios");
          if (!horaInicio.value) horaInicio.classList.add('invalid');
          if (!horaFim.value) horaFim.classList.add('invalid');
        }
      }
    }

    // Validação condicional: Cidade e Bairros
    if (elementos.joinville.value === "Não") {
      const outraCidade = document.querySelector('input[name="outraCidade"]');
      const outrosBairros = document.querySelector('input[name="outrosBairros"]');
      
      if (!outraCidade.value.trim()) {
        erros.push("Nome da cidade é obrigatório quando não for Joinville");
        outraCidade.classList.add('invalid');
      }
      
      if (!outrosBairros.value.trim()) {
        erros.push("Bairros são obrigatórios quando não for Joinville");
        outrosBairros.classList.add('invalid');
      }
    } else if (elementos.joinville.value === "Sim") {
      const bairrosJoinville = document.querySelector('select[name="bairros"]');
      if (!bairrosJoinville.value || bairrosJoinville.selectedOptions.length === 0) {
        erros.push("Selecione os bairros de Joinville");
        bairrosJoinville.classList.add('invalid');
      }
    }

    return erros;
  }

  function exibirErrosValidacao(erros) {
    const errorContainer = document.getElementById("errorMessages");
    if (erros.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Campos Obrigatórios',
        html: `
          <div class="error-list">
            <p>Por favor, preencha os seguintes campos:</p>
            ${erros.map(erro => `<p>• ${erro}</p>`).join('')}
          </div>
        `,
        confirmButtonText: 'OK',
        customClass: {
          container: 'swal-custom'
        }
      });

      const primeiroInvalido = document.querySelector('.invalid');
      if (primeiroInvalido) {
        primeiroInvalido.scrollIntoView({ behavior: "smooth", block: "center" });
        primeiroInvalido.focus();
      }
      
      return false;
    }
    return true;
  }

  // Atualizar funções de navegação e salvamento
  window.validarSessao = function(sessaoAtual) {
    const erros = validarCamposCondicionais();
    if (!exibirErrosValidacao(erros)) return;
    
    const sessao = document.getElementById(`sessao${sessaoAtual}`);
    const proximaSessao = document.getElementById(`sessao${sessaoAtual + 1}`);
    sessao.style.display = "none";
    proximaSessao.style.display = "block";
    proximaSessao.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  window.salvarPDF = async function() {
    const erros = validarCamposCondicionais();
    if (!exibirErrosValidacao(erros)) return;
    
    const confirmado = await funcoes.confirmarEnvio();
    if (confirmado) {
      html2pdf()
        .from(document.getElementById("vagaForm"))
        .save()
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Vaga salva com sucesso!",
            text: "Obrigado por preencher. Vamos divulgar essa oportunidade com excelência!",
            confirmButtonText: "Fechar"
          });
        });
    }
  };

  window.voltarSessao = function (sessao) {
    document.getElementById(`sessao${sessao + 1}`).style.display = "none";
    document.getElementById(`sessao${sessao}`).style.display = "block";
  };

  // Adicionar chamada inicial para garantir estado correto
  document.addEventListener("DOMContentLoaded", function() {
    // Inicializar estado dos campos de data
    funcoes.updateDatas();
  });

  elementos.temDataDefinida.addEventListener("change", function() {
    // Forçar validação imediata
    funcoes.updateDatas();
    
    // Resetar seleção de tipo de data
    if (this.value !== "Sim") {
      document.querySelectorAll('input[name="tipoData"]').forEach(radio => {
        radio.checked = false;
      });
    } else {
      document.querySelector('input[name="tipoData"][value="unico"]').checked = true;
    }
  });

  // Inicialização
  document.addEventListener("DOMContentLoaded", function() {
    // Garantir estado inicial correto
    elementos.temDataDefinida.value = "";
    funcoes.updateDatas();
    funcoes.updateHorarios();
  });
});
