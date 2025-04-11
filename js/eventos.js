import { elementos } from './elementos.js';
import { validacao } from './validacao.js';
import { mascaras } from './mascaras.js';

export const eventos = {
  init() {
    this.bindUIEvents();
    this.bindDynamicFields();
    this.bindValidationEvents();
    this.bindImpulsionamentoEvents();
    this.bindDateHandlers();
    this.bindSearchBairros();
  },

  bindUIEvents() {
    // Toggle elementos condicionais
    elementos.divulgaLogo.addEventListener('change', (e) => {
      elementos.nomeEmpresaContainer.style.display = 
        e.target.value === 'Sim' ? 'block' : 'none';
      validacao.validarCampo(elementos.nomeEmpresaContainer.querySelector('input'));
    });

    elementos.joinville.addEventListener('change', (e) => {
      elementos.cidadeOutras.style.display = 
        e.target.value === 'Não' ? 'block' : 'none';
      validacao.validarCamposCondicionais();
    });

    elementos.impulsionar.addEventListener('change', this.handleImpulsionamentoChange.bind(this));
    elementos.presencial.addEventListener('change', this.handlePresencialChange.bind(this));
  },

  bindDynamicFields() {
    // Campos dinâmicos para datas e horários
    window.adicionarData = this.adicionarData.bind(this);
    window.removerData = this.removerData.bind(this);
    window.adicionarHorario = this.adicionarHorario.bind(this);
    window.removerHorario = this.removerHorario.bind(this);
    window.adicionarIntervalo = this.adicionarIntervalo.bind(this);
    window.removerIntervalo = this.removerIntervalo.bind(this);
  },

  bindValidationEvents() {
    // Validações em tempo real
    document.querySelectorAll('input, select, textarea').forEach(input => {
      input.addEventListener('input', () => validacao.validarCampo(input));
    });

    // Máscaras de input
    elementos.telefone.addEventListener('input', mascaras.aplicarMascaraTelefone);
    elementos.orcamento.addEventListener('input', mascaras.aplicarMascaraValor);
    
    // Validação de idade
    elementos.idadeMaxima.addEventListener('change', () => {
      if (parseInt(elementos.idadeMaxima.value) < parseInt(elementos.idadeMinima.value)) {
        elementos.idadeMaxima.value = elementos.idadeMinima.value;
      }
      validacao.validarCampo(elementos.idadeMaxima);
    });
  },

  bindImpulsionamentoEvents() {
    elementos.impulsionar.addEventListener('change', async (e) => {
      const sessao2 = document.querySelector('.sessao-2');
      
      if (e.target.value === 'Sim') {
        if (validacao.validarCamposBasicos()) {
          sessao2.classList.add('visible');
          this.habilitarCamposSessao2(true);
        } else {
          e.target.value = 'Não';
        }
      } else {
        if (await this.confirmarLimparSessao2()) {
          this.limparSessao2();
          sessao2.classList.remove('visible');
          this.habilitarCamposSessao2(false);
        } else {
          e.target.value = 'Sim';
        }
      }
    });
  },

  bindDateHandlers() {
    elementos.temDataDefinida.addEventListener('change', (e) => {
      const display = e.target.value === 'Sim';
      elementos.datasContainer.style.display = display ? 'block' : 'none';
      
      if (!display) {
        document.querySelectorAll('input[type="date"]').forEach(input => {
          input.value = '';
        });
      }
      
      this.verificarDataImpulsionamento();
    });

    document.querySelectorAll('input[name="tipoData"]').forEach(radio => {
      radio.addEventListener('change', () => {
        const isUnico = radio.value === 'unico';
        elementos.dataUnica.style.display = isUnico ? 'block' : 'none';
        elementos.dataIntervalo.style.display = isUnico ? 'none' : 'block';
      });
    });
  },

  bindSearchBairros() {
    document.getElementById('bairroSearch').addEventListener('input', (e) => {
      const termo = e.target.value.toLowerCase();
      
      Array.from(elementos.bairrosSelect.querySelectorAll('option, optgroup')).forEach(element => {
        if (element.tagName === 'OPTGROUP') {
          const optgroup = element;
          const options = Array.from(optgroup.getElementsByTagName('option'));
          const hasVisibleOption = options.some(opt => 
            opt.textContent.toLowerCase().includes(termo)
          );
          optgroup.style.display = hasVisibleOption ? '' : 'none';
          
          options.forEach(option => {
            option.style.display = option.textContent.toLowerCase().includes(termo) ? '' : 'none';
          });
        } else {
          element.style.display = element.textContent.toLowerCase().includes(termo) ? '' : 'none';
        }
      });
    });
  },

  // Helpers e utilitários
  async confirmarLimparSessao2() {
    return await Swal.fire({
      title: 'Atenção',
      text: 'Ao desativar o impulsionamento, os dados da Sessão 2 serão perdidos. Deseja continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, limpar dados',
      cancelButtonText: 'Não, manter dados'
    }).then(result => result.isConfirmed);
  },

  limparSessao2() {
    ['idadeMinima', 'idadeMaxima', 'dias', 'orcamento'].forEach(campo => {
      const input = document.querySelector(`input[name="${campo}"]`);
      input.value = campo === 'orcamento' ? 'R$0,00' : '';
      input.required = false;
      input.classList.remove('invalid', 'valid');
    });
    
    elementos.generoSelect.value = 'Ambos';
    elementos.generoSelect.classList.remove('invalid', 'valid');
    
    elementos.bairrosSelect.selectedIndex = -1;
    elementos.bairrosSelect.classList.remove('invalid', 'valid');
  },

  verificarDataImpulsionamento() {
    if (elementos.impulsionar.value !== "Sim") {
      elementos.avisoImpulsionamento.style.display = "none";
      return;
    }

    const hoje = new Date();
    const limite = new Date(hoje);
    limite.setDate(hoje.getDate() + 4);
    
    let temDataRecente = false;
    
    if (elementos.temDataDefinida.value === "Sim") {
      const tipoData = document.querySelector('input[name="tipoData"]:checked')?.value;
      
      if (tipoData === "unico") {
        document.querySelectorAll('input[name="datas[]"]').forEach(input => {
          const data = new Date(input.value);
          if (data <= limite) temDataRecente = true;
        });
      } else if (tipoData === "intervalo") {
        const dataInicio = new Date(document.querySelector('input[name="dataInicio[]"]')?.value);
        if (dataInicio <= limite) temDataRecente = true;
      }
    }
    
    elementos.avisoImpulsionamento.style.display = temDataRecente ? "block" : "none";
  }
};

// Inicialização automática
document.addEventListener('DOMContentLoaded', () => eventos.init());
