# FerLopes Advocacia — Documentação do Projeto

> Site institucional do escritório **FerLopes Advocacia**, construído com HTML5 semântico, CSS3 moderno e JavaScript puro (ES6+). Sem frameworks, sem dependências de build — apenas código limpo, organizado e de alta performance.

![imagens ai galelia](https://raw.githubusercontent.com/Ivanctga/ferlopesadvocacia/refs/heads/main/Preview.png)

---

## Índice

1. [Visão Geral do Projeto](#1-visão-geral-do-projeto)
2. [Estrutura de Pastas e Arquivos](#2-estrutura-de-pastas-e-arquivos)
3. [Tecnologias e Dependências Externas](#3-tecnologias-e-dependências-externas)
4. [Arquitetura HTML](#4-arquitetura-html)
5. [Arquitetura CSS](#5-arquitetura-css)
6. [Arquitetura JavaScript](#6-arquitetura-javascript)
7. [Sistema Dark / Light Mode](#7-sistema-dark--light-mode)
8. [Boas Práticas Aplicadas](#8-boas-práticas-aplicadas)
9. [Acessibilidade (a11y)](#9-acessibilidade-a11y)
10. [Performance](#10-performance)
11. [Instalação e Execução Local](#11-instalação-e-execução-local)
12. [Guia de Manutenção](#12-guia-de-manutenção)
13. [Checklist de Deploy](#13-checklist-de-deploy)
14. [FAQ para Desenvolvedores](#14-faq-para-desenvolvedores)

---

## 1. Visão Geral do Projeto

O **FerLopes** é um site institucional jurídico com foco em conversão (captação de clientes via formulário), apresentação da equipe e reforço de autoridade. O projeto foi desenvolvido sem nenhum framework JavaScript ou pré-processador CSS, o que garante:

- **Zero dependências de build** — nenhum Node.js, Webpack ou Vite necessário para rodar
- **Portabilidade máxima** — funciona em qualquer hospedagem estática (Netlify, Vercel, GitHub Pages, cPanel)
- **Manutenção acessível** — qualquer desenvolvedor consegue editar sem instalar ferramentas especiais

### Páginas

| Arquivo | Descrição |
|---|---|
| `index.html` | Página principal: Hero, Diferenciais, Sobre, Áreas de Atuação, Depoimentos e Contato |
| `sobre-nos.html` | Página institucional: Banner, Linha do Tempo, Valores e Equipe com modal de perfil |

---

## 2. Estrutura de Pastas e Arquivos

```
ferlopes-advocacia/
│
├── index.html              # Página principal
├── sobre-nos.html          # Página Sobre Nós
├── README.md               # Esta documentação
│
└── assets/
    ├── css/
    │   └── style.css       # Único arquivo de estilos (1800+ linhas, bem comentado)
    │
    ├── js/
    │   └── main.js         # Único arquivo de scripts (680+ linhas, IIFE modularizada)
    │
    └── img/
        ├── logo.png            # Favicon / logo
        ├── background1.jpeg    # Imagem de fundo do Hero
        ├── about.jpg           # Imagem da seção Sobre
        ├── adv1.jpg            # Fotos dos advogados (adv1 a adv6)
        ├── adv2.jpg
        ├── adv3.jpg
        ├── adv4.jpg
        ├── adv5.jpg
        ├── adv6.jpg
        ├── post-1.jpg          # Thumbnails das publicações no rodapé
        ├── post-2.jpg
        └── post-3.jpg
```

> **Atenção:** O CSS e o JS são cada um apenas **um único arquivo**. Essa decisão reduz o número de requisições HTTP e simplifica a manutenção. Seções internas são bem delimitadas por comentários.

---

## 3. Tecnologias e Dependências Externas

O projeto não possui `package.json` nem `node_modules`. As únicas dependências são carregadas via CDN no `<head>` de cada página HTML.

### 3.1 Tipografia — Google Fonts

```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap" rel="stylesheet" />
```

| Fonte | Uso | Característica |
|---|---|---|
| **Cormorant Garamond** | Títulos, logotipo (`--font-display`) | Serifada, elegante, autoridade |
| **DM Sans** | Corpo de texto, navegação (`--font-body`) | Humanista, legível em tamanhos pequenos |

O par é clássico no design jurídico: a serifa transmite tradição e peso, a sans-serif garante leiturabilidade no corpo.

### 3.2 Ícones — Font Awesome 6

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.1/css/all.min.css" />
```

Usado em: ícones de navegação, features, serviços, formulário, rodapé e botões. Todos os ícones decorativos recebem `aria-hidden="true"` para não serem lidos por leitores de tela.

### 3.3 Preconnect (otimização)

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="preconnect" href="https://cdnjs.cloudflare.com" />
```

`preconnect` instrui o navegador a estabelecer a conexão TCP/TLS com os servidores externos antes mesmo de precisar dos arquivos, reduzindo a latência percebida.

---

## 4. Arquitetura HTML

### 4.1 Estrutura semântica

Ambas as páginas seguem a mesma hierarquia semântica:

```
<html data-theme="dark|light">
  <head>
    <!-- Meta, fonts, script de tema (inline) -->
  </head>
  <body>
    <header role="banner">      ← Cabeçalho fixo com navegação
    <main id="main-content">    ← Todo o conteúdo principal
      <section id="inicio">     ← Hero
      <section id="...">        ← Seções subsequentes
    </main>
    <footer role="contentinfo"> ← Rodapé
    <button id="scroll-top-btn"> ← Acessório flutuante
    <script src="main.js" defer> ← JS no final, carregado após DOM
  </body>
</html>
```

### 4.2 Hierarquia de headings

Cada página tem **exatamente um `<h1>`**, garantindo boa indexação por motores de busca e correta navegação por leitores de tela:

```
h1  — Título principal da página (Hero ou Banner)
  h2  — Títulos de seções
    h3  — Títulos de cards e sub-itens
```

### 4.3 Atributos de dados (data-*)

O HTML usa atributos `data-*` como contratos entre o HTML e o JavaScript, evitando acoplamento por classes CSS:

| Atributo | Elemento | Uso no JS |
|---|---|---|
| `data-page="index"` | `.nav-link` | Detecta página atual para marcar link ativo |
| `data-reveal` | Qualquer elemento | Alvo do Scroll Reveal (IntersectionObserver) |
| `data-reveal-delay="1..4"` | Elementos revelados | Aplica `transition-delay` escalonado via CSS |
| `data-lawyer-id="1..6"` | `.lawyer-card` | Chave para buscar dados do advogado no modal |
| `data-theme="dark|light"` | `<html>` | Controla qual bloco de variáveis CSS está ativo |

### 4.4 Script inline de tema (anti-FOUC)

```html
<script>
  (function () {
    var saved = localStorage.getItem('ferlopes-theme');
    var preferred = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', saved || preferred);
  })();
</script>
```

Este script está **inline no `<head>`**, antes do `<link>` do CSS. Isso garante que o tema correto seja aplicado antes de qualquer pixel ser pintado na tela, prevenindo o "flash" de fundo branco em usuários de modo escuro (FOUC — Flash of Unstyled Content).

---

## 5. Arquitetura CSS

O `style.css` está organizado em **20 seções numeradas**, delimitadas por comentários bloco:

```
/*================================================
   N. NOME DA SEÇÃO
================================================*/
```

### 5.1 Mapa completo de seções

| # | Seção | Responsabilidade |
|---|---|---|
| 1 | **Design Tokens** | Todas as CSS Variables: cores (dark/light), tipografia, espaçamentos, transições |
| 2 | **Reset & Base** | Normalização cross-browser, estilos base do `body`, links e botões |
| 3 | **Utilitários** | `.container`, `.sr-only` |
| 4 | **Componentes Globais** | `.section-label`, `.section-heading`, `.section-rule`, `.btn` |
| 5 | **Header / Navegação** | `.site-header`, `.primary-nav`, `.nav-link`, `.nav-toggle` |
| 6 | **Hero** | `.hero-section`, `.hero-content`, `.hero-scroll-hint` |
| 7 | **Features Strip** | `.features-strip`, `.feature-card` |
| 8 | **About** | `.about-section`, `.about-section__visual`, `.stats-row` |
| 9 | **Services** | `.services-section`, `.service-card` |
| 10 | **Testimonials** | `.testimonials-section`, `.testimonials-grid`, `.testimonial-card` |
| 11 | **Contact** | `.contact-section`, `.contact-form`, `.form-input`, `.form-status` |
| 12 | **Page Banner** | `.page-banner` (sobre-nos.html) |
| 13 | **History** | `.history-section`, `.timeline` (sobre-nos.html) |
| 14 | **Team** | `.team-section`, `.lawyer-card` (sobre-nos.html) |
| 15 | **Lawyer Modal** | `dialog`, `.modal-*` (sobre-nos.html) |
| 16 | **Footer** | `.site-footer`, `.footer-about`, `.post-item` |
| 17 | **Scroll To Top** | `.scroll-top-btn` |
| — | **Dark/Light Toggle** | `.theme-toggle`, `.icon-sun`, `.icon-moon`, `.no-transition` |
| 18 | **Animações** | `@keyframes fadeUp`, `@keyframes pulse`, `[data-reveal]` |
| 19 | **Responsivo Tablet** | `@media (max-width: 900px)` |
| 20 | **Responsivo Mobile** | `@media (max-width: 600px)` |

### 5.2 Sistema de CSS Variables (Design Tokens)

Todas as decisões de design estão centralizadas na seção 1 como variáveis CSS. Isso permite alterar a identidade visual inteira mudando apenas um lugar.

**Variáveis temáticas** (mudam entre dark e light):
```css
/* Exemplos — definidos em [data-theme="dark"] e [data-theme="light"] */
--clr-bg            /* Cor de fundo da página */
--clr-surface       /* Fundo de cards e header */
--clr-surface-2     /* Fundo de elementos de segundo nível */
--clr-border        /* Cor das bordas */
--clr-gold          /* Dourado principal da marca */
--clr-gold-light    /* Dourado em hover/destaque */
--clr-gold-pale     /* Dourado transparente (fundos suaves) */
--clr-text-primary  /* Texto principal */
--clr-text-muted    /* Texto secundário/auxiliar */
--clr-text-inverse  /* Texto sobre fundos dourados */
--clr-header-bg     /* Fundo do header com blur */
--clr-input-bg      /* Fundo dos campos de formulário */
```

**Variáveis estruturais** (independem do tema):
```css
--font-display   /* Cormorant Garamond */
--font-body      /* DM Sans */
--fs-hero        /* Tamanho fluido do título hero */
--fs-section     /* Tamanho fluido dos títulos de seção */
--space-xs/sm/md/lg/xl/2xl  /* Escala de espaçamento */
--container-max  /* Largura máxima do conteúdo */
--nav-h          /* Altura do header fixo */
--ease-out       /* Curva de animação padrão */
--dur-fast/base/slow  /* Durações de transição */
```

### 5.3 Tipografia fluida com `clamp()`

Os tamanhos de fonte dos elementos principais usam `clamp()` para escalar suavemente entre breakpoints, sem media queries adicionais:

```css
--fs-hero:    clamp(2.8rem, 6vw, 5.5rem);
/* ↑ mínimo: 44.8px | proporcional ao viewport | máximo: 88px */

--fs-section: clamp(2rem, 4vw, 3.2rem);
/* ↑ mínimo: 32px   | proporcional ao viewport | máximo: 51.2px */
```

### 5.4 Convenção de nomenclatura (BEM simplificado)

O CSS usa uma versão simplificada do BEM (Block, Element, Modifier):

```
.block               → componente principal     ex: .feature-card
.block__element      → parte interna            ex: .feature-card__title
.block--modifier     → variação do componente   ex: .feature-card--highlight
.is-state            → estado dinâmico (JS)     ex: .is-visible, .is-invalid
```

---

## 6. Arquitetura JavaScript

O `main.js` é uma **IIFE** (Immediately Invoked Function Expression) que encapsula todo o código em um escopo privado, evitando poluição do escopo global:

```javascript
(() => {
  'use strict';
  // Todo o código fica aqui, isolado
})();
```

### 6.1 Mapa de módulos

| # | Módulo | Função |
|---|---|---|
| 1 | **Utilitários** | `$()` e `$$()` — atalhos para `querySelector` e `querySelectorAll` |
| 2 | **Header Scroll** | Adiciona `.scrolled` ao header após 60px de scroll |
| 3 | **Nav Ativo** | Marca o link da página atual e acompanha seções via IntersectionObserver |
| 4 | **Menu Mobile** | Painel lateral deslizante com overlay, fechamento por Escape e clique fora |
| 5 | **Scroll Reveal** | IntersectionObserver que adiciona `.is-visible` a elementos `[data-reveal]` |
| 6 | **Scroll To Top** | Exibe botão flutuante após 400px, rola ao topo no clique |
| 7 | **Formulário** | Validação inline em tempo real (blur/input), feedback assíncrono, integração EmailJS |
| 8 | **Modal Advogados** | `<dialog>` nativo com dados em objeto JS, geração dinâmica de HTML |
| 9 | **Ano do Footer** | Atualiza o copyright automaticamente com `new Date().getFullYear()` |
| 10 | **Dark/Light Mode** | Lê/salva preferência, alterna `data-theme`, atualiza `aria-label` do botão |

### 6.2 Padrão de cada módulo

Todos os módulos seguem o mesmo contrato:

```javascript
const initNomeDoModulo = () => {
  // 1. Seleciona elementos necessários
  const el = $('#meu-elemento');
  
  // 2. Guard clause — sai imediatamente se o elemento não existe
  //    (permite usar o mesmo JS em páginas diferentes)
  if (!el) return;
  
  // 3. Define funções internas
  const doSomething = () => { /* ... */ };
  
  // 4. Registra event listeners
  el.addEventListener('click', doSomething);
};
```

A **guard clause** (`if (!el) return`) é a razão pela qual um único arquivo JS funciona em todas as páginas sem erros — módulos exclusivos de `sobre-nos.html` simplesmente não fazem nada quando executados no `index.html`.

### 6.3 Fluxo de inicialização

```javascript
const init = () => {
  initHeader();           // 1º — layout crítico
  initActiveNavLink();    // 2º — estado da nav antes de interações
  initMobileNav();        // 3º — depende da nav já configurada
  initScrollReveal();
  initScrollTopButton();
  initContactForm();
  initLawyerModal();      // Só age em sobre-nos.html
  initFooterYear();
  initThemeToggle();      // Último — lê estado já aplicado pelo script inline
};

// Suporte a scripts com e sem `defer`
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
```

### 6.4 IntersectionObserver — Scroll Reveal

Em vez de escutar o evento `scroll` (que dispara centenas de vezes por segundo), o projeto usa a API moderna `IntersectionObserver`:

```javascript
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Para de observar após revelar
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
```

- `threshold: 0.12` — o elemento começa a animar quando 12% dele está visível
- `rootMargin: '-40px'` — o gatilho "entra" 40px antes do fim da tela
- `unobserve` — libera memória após a animação (cada elemento anima apenas uma vez)

### 6.5 Integração com EmailJS (formulário)

O formulário está preparado para envio real via EmailJS. Basta descomentar o bloco e inserir as credenciais:

```javascript
// Em initContactForm(), dentro do bloco try:
await emailjs.sendForm(
  'SEU_SERVICE_ID',    // ex: 'service_abc123'
  'SEU_TEMPLATE_ID',   // ex: 'template_xyz789'
  form,
  'SUA_PUBLIC_KEY'     // ex: 'user_AbCdEfGhIjK'
);
```

Antes de usar, adicione o SDK do EmailJS no `<head>`:
```html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
<script>emailjs.init('SUA_PUBLIC_KEY');</script>
```

---

## 7. Sistema Dark / Light Mode

### 7.1 Fluxo completo

```
┌─────────────────────────────────────────────────────────────────┐
│  1. Página carrega                                              │
│  2. Script inline no <head> lê localStorage['ferlopes-theme']  │
│     → Se existe: aplica esse tema                              │
│     → Se não existe: lê prefers-color-scheme do sistema        │
│  3. data-theme="dark|light" é definido no <html>               │
│  4. CSS carrega e as variáveis corretas já estão ativas         │
│  5. Usuário clica no botão #theme-toggle                        │
│  6. JS alterna o data-theme e salva no localStorage            │
│  7. Toda a UI transiciona suavemente via CSS transitions        │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Como o CSS reage ao tema

```css
/* Variáveis do modo escuro */
[data-theme="dark"] {
  --clr-bg: #0d0d0d;
  --clr-text-primary: #f0ebe0;
  /* ... */
}

/* Variáveis do modo claro */
[data-theme="light"] {
  --clr-bg: #f5f3ef;
  --clr-text-primary: #1a1712;
  /* ... */
}

/* Os componentes apenas usam as variáveis — não precisam saber qual tema está ativo */
body {
  background-color: var(--clr-bg);      /* Muda automaticamente */
  color: var(--clr-text-primary);       /* Muda automaticamente */
  transition: background-color 0.4s, color 0.4s;  /* Suavidade */
}
```

### 7.3 Animação do ícone sol/lua

```css
/* Dark mode: mostra o sol (clique vai para light) */
[data-theme="dark"] .icon-sun  { opacity: 1; transform: rotate(0deg) scale(1); }
[data-theme="dark"] .icon-moon { opacity: 0; transform: rotate(-90deg) scale(0.5); }

/* Light mode: mostra a lua (clique vai para dark) */
[data-theme="light"] .icon-sun  { opacity: 0; transform: rotate(90deg) scale(0.5); }
[data-theme="light"] .icon-moon { opacity: 1; transform: rotate(0deg) scale(1); }
```

Os dois ícones estão sempre no DOM, sobrepostos com `position: absolute`. A alternância usa `opacity` + `transform` para uma animação de rotação suave e sem reflow.

### 7.4 Prevenção de flash (FOUC)

A classe `.no-transition` desativa todas as transições temporariamente quando o tema é aplicado sem animação (na carga inicial):

```css
.no-transition,
.no-transition * {
  transition: none !important;
}
```

```javascript
html.classList.add('no-transition');
html.setAttribute('data-theme', theme);
void html.offsetHeight; // Força reflow
html.classList.remove('no-transition');
```

---

## 8. Boas Práticas Aplicadas

### Separação de responsabilidades
- **HTML** cuida apenas da estrutura e semântica
- **CSS** cuida de toda a apresentação visual (nenhum estilo inline no HTML)
- **JS** cuida apenas do comportamento (nenhuma manipulação de estilos diretamente — apenas classes e atributos)

### Código defensivo
```javascript
// Guard clauses em vez de aninhamento profundo
const initModal = () => {
  const modal = $('#lawyer-modal');
  if (!modal) return; // Sai cedo, evita o if/else gigante
  // ...
};
```

### Event delegation
Em vez de adicionar o mesmo listener em vários elementos, alguns módulos usam delegação — um único listener no elemento pai:

```javascript
// Ruim: adiciona N listeners
cards.forEach(card => card.addEventListener('click', handler));

// Bom: um listener que verifica o alvo
container.addEventListener('click', (e) => {
  if (e.target.matches('.lawyer-card__cta')) handler(e);
});
```

### Passive listeners para performance
```javascript
// Eventos de scroll com { passive: true } não bloqueiam o thread principal
window.addEventListener('scroll', onScroll, { passive: true });
```

### Gestão de foco para acessibilidade
```javascript
// Ao fechar o menu mobile, retorna o foco ao botão que o abriu
const closeNav = () => {
  navMenu.classList.remove('open');
  navToggle.focus(); // Foco retorna ao ponto de origem
};
```

---

## 9. Acessibilidade (a11y)

O projeto aplica as diretrizes **WCAG 2.1 nível AA**:

### Landmarks ARIA
```html
<header role="banner">      <!-- Identifica o cabeçalho do site -->
<nav aria-label="...">      <!-- Descreve qual navegação é esta -->
<main id="main-content">    <!-- Área principal do conteúdo -->
<footer role="contentinfo"> <!-- Identifica o rodapé -->
```

### Atributos ARIA dinâmicos
```html
<!-- Atualizado pelo JS conforme o menu abre/fecha -->
<button aria-expanded="false" aria-controls="primary-nav">

<!-- Atualizado pelo JS conforme o tema muda -->
<button id="theme-toggle" aria-label="Alternar para modo claro">

<!-- Indica a página atual na navegação -->
<a aria-current="page">Sobre Nós</a>
```

### Ícones decorativos
```html
<!-- aria-hidden="true" remove o ícone da árvore de acessibilidade -->
<i class="fas fa-gavel" aria-hidden="true"></i>
```

### Labels acessíveis para campos
```html
<!-- Visualmente oculto, mas presente para leitores de tela -->
<label for="contact-name" class="sr-only">Nome completo</label>
<input id="contact-name" aria-required="true" />
```

### Foco visível por teclado
```css
/* Remove outline ao clicar com mouse (não intrusivo) */
:focus:not(:focus-visible) { outline: none; }

/* Mantém outline ao navegar por teclado (necessário) */
:focus-visible { outline: 2px solid var(--clr-gold); outline-offset: 3px; }
```

### Feedback de formulário ao vivo
```html
<!-- aria-live="polite": leitores de tela anunciam mudanças no status -->
<p role="status" aria-live="polite" id="form-status"></p>
```

### Modal nativo `<dialog>`
O uso do elemento `<dialog>` nativo do HTML5 em vez de uma `<div>` customizada oferece gerenciamento de foco automático, fechamento com `Escape` nativo e correto papel ARIA sem configuração manual.

---

## 10. Performance

### Carregamento de fontes otimizado
```html
<!-- Estabelece conexão antes de precisar dos arquivos -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

<!-- display=swap: texto visível com fonte fallback enquanto a web font carrega -->
<link href="...&display=swap" rel="stylesheet" />
```

### JavaScript com `defer`
```html
<!-- defer: carrega em paralelo, executa após o HTML ser parseado -->
<script src="./assets/js/main.js" defer></script>
```

### Imagens com `loading="lazy"`
```html
<!-- Carrega apenas quando a imagem se aproxima do viewport -->
<img src="./assets/img/adv1.jpg" loading="lazy" width="64" height="64" />
```

Definir `width` e `height` previne o CLS (Cumulative Layout Shift) — o navegador reserva o espaço correto antes da imagem carregar.

### IntersectionObserver em vez de scroll listener
O Scroll Reveal usa `IntersectionObserver` em vez de `window.addEventListener('scroll')`, que é muito mais eficiente pois roda fora da thread principal do JavaScript.

---

## 11. Instalação e Execução Local

### Pré-requisitos
Nenhuma instalação de Node.js, npm ou qualquer ferramenta é necessária. Você precisa apenas de:
- Um editor de código (recomendado: [VS Code](https://code.visualstudio.com/))
- Um servidor HTTP local (veja opções abaixo)

> **Por que não abrir direto no navegador (file://)？**
> Alguns navegadores bloqueiam recursos locais (fontes, imagens) quando a página é aberta via protocolo `file://`. Um servidor HTTP local resolve isso.

### Opção A — VS Code com Live Server (recomendado para iniciantes)

1. Instale a extensão [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) no VS Code
2. Abra a pasta do projeto no VS Code
3. Clique com o botão direito em `index.html` → **"Open with Live Server"**
4. O site abrirá em `http://127.0.0.1:5500`

### Opção B — Python (sem instalação adicional no macOS/Linux)

```bash
# Python 3
python3 -m http.server 8080

# Acesse: http://localhost:8080
```

### Opção C — Node.js com `serve`

```bash
# Instala o servidor globalmente (uma vez)
npm install -g serve

# Executa na pasta do projeto
serve .

# Acesse: http://localhost:3000
```

### Opção D — PHP (disponível em muitos ambientes)

```bash
php -S localhost:8080
```

---

## 12. Guia de Manutenção

### 12.1 Alterar cores da identidade visual

Abra `assets/css/style.css` e localize a **Seção 1 — Design Tokens**. Modifique apenas as variáveis dos blocos temáticos:

```css
/* Para ajustar o dourado em ambos os temas */
[data-theme="dark"]  { --clr-gold: #b8922e; }
[data-theme="light"] { --clr-gold: #9d7a22; }
```

Todas as ocorrências do dourado no site serão atualizadas automaticamente.

### 12.2 Adicionar nova seção em `index.html`

1. Crie a seção com `id` único:
```html
<section class="nova-secao" id="nova-secao" aria-labelledby="nova-heading">
  <div class="container">
    <p class="section-label" data-reveal>Label</p>
    <h2 class="section-heading" id="nova-heading" data-reveal data-reveal-delay="1">
      Título <em>em itálico</em>
    </h2>
    <span class="section-rule" aria-hidden="true"></span>
    <!-- conteúdo -->
  </div>
</section>
```

2. Adicione o link na navegação de ambos os HTMLs:
```html
<li><a href="./index.html#nova-secao" class="nav-link" data-page="index">Nova Seção</a></li>
```

3. Adicione os estilos na seção correspondente do `style.css`, mantendo o padrão de comentário.

### 12.3 Adicionar novo advogado no modal

No `main.js`, localize o objeto `lawyersData` dentro de `initLawyerModal()` e adicione uma nova entrada:

```javascript
'7': {
  name: 'Dr. Novo Advogado',
  role: 'Advogado Associado',
  img:  './assets/img/adv7.jpg',
  bio:  'Descrição completa do profissional...',
  specialties: ['Área 1', 'Área 2', 'Área 3'],
},
```

Em `sobre-nos.html`, adicione um novo card na `.team-grid` com `data-lawyer-id="7"`.

### 12.4 Ativar envio real do formulário

1. Crie uma conta em [EmailJS](https://www.emailjs.com/)
2. Configure um serviço de e-mail e um template
3. Adicione o SDK no `<head>` de `index.html`:
```html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
<script>emailjs.init('SUA_PUBLIC_KEY');</script>
```
4. No `main.js`, descomente o bloco de envio em `initContactForm()` e substitua as credenciais.
5. Remova a linha da simulação: `await new Promise(resolve => setTimeout(resolve, 1400));`

### 12.5 Adicionar nova página

1. Copie `sobre-nos.html` como base (já tem header, footer e JS configurados)
2. Mantenha o script inline de tema no `<head>`
3. Mantenha o botão `#theme-toggle` no header
4. O `main.js` funcionará automaticamente (guard clauses cuidam do resto)

---

## 13. Checklist de Deploy

Antes de publicar em produção, verifique:

- [ ] Todas as imagens estão na pasta `assets/img/` com nomes corretos
- [ ] Os caminhos de imagens no CSS (`background: url('../img/...')`) estão corretos em relação ao arquivo CSS
- [ ] O formulário está configurado com EmailJS ou outro serviço de envio
- [ ] O favicon `assets/img/logo.png` existe
- [ ] Os links das redes sociais no rodapé foram atualizados (`href="#"` → URL real)
- [ ] O número OAB/UF no rodapé foi atualizado
- [ ] Os `og:` meta tags têm a URL real do site (`og:url`, `og:image`)
- [ ] A `meta[name="theme-color"]` está com a cor correta (`#b8922e`)
- [ ] `robots.txt` e `sitemap.xml` foram criados (recomendado para SEO)

### Deploy em hospedagem estática

O projeto é um conjunto de arquivos estáticos e pode ser publicado em qualquer serviço:

| Serviço | Como publicar |
|---|---|
| **Netlify** | Arraste a pasta para [app.netlify.com/drop](https://app.netlify.com/drop) |
| **GitHub Pages** | Push para `main`, ative Pages nas configurações do repositório |
| **Vercel** | `vercel deploy` na pasta do projeto |
| **cPanel (hospedagem compartilhada)** | Upload dos arquivos via FTP para `public_html/` |

---

## 14. FAQ para Desenvolvedores

**P: Por que não usar React/Vue/Angular?**  
R: O escopo do projeto é um site institucional com conteúdo majoritariamente estático. Frameworks de SPA adicionariam complexidade de build, aumentariam o bundle size e tornariam a manutenção mais pesada para quem não conhece o ecossistema Node.js. HTML/CSS/JS puro atinge os mesmos resultados com muito menos overhead.

**P: Por que um único arquivo CSS e um único arquivo JS?**  
R: Reduz o número de requisições HTTP (cada arquivo = uma conexão). Em produção, o ideal seria minificar e combinar de qualquer forma — partir de um arquivo único simplifica esse processo. A organização interna por seções comentadas supre a necessidade de modularidade.

**P: Como adicionar animações mais complexas?**  
R: Para animações além do `fadeUp` e `pulse` já existentes, adicione novos `@keyframes` na seção 18 do CSS e aplique-os via classes ou `data-*`. Para animações orquestradas e complexas (ex: texto digitado, contadores), adicione funções dentro da IIFE em `main.js`.

**P: O site funciona sem JavaScript?**  
R: O conteúdo principal é totalmente acessível sem JS. O que deixa de funcionar sem JS: menu mobile, scroll reveal (elementos ficam visíveis normalmente), botão de tema (fica no tema padrão), modal de advogados, validação do formulário e scroll to top. Para uma degradação mais elegante, adicione `<noscript>` com mensagem informativa.

**P: Como implementar um blog ou área de notícias?**  
R: Para um blog real, considere integrar com um CMS headless (como Contentful, Sanity ou mesmo WordPress como API). Para algo simples, crie um `blog.html` com listagem estática e arquivos HTML individuais por post — o padrão do projeto já suporta quantas páginas forem necessárias.

---

*Documentação criada para o projeto FerLopes Advocacia. Última atualização: 2026.*
