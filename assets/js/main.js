/**
 * ============================================================
 * JUSTLY ADVOCACIA — SCRIPT PRINCIPAL
 *
 * Módulos:
 *   1. Utilitários           — atalhos de seleção DOM
 *   2. Header Scroll         — classe .scrolled no header
 *   3. Nav Ativo             — detecta página atual e âncoras
 *   4. Menu Mobile           — painel lateral + overlay
 *   5. Scroll Reveal         — IntersectionObserver fadeUp
 *   6. Scroll To Top         — botão flutuante
 *   7. Formulário de Contato — validação + feedback visual
 *   8. Modal de Advogados    — perfil dinâmico (sobre-nos.html)
 *   9. Ano do Footer         — atualização automática
 *
 * Sem dependências externas · ES6+ · IIFE encapsulada
 * ============================================================
 */

(() => {
  'use strict';

  /* ─────────────────────────────────────────────────────────
     MÓDULO 1 — UTILITÁRIOS
  ───────────────────────────────────────────────────────── */

  /** Atalho para querySelector */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);

  /** Atalho para querySelectorAll — retorna Array */
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /**
   * Detecta se a página atual corresponde ao nome informado.
   * Compara o pathname da URL com o nome do arquivo.
   * @param {string} pageName — ex.: 'index', 'sobre-nos'
   * @returns {boolean}
   */
  const isPage = (pageName) => {
    const path = window.location.pathname;
    // Trata tanto /index.html quanto / (raiz) como "index"
    if (pageName === 'index') {
      return path.endsWith('index.html') || path.endsWith('/') || path === '';
    }
    return path.includes(pageName);
  };


  /* ─────────────────────────────────────────────────────────
     MÓDULO 2 — HEADER COM EFEITO DE SCROLL
     Adiciona .scrolled ao header quando scrollY > 60px,
     tornando o fundo mais opaco e exibindo sombra.
  ───────────────────────────────────────────────────────── */
  const initHeader = () => {
    const header = $('#site-header');
    if (!header) return;

    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    };

    // passive: true melhora performance do scroll listener
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Define estado inicial ao carregar a página
  };


  /* ─────────────────────────────────────────────────────────
     MÓDULO 3 — LINK ATIVO NA NAVEGAÇÃO
     Duas estratégias:
     a) Para a página atual: marca o link com aria-current e .active
     b) Para âncoras na mesma página: atualiza conforme o scroll
  ───────────────────────────────────────────────────────── */
  const initActiveNavLink = () => {
    const navLinks = $$('.nav-link');
    if (!navLinks.length) return;

    /**
     * a) Marca o link da página atual como ativo.
     *    Percorre todos os links e verifica se o href
     *    corresponde à URL atual (sem âncora).
     */
    const markCurrentPage = () => {
      navLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        // Extrai apenas o caminho sem a âncora (parte antes do #)
        const linkPath = href.split('#')[0];

        // Determina se este link aponta para a página atual
        const matchesPage =
          (isPage('index') && (linkPath === './index.html' || linkPath === '' || linkPath === './')) ||
          (isPage('sobre-nos') && linkPath.includes('sobre-nos'));

        // Se o link não tem âncora (link de página), marca como ativo
        if (matchesPage && !href.includes('#')) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        }
        // Se é o link "Início" e estamos no index, não marcar automaticamente
        // (será tratado pelo IntersectionObserver das seções)
      });
    };

    markCurrentPage();

    /**
     * b) Atualiza link ativo conforme seção visível (apenas no index).
     *    Usa IntersectionObserver para detectar qual seção está visível.
     */
    if (!isPage('index')) return;

    const sections = $$('section[id]');
    if (!sections.length) return;

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          const id = entry.target.getAttribute('id');
          // Tenta encontrar link de âncora correspondente
          const activeLink = navLinks.find(l =>
            l.getAttribute('href') === `#${id}` ||
            l.getAttribute('href') === `./index.html#${id}`
          );

          if (activeLink) {
            // Remove active de todos os links de âncora
            navLinks.forEach(l => {
              if (l.getAttribute('href')?.includes('#')) {
                l.classList.remove('active');
                l.removeAttribute('aria-current');
              }
            });
            activeLink.classList.add('active');
          }
        });
      },
      {
        // Considera seção ativa quando ocupa pelo menos 30% da viewport
        threshold: 0.3,
        rootMargin: '-80px 0px 0px 0px', // Compensa altura do header fixo
      }
    );

    sections.forEach(section => sectionObserver.observe(section));
  };


  /* ─────────────────────────────────────────────────────────
     MÓDULO 4 — MENU MOBILE
     Painel lateral deslizante com overlay.
     Controla: abertura, fechamento, overlay, Escape,
     clique em links, atributo aria-expanded.
  ───────────────────────────────────────────────────────── */
  const initMobileNav = () => {
    const navMenu    = $('#primary-nav');
    const navToggle  = $('#nav-toggle');
    const navClose   = $('#nav-close');
    const navOverlay = $('#nav-overlay');

    if (!navMenu || !navToggle) return;

    /** Abre o menu lateral */
    const openNav = () => {
      navMenu.classList.add('open');
      navOverlay?.classList.add('visible');
      navToggle.setAttribute('aria-expanded', 'true');
      // Bloqueia scroll do body enquanto o menu está aberto
      document.body.style.overflow = 'hidden';
    };

    /** Fecha o menu lateral */
    const closeNav = () => {
      navMenu.classList.remove('open');
      navOverlay?.classList.remove('visible');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    // Eventos de abertura / fechamento
    navToggle.addEventListener('click', openNav);
    navClose?.addEventListener('click', closeNav);
    navOverlay?.addEventListener('click', closeNav);

    // Fecha ao clicar em qualquer link dentro do menu
    $$('.nav-link').forEach(link => link.addEventListener('click', closeNav));

    // Fecha com a tecla Escape — acessibilidade por teclado
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        closeNav();
        navToggle.focus(); // Retorna foco ao botão de toggle
      }
    });
  };


  /* ─────────────────────────────────────────────────────────
     MÓDULO 5 — SCROLL REVEAL
     IntersectionObserver revela elementos [data-reveal]
     com animação fadeUp ao entrarem na viewport.
  ───────────────────────────────────────────────────────── */
  const initScrollReveal = () => {
    const revealEls = $$('[data-reveal]');
    if (!revealEls.length) return;

    // Fallback para browsers sem suporte ao IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      revealEls.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // unobserve: a animação acontece apenas uma vez
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealEls.forEach(el => observer.observe(el));
  };


  /* ─────────────────────────────────────────────────────────
     MÓDULO 6 — BOTÃO SCROLL TO TOP
     Exibe o botão após 400px de scroll e rola suavemente
     ao topo ao clicar.
  ───────────────────────────────────────────────────────── */
  const initScrollTopButton = () => {
    const btn = $('#scroll-top-btn');
    if (!btn) return;

    const onScroll = () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Estado inicial

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };


  /* ─────────────────────────────────────────────────────────
     MÓDULO 7 — FORMULÁRIO DE CONTATO
     Valida campos obrigatórios, exibe erros inline
     e feedback de status (sucesso / erro).
  ───────────────────────────────────────────────────────── */
  const initContactForm = () => {
    const form     = $('#contact-form');
    const statusEl = $('#form-status');
    if (!form || !statusEl) return;

    /**
     * Valida um campo individualmente.
     * Retorna null se válido ou a mensagem de erro.
     * @param {HTMLInputElement|HTMLTextAreaElement} field
     * @returns {string|null}
     */
    const validateField = (field) => {
      const value = field.value.trim();

      if (field.required && !value) {
        return 'Este campo é obrigatório.';
      }

      if (field.type === 'email' && value) {
        // Regex simples de validação de e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return 'Por favor, insira um e-mail válido.';
        }
      }

      if (field.type === 'tel' && value) {
        // Aceita formatos brasileiros: (xx) xxxxx-xxxx ou similar
        const telRegex = /^[\d\s()\-+]{8,}$/;
        if (!telRegex.test(value)) {
          return 'Por favor, insira um telefone válido.';
        }
      }

      return null;
    };

    /**
     * Aplica ou remove estado de erro em um campo.
     * @param {HTMLElement} field
     * @param {string|null} errorMsg — null para remover erro
     */
    const setFieldError = (field, errorMsg) => {
      // Remove mensagem de erro anterior
      const existingError = field.parentElement.querySelector('.field-error');
      if (existingError) existingError.remove();

      if (errorMsg) {
        field.classList.add('is-invalid');
        // Cria elemento de erro acessível
        const errorEl = document.createElement('span');
        errorEl.className = 'field-error';
        errorEl.textContent = errorMsg;
        errorEl.style.cssText = 'display:block; font-size:0.75rem; color:#c87a7a; margin-top:4px;';
        errorEl.setAttribute('role', 'alert');
        field.parentElement.appendChild(errorEl);
      } else {
        field.classList.remove('is-invalid');
      }
    };

    /**
     * Exibe mensagem de status global do formulário.
     * @param {string} message
     * @param {'success'|'error'} type
     */
    const showStatus = (message, type) => {
      statusEl.textContent = message;
      statusEl.className = `form-status ${type}`;
    };

    /** Redefine o botão de envio ao estado original */
    const resetSubmitBtn = (btn, originalHTML) => {
      btn.disabled = false;
      btn.innerHTML = originalHTML;
    };

    // Validação em tempo real (ao sair do campo)
    $$('.form-input, .form-textarea', form).forEach(field => {
      field.addEventListener('blur', () => {
        const error = validateField(field);
        setFieldError(field, error);
      });

      // Remove erro ao digitar novamente
      field.addEventListener('input', () => {
        if (field.classList.contains('is-invalid')) {
          setFieldError(field, null);
        }
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn    = form.querySelector('[type="submit"]');
      const originalHTML = submitBtn.innerHTML;
      let hasErrors      = false;

      // Valida todos os campos antes de enviar
      $$('.form-input, .form-textarea', form).forEach(field => {
        const error = validateField(field);
        setFieldError(field, error);
        if (error) hasErrors = true;
      });

      // Interrompe se houver erros de validação
      if (hasErrors) {
        // Foca no primeiro campo inválido
        const firstInvalid = form.querySelector('.is-invalid');
        firstInvalid?.focus();
        return;
      }

      // Feedback visual de carregamento
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Enviando…';
      statusEl.className = 'form-status'; // Limpa status anterior

      try {
        /* ── Envio Real via EmailJS ────────────────────────────
           Descomente e configure com suas credenciais:

           await emailjs.sendForm(
             'SEU_SERVICE_ID',
             'SEU_TEMPLATE_ID',
             form,
             'SUA_PUBLIC_KEY'
           );
        ──────────────────────────────────────────────────────── */

        // Simulação de envio (remova ao usar envio real)
        await new Promise(resolve => setTimeout(resolve, 1400));

        showStatus('✓ Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
        form.reset();
        // Remove classes de erro residuais após reset
        $$('.form-input, .form-textarea', form).forEach(f => f.classList.remove('is-invalid'));

      } catch (error) {
        console.error('[Formulário] Erro ao enviar:', error);
        showStatus('✗ Ocorreu um erro ao enviar. Por favor, tente novamente.', 'error');

      } finally {
        resetSubmitBtn(submitBtn, originalHTML);
      }
    });
  };


  /* ─────────────────────────────────────────────────────────
     MÓDULO 8 — MODAL DE PERFIL DO ADVOGADO
     Exclusivo para sobre-nos.html.
     Usa <dialog> nativo do HTML5 para acessibilidade.
     Dados dos advogados são definidos neste módulo.
  ───────────────────────────────────────────────────────── */
  const initLawyerModal = () => {
    const modal       = $('#lawyer-modal');
    const modalBody   = $('#modal-body');
    const closeBtn    = $('#modal-close-btn');
    const backdrop    = $('#modal-backdrop');
    const lawyerCards = $$('[data-lawyer-id]');

    if (!modal || !lawyerCards.length) return;

    /**
     * Base de dados dos advogados.
     * Em produção, estes dados viriam de uma API ou CMS.
     * @type {Object.<string, {name, role, img, bio, specialties}>}
     */
    const lawyersData = {
      '1': {
        name: 'Dr. João Carlos Silva',
        role: 'Sócio Fundador',
        img:  './assets/img/adv1.jpg',
        bio:  'Fundador do escritório em 2008, Dr. João Carlos possui mais de 20 anos de experiência em Direito Empresarial e Sucessório. Formado pela USP, com pós-graduação pela FGV e MBA em Gestão Jurídica.',
        specialties: ['Direito Empresarial', 'Direito Sucessório', 'Holding Familiar'],
      },
      '2': {
        name: 'Dra. Maria Fernanda Costa',
        role: 'Sócia Sênior',
        img:  './assets/img/adv2.jpg',
        bio:  'Especialista em Direito de Família e Direito Imobiliário. Membro da Comissão de Direito de Família da OAB/SP. Reconhecida por sua abordagem humanizada e soluções eficazes.',
        specialties: ['Direito de Família', 'Direito Imobiliário', 'Mediação Familiar'],
      },
      '3': {
        name: 'Dr. Ricardo Almeida',
        role: 'Advogado Associado',
        img:  './assets/img/adv3.jpg',
        bio:  'Especialista em Direito Civil e Direito do Consumidor. Atua em casos de alta complexidade com excelente histórico de êxito em processos judiciais.',
        specialties: ['Direito Civil', 'Direito do Consumidor', 'Direito Contratual'],
      },
      '4': {
        name: 'Dra. Ana Paula Santos',
        role: 'Advogada Associada',
        img:  './assets/img/adv4.jpg',
        bio:  'Especialista em Direito Bancário e Financeiro. Ampla experiência em prevenção de fraudes e recuperação de crédito para pessoa física e jurídica.',
        specialties: ['Direito Bancário', 'Recuperação de Crédito', 'Direito Financeiro'],
      },
      '5': {
        name: 'Dr. Carlos Eduardo Martins',
        role: 'Advogado Associado',
        img:  './assets/img/adv5.jpg',
        bio:  'Especialista em Direito Tributário e Compliance. Assessoria estratégica a empresas de médio e grande porte no planejamento fiscal e regularização tributária.',
        specialties: ['Direito Tributário', 'Compliance', 'Planejamento Fiscal'],
      },
      '6': {
        name: 'Dra. Fernanda Lima',
        role: 'Advogada Associada',
        img:  './assets/img/adv6.jpg',
        bio:  'Especialista em Direito Trabalhista. Referência em mediação de conflitos entre empregadores e empregados, com foco em soluções extrajudiciais eficientes.',
        specialties: ['Direito Trabalhista', 'Mediação', 'Direito Previdenciário'],
      },
    };

    /**
     * Gera o HTML interno do modal com os dados do advogado.
     * @param {object} lawyer
     * @returns {string}
     */
    const buildModalContent = (lawyer) => {
      const tagsHTML = lawyer.specialties
        .map(s => `<span class="modal-tag">${s}</span>`)
        .join('');

      return `
        <img
          src="${lawyer.img}"
          alt="Foto de ${lawyer.name}"
          class="modal-avatar"
          loading="lazy"
          width="100" height="100"
        />
        <h2 class="modal-name" id="modal-lawyer-name">${lawyer.name}</h2>
        <p class="modal-role">${lawyer.role}</p>
        <p class="modal-bio">${lawyer.bio}</p>
        <div class="modal-specialties" aria-label="Especialidades">${tagsHTML}</div>
      `;
    };

    /** Abre o modal com os dados do advogado */
    const openModal = (lawyerId) => {
      const lawyer = lawyersData[lawyerId];
      if (!lawyer || !modalBody) return;

      modalBody.innerHTML = buildModalContent(lawyer);

      // showModal() usa o comportamento nativo do <dialog>
      // e gerencia o foco automaticamente
      modal.showModal?.() || modal.setAttribute('open', '');

      // Bloqueia scroll do body
      document.body.style.overflow = 'hidden';
    };

    /** Fecha o modal */
    const closeModal = () => {
      modal.close?.() || modal.removeAttribute('open');
      document.body.style.overflow = '';
      // Retorna foco para o card que abriu o modal
      lastFocusedCard?.focus();
    };

    let lastFocusedCard = null;

    // Delega eventos de clique nos botões "Ver Perfil" de cada card
    lawyerCards.forEach(card => {
      const ctaBtn = card.querySelector('.lawyer-card__cta');
      if (!ctaBtn) return;

      ctaBtn.addEventListener('click', () => {
        lastFocusedCard = ctaBtn;
        const lawyerId = card.dataset.lawyerId;
        openModal(lawyerId);
      });
    });

    // Fecha ao clicar no botão X ou no backdrop
    closeBtn?.addEventListener('click', closeModal);
    backdrop?.addEventListener('click', closeModal);

    // Fecha com Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.hasAttribute('open')) {
        closeModal();
      }
    });

    // Fecha ao clicar fora do painel (no backdrop nativo do dialog)
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  };


  /* ─────────────────────────────────────────────────────────
     MÓDULO 9 — ANO DINÂMICO NO FOOTER
     Atualiza o copyright automaticamente a cada virada de ano.
  ───────────────────────────────────────────────────────── */
  const initFooterYear = () => {
    const yearEl = $('#footer-year');
    if (yearEl) {
      const year = new Date().getFullYear();
      yearEl.textContent = year;
      // Atualiza também o atributo datetime para semântica correta
      yearEl.setAttribute('datetime', String(year));
    }
  };


  /* ─────────────────────────────────────────────────────────
     MÓDULO 10 — DARK / LIGHT MODE TOGGLE
     
     Estratégia:
     - O tema é definido via atributo data-theme no <html>
     - CSS Variables reagem automaticamente ao atributo
     - Preferência salva no localStorage com chave 'ferlopes-theme'
     - Detecta prefers-color-scheme na primeira visita
     - O botão exibe sol (dark→light) ou lua (light→dark)
     - aria-label do botão é atualizado dinamicamente
  ───────────────────────────────────────────────────────── */
  const initThemeToggle = () => {
    const btn = $('#theme-toggle');
    if (!btn) return;

    const STORAGE_KEY = 'ferlopes-theme';
    const html = document.documentElement;

    /**
     * Retorna o tema atual lendo o atributo do <html>.
     * @returns {'dark'|'light'}
     */
    const getTheme = () => html.getAttribute('data-theme') || 'dark';

    /**
     * Aplica o tema sem transição (evita flash no carregamento).
     * Para alternar com animação, use applyTheme().
     * @param {'dark'|'light'} theme
     * @param {boolean} [animate=true]
     */
    const applyTheme = (theme, animate = true) => {
      if (!animate) {
        // Desativa transições temporariamente para evitar flash
        html.classList.add('no-transition');
      }

      html.setAttribute('data-theme', theme);

      // Atualiza o aria-label e o title do botão conforme o tema ativo
      const nextTheme  = theme === 'dark' ? 'claro' : 'escuro';
      btn.setAttribute('aria-label', `Alternar para modo ${nextTheme}`);
      btn.setAttribute('title', `Ativar modo ${nextTheme}`);

      if (!animate) {
        // Força reflow para garantir que a classe seja removida após aplicar
        void html.offsetHeight;
        html.classList.remove('no-transition');
      }
    };

    /**
     * Alterna entre dark e light e persiste no localStorage.
     */
    const toggleTheme = () => {
      const next = getTheme() === 'dark' ? 'light' : 'dark';
      applyTheme(next, true); // Com animação suave
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (_) {
        // localStorage pode falhar em modo privado/incógnito; silencia o erro
      }
    };

    // Clique no botão: alterna o tema
    btn.addEventListener('click', toggleTheme);

    // Sincroniza o botão com o tema já aplicado (definido pelo script inline no <head>)
    applyTheme(getTheme(), false);

    /**
     * Reage às mudanças de preferência do sistema em tempo real.
     * Só atua se o usuário NÃO tiver uma preferência salva.
     */
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    mediaQuery.addEventListener('change', (e) => {
      const hasSaved = localStorage.getItem(STORAGE_KEY);
      if (!hasSaved) {
        applyTheme(e.matches ? 'light' : 'dark', true);
      }
    });
  };


  /* ─────────────────────────────────────────────────────────
     INICIALIZAÇÃO
     Executa todos os módulos após o DOM estar pronto.
     A ordem importa: header e nav devem iniciar antes
     de módulos dependentes de layout.
  ───────────────────────────────────────────────────────── */
  const init = () => {
    initHeader();
    initActiveNavLink(); // Antes do initMobileNav para estado correto
    initMobileNav();
    initScrollReveal();
    initScrollTopButton();
    initContactForm();
    initLawyerModal();   // Só age se os elementos existirem
    initFooterYear();
    initThemeToggle();   // Dark/Light mode — sempre por último
  };

  // Garante execução após carregamento completo do DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM já pronto (script com defer ou posicionado no final do body)
    init();
  }

})();
