import { elementos } from './elementos.js';
import { validacao } from './validacao.js';

export const impulsionamento = {
  async init() {
    this.bindEvents();
    this.checkInitialVisibility();
    this.initializeDefaultValues();
  },

  bindEvents() {
    elementos.impulsionar.addEventListener('change', async (e) => {
      if (e.target.value === 'Sim') {
        if (validacao.validarCamposBasicos()) {
          await this.handleImpulsionamentoAtivado();
        } else {
          e.target.value = 'Não';
        }
      } else {
        if (await this.confirmarDesativarImpulsionamento()) {
          this.desativarImpulsionamento();
        } else {
          e.target.value = 'Sim';
        }
      }
    });

    // Eventos de validação em tempo real
    ['idadeMinima', 'idadeMaxima', 'dias', 'orcamento'].forEach(campo => {
      elementos[campo].addEventListener('input', () => {
        validacao.validarCampo(elementos[campo]);
        this.validarIdades();
      });
    });

    // Eventos de busca de bairros
    elementos.bairrosSearch.addEventListener('input', (e) => {
      this.filtrarBairros(e.target.value.toLowerCase());
    });
  },

  checkInitialVisibility() {
    const sessao2 = document.querySelector('.sessao-2');
    sessao2.style.display = elementos.impulsionar.value === 'Sim' ? 'block' : 'none';
    this.updateAvisoImpulsionamento();
  },

  initializeDefaultValues() {
    elementos.idadeMinima.value = '18';
    elementos.idadeMaxima.value = '55';
    elementos.dias.value = '4';
    elementos.orcamento.value = 'R$50,00';
    elementos.generoSelect.value = 'Ambos';
  },

  async handleImpulsionamentoAtivado() {
    const sessao2 = document.querySelector('.sessao-2');
    sessao2.classList.add('visible');
    this.habilitarCamposImpulsionamento(true);
    elementos.btnContinuar.style.display = 'block';
    elementos.btnFinalizarPDF.style.display = 'none';
    this.updateAvisoImpulsionamento();
  },

  async confirmarDesativarImpulsionamento() {
    if (!this.temDadosPreenchidos()) return true;

    const result = await Swal.fire({
      title: 'Atenção',
      text: 'Ao desativar o impulsionamento, os dados desta seção serão perdidos. Deseja continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, limpar dados',
      cancelButtonText: 'Não, manter dados'
    });

    return result.isConfirmed;
  },

  desativarImpulsionamento() {
    const sessao2 = document.querySelector('.sessao-2');
    sessao2.classList.remove('visible');
    this.limparCampos();
    this.habilitarCamposImpulsionamento(false);
    elementos.btnContinuar.style.display = 'none';
    elementos.btnFinalizarPDF.style.display = 'block';
  },

  habilitarCamposImpulsionamento(habilitar) {
    ['idadeMinima', 'idadeMaxima', 'dias', 'orcamento', 'genero'].forEach(campo => {
      const elemento = elementos[campo];
      if (elemento) {
        elemento.required = habilitar;
        if (!habilitar) {
          elemento.classList.remove('invalid', 'valid');
        }
      }
    });
  },

  limparCampos() {
    ['idadeMinima', 'idadeMaxima', 'dias', 'orcamento'].forEach(campo => {
      const elemento = elementos[campo];
      elemento.value = campo === 'orcamento' ? 'R$0,00' : '';
      elemento.classList.remove('invalid', 'valid');
    });

    elementos.generoSelect.value = 'Ambos';
    elementos.bairrosSelect.selectedIndex = -1;
  },

  temDadosPreenchidos() {
    return ['idadeMinima', 'idadeMaxima', 'dias', 'orcamento'].some(campo => 
      elementos[campo].value.trim() !== ''
    ) || elementos.bairrosSelect.selectedOptions.length > 0;
  },

  validarIdades() {
    const min = parseInt(elementos.idadeMinima.value);
    const max = parseInt(elementos.idadeMaxima.value);

    if (max < min) {
      elementos.idadeMaxima.value = min;
      validacao.validarCampo(elementos.idadeMaxima);
    }
  },

  filtrarBairros(termo) {
    Array.from(elementos.bairrosSelect.querySelectorAll('option, optgroup'))
      .forEach(element => {
        if (element.tagName === 'OPTGROUP') {
          const options = Array.from(element.getElementsByTagName('option'));
          const hasVisible = options.some(opt => 
            opt.textContent.toLowerCase().includes(termo)
          );
          
          element.style.display = hasVisible ? '' : 'none';
          options.forEach(option => {
            option.style.display = option.textContent.toLowerCase().includes(termo) ? '' : 'none';
          });
        } else {
          element.style.display = element.textContent.toLowerCase().includes(termo) ? '' : 'none';
        }
      });
  },

  updateAvisoImpulsionamento() {
    if (elementos.impulsionar.value !== 'Sim' || elementos.temDataDefinida.value !== 'Sim') {
      elementos.avisoImpulsionamento.style.display = 'none';
      return;
    }

    const hoje = new Date();
    const limite = new Date(hoje.setDate(hoje.getDate() + 4));
    let temDataRecente = false;

    const tipoData = document.querySelector('input[name="tipoData"]:checked')?.value;
    if (tipoData === 'unico') {
      document.querySelectorAll('input[name="datas[]"]').forEach(input => {
        if (new Date(input.value) <= limite) temDataRecente = true;
      });
    } else if (tipoData === 'intervalo') {
      const dataInicio = document.querySelector('input[name="dataInicio[]"]')?.value;
      if (dataInicio && new Date(dataInicio) <= limite) temDataRecente = true;
    }

    elementos.avisoImpulsionamento.style.display = temDataRecente ? 'block' : 'none';
  }
};

// Inicialização automática
document.addEventListener('DOMContentLoaded', () => impulsionamento.init());
