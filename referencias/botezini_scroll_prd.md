# PRD — Scroll Narrativo · Auto-Apresentação Botezini

**Produto:** botezini.com.br  
**Versão:** 1.0  
**Data:** Mar 2026  
**Status:** Em aberto

> O site se torna uma apresentação comercial ativa: conforme o visitante rola, cada seção entra em cena, carrosséis avançam, SVGs cedem lugar a fotos reais e dados ganham vida — tudo sem tirar o controle do usuário.

**Tags:** `Scroll-Driven` · `SVG → Foto` · `Auto-Carousel` · `IntersectionObserver` · `Sem Framework` · `GSAP opcional`

---

## 01 — Objetivo

### Por que fazer isso?

O visitante B2B da Botezini (gerente de compras, RH, gestor de operações) chega ao site com atenção limitada. A maioria não vai rolar tudo — vai parar no primeiro bloco que não "falar" com ele imediatamente. O Scroll Narrativo transforma o site num vendedor silencioso: cada seção entra com propósito, conta um pedaço da história e convida o próximo scroll.

| Objetivo | Descrição |
|---|---|
| **Retenção de atenção** | Animações de entrada sincronizadas com o scroll mantêm o visitante engajado sem precisar de interação ativa. O site "pede" atenção, não "espera" por ela. |
| **Autoridade sem esforço** | SVGs sendo substituídos por fotos reais, contadores animados e carrosséis automáticos criam a percepção de um site vivo, atualizado e profissional. |
| **Controle sempre do usuário** | A auto-apresentação é um guia, não um sequestro de tela. O visitante pode clicar, voltar e interagir manualmente a qualquer momento. |

> **Princípio central:** toda animação é disparada pelo scroll do usuário, não por um timer independente. O visitante sempre está no controle — as animações são consequência natural de onde ele está na página.

---

## 02 — Arquitetura do Sistema

### Como o mecanismo funciona

O mecanismo central é o **IntersectionObserver** — nativo do browser, sem dependências — que detecta quando cada elemento entra na viewport e dispara as animações correspondentes. Para transições mais complexas (SVG→foto, contadores), funções utilitárias específicas são acionadas.

### Gatilho (Trigger)

- ✅ `IntersectionObserver` em cada seção e componente animável
- ✅ Threshold configurável por tipo (40% para carrosséis, 20% para blocos de texto)
- ✅ `rootMargin: "-80px 0px"` para não disparar cedo demais
- ❌ Nunca usar `scroll` event listener puro — mata performance

### Consequência (Effect)

- → **Entrada de texto:** `opacity 0→1` + `translateY 24px→0` com stagger entre filhos
- → **Carrossel:** auto-avança com intervalo de 3s após entrar na viewport
- → **SVG → Foto:** crossfade de 600ms com escala sutil no photo reveal
- → **Counters:** contagem animada de 0 ao valor final em 1.2s ease-out

### Padrão base de registro

```js
// Padrão base de registro de um elemento animável
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('bz--visible');
      // dispara efeito específico baseado em data-anim
      BZ_Anim.run(entry.target);
      observer.unobserve(entry.target); // faz só uma vez
    }
  });
}, { threshold: 0.2, rootMargin: '-80px 0px' });

// Registrar todos os elementos com [data-anim]
document.querySelectorAll('[data-anim]').forEach(el => observer.observe(el));
```

Cada elemento animável recebe um atributo `data-anim` que declara qual efeito aplicar. O módulo `BZ_Anim` despacha para a função correta. CSS define o estado inicial e a transição; JS apenas adiciona a classe `bz--visible`.

---

## 03 — Coreografia: Mapa Completo por Seção

| # | Seção | ID | Animação principal | Tipo |
|---|---|---|---|---|
| 1 | Hero | `#hero` | Logotipo fade+scale → H1 linha por linha → subtítulo → CTAs com stagger de 80ms. Parallax 30% no scroll. | On Load |
| 2 | Sobre | `#sobre` | Título + parágrafo entram. 4 cards em sequência com 100ms de delay. Borda dourada faz wipe horizontal em cada card. | Scroll |
| 3 | Tradição | `#tradicao` | Foto com clip-path wipe horizontal. Bullet points em cascata com 120ms. Badge "25+ Anos" faz counter 0→25. | Scroll |
| 4 | Processo | `#processo` | Linha vertical cresce de cima para baixo. 4 steps entram com 200ms de delay. Ícone de cada step pulsa uma vez. | Scroll |
| 5 | O Problema Real | `#problema` | Tabela com cada linha revelada com 150ms de delay. Linha Botezini com glow dourado ao entrar. | Scroll |
| 6 | Linhas (cards) | `#linhas` | 5 cards avançam automaticamente a cada 2.8s quando visíveis. Indicadores com fill progressivo. Para no hover/touch. | Auto-Play |
| 7 | Produtos por Linha | `#operacao` etc | Carrossel inicia auto-play. Cada card faz crossfade SVG→foto real em 600ms com stagger de 200ms. | Morph |
| 8 | Variações | `#variacoes` | 5 blocos avançam automaticamente. Tags dentro de cada bloco entram com stagger de 80ms. | Auto-Play |
| 9 | Tecidos | `#detalhes` | Cada linha da tabela entra com fade+translateX(-12px) em sequência de 80ms. Micro-bar de gramatura proporcional. | Scroll |
| 10 | Kits | `#kits` | 3 cards em cascata com 180ms de delay. Itens internos sobem com stagger de 50ms após o card aparecer. | Scroll |
| 11 | ROI | `#roi` | R$ 340 e R$ 130 contam de 0 em 1.5s. Seta pisca 2x. "Economia de R$ 210" pulsa com glow dourado. | Counter |
| 12 | Planos | `#planos` | 3 planos em sequência. "Recomendado" com borda dourada pulsante por 3 ciclos de 800ms após entrar. | Scroll |
| 13 | Parceiros | `#parceiros` | Carrossel infinito acelera de 0 à velocidade normal em 800ms. Logos 60%→100% opacity. Pausa no hover. | Auto-Play |
| 14 | Contato | `#contato` | Título com wipe. Campos do form aparecem com 80ms de delay entre cada. CTA WhatsApp pulsa em loop suave. | Final |

---

## 04 — Hero: Primeira Impressão

### Sequência de entrada (on page load — sem scroll)

| Tempo | Elemento | Animação |
|---|---|---|
| t=0ms | Imagem de fundo | `opacity: 0 → 0.35` em 800ms ease-out |
| t=100ms | Logo BZ | `scale(0.85) opacity:0 → scale(1) opacity:1` em 500ms |
| t=300ms | Breadcrumb | `translateY(-8px) opacity:0 → normal` em 400ms |
| t=500ms | H1 linha 1 | `translateY(20px) → 0` em 400ms |
| t=620ms | H1 linha 2 | `translateY(20px) → 0` em 400ms (120ms de delay) |
| t=780ms | Subtítulo | Fade + `translateY(12px→0)` em 400ms |
| t=980ms | CTAs | `translateY(10px→0) opacity` em 350ms. Botão primário pulsa após entrar. |

### Parallax no scroll

Enquanto o usuário scrola para fora do Hero, a imagem de fundo se move a 30% da velocidade do scroll.

```js
// Parallax leve — aceitável aqui porque afeta só um elemento
window.addEventListener('scroll', () => {
  heroBg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
}, { passive: true });
```

---

## 05 — Sobre & Tradição

### Sobre (`#sobre`)

1. Eyebrow "01 — Identidade" faz fade-in com `translateX(-10px→0)`
2. H2 sobe de `translateY(20px)` com 80ms de delay
3. Parágrafos entram com 60ms cada (stagger)
4. Cards (Parceria, Confiança, Elegância, Precisão): 100ms de delay entre cada. Borda dourada no bottom faz wipe horizontal ao entrar
5. Auto-avança entre os cards se o carrossel estiver ativo

### Tradição (`#tradicao`)

1. Foto de São João del-Rei faz **clip-path wipe**: `inset(0 100% 0 0 → inset(0 0% 0 0))` em 900ms ease-in-out
2. Título e parágrafo surgem com `translateY(16px)` em paralelo à foto
3. 4 bullet points em cascata com 120ms de delay entre eles
4. Badge "25+ Anos": counter animado de 0 a 25 em 1200ms, acelerado no final
5. Badge "Qualidade Certificada" gira 360° uma vez ao entrar na viewport

---

## 06 — Processo: Linha do Tempo Progressiva

A linha vertical da timeline tem `height: 0 → 100%` animado via CSS com `transition: height 1.2s ease-out`. Cada step aparece com delay incremental de 220ms.

```css
/* Estado inicial dos steps */
.processo-step {
  opacity: 0;
  transform: translateX(-16px);
  transition: opacity 400ms ease, transform 400ms ease;
}

/* JS injeta delay individual: style="transition-delay: 220ms" */
.processo-step.bz--visible {
  opacity: 1;
  transform: none;
}

/* Ícone do step: pulso de entrada */
.step-icon.bz--visible {
  animation: bzPulse 600ms ease-out forwards;
}

@keyframes bzPulse {
  0%   { transform: scale(1.0) }
  40%  { transform: scale(1.12) }
  100% { transform: scale(1.0) }
}
```

---

## 07 — Sistema de Carrossel (BZCarrossel)

### Comportamento do Auto-Play

- ✅ **Início:** quando 40% do carrossel entra na viewport, inicia auto-play com intervalo de 2.8s
- ✅ **Pausa:** qualquer `mouseenter` ou `touchstart` pausa o timer imediatamente
- ✅ **Retomada:** após 4s sem interação (`mouseleave`), o auto-play recomeça do card atual
- ✅ **Saída da viewport:** se o usuário scrollar para fora, o carrossel pausa e congela
- ✅ **Indicadores:** dots se preenchem progressivamente como "loading bar" durante os 2.8s
- ❌ **Jamais:** auto-play não avança enquanto cursor/dedo está sobre qualquer elemento

> **Indicador de progresso:** cada dot recebe um pseudo-elemento `::after` com fill animado durante os 2.8s. Se o usuário clica, o fill para e o dot ativo troca. Comunica visualmente que "algo está acontecendo" sem ser intrusivo.

```js
class BZCarrossel {
  constructor(el, interval = 2800) {
    this.el       = el;
    this.interval = interval;
    this.timer    = null;
    this.paused   = false;
    this.current  = 0;

    el.addEventListener('mouseenter', () => this.pause());
    el.addEventListener('mouseleave', () => this.resume(4000));
    el.addEventListener('touchstart',  () => this.pause(), { passive: true });
  }

  start()         { if (!this.paused) this.timer = setInterval(() => this.next(), this.interval); }
  pause()         { clearInterval(this.timer); this.paused = true; }
  resume(delay=0) { setTimeout(() => { this.paused = false; this.start(); }, delay); }
  next()          { /* avança slide, atualiza dots */ }
  stop()          { clearInterval(this.timer); this.paused = false; }
}
```

---

## 08 — Sistema SVG → Foto

### Estrutura HTML de cada card de produto

```html
<div class="produto-card"
     data-anim="svg-foto"
     data-foto-real="/assets/img/fotos/op_01_real.jpg">

  <div class="img-stack">
    <!-- Camada 1: placeholder (visível no início) -->
    <img class="img-placeholder"
         src="/assets/img/camisa_op_manga_curta.png">

    <!-- Camada 2: foto real (opacity:0, carrega em background) -->
    <img class="img-real"
         src="" <!-- src vazio, preenchido pelo JS -->
         style="opacity:0; position:absolute; inset:0">
  </div>

</div>
```

### Lógica de transição (passo a passo)

1. **Ao entrar na viewport:** JS preenche o `src` da `.img-real` com `data-foto-real` e inicia download em background
2. **Ao carregar (`onload`):** `.img-real` faz `opacity: 0 → 1` em 600ms enquanto `.img-placeholder` faz `opacity: 1 → 0` em paralelo
3. **Stagger:** se vários cards estão visíveis, as transições acontecem com 200ms de delay entre cada card
4. **Fallback:** se `data-foto-real` não existir ou não carregar em 5s, o placeholder permanece sem erros visíveis
5. **Scale sutil:** a foto real entra com `scale(1.04 → 1.0)` em 800ms para sensação de "câmera aproximando"

```js
function triggerSVGtoFoto(card, delay = 0) {
  const fotoUrl         = card.dataset.fotoReal;
  const imgReal         = card.querySelector('.img-real');
  const imgPlaceholder  = card.querySelector('.img-placeholder');

  if (!fotoUrl || !imgReal) return;

  setTimeout(() => {
    imgReal.src = fotoUrl;
    imgReal.onload = () => {
      imgReal.style.transition        = 'opacity 600ms ease, transform 800ms ease';
      imgReal.style.opacity           = '1';
      imgReal.style.transform         = 'scale(1)';
      imgPlaceholder.style.transition = 'opacity 600ms ease';
      imgPlaceholder.style.opacity    = '0';
    };
  }, delay);
}
```

### Sequência visual completa (ex: Linha Saúde)

| Tempo | Evento |
|---|---|
| t=0 | Seção entra na viewport. Carrossel inicia auto-play. Download da foto do card 1 começa. |
| t=300ms | Foto 1 carregou: crossfade "Jaleco Clínico" placeholder → foto real. Scale 1.04→1. |
| t=500ms | Card 2 (Scrub): crossfade com 200ms de stagger. |
| t=2800ms | Carrossel avança. Downloads dos próximos cards já foram iniciados em background. |

> **Contexto atual:** o site usa imagens PNG reais para Linha Operacional e Alimentar, e placeholders `placehold.co` para Saúde, Corporativa e Essencial. A transição SVG→Foto vale para os placeholders agora e se aplica automaticamente a qualquer imagem quando as fotos reais chegarem.

---

## 09 — ROI & Planos

### Seção ROI — Counters animados

1. Ao entrar: "R$ 340,00" conta de 0 a 340 em 1.2s (ease-out quadrático)
2. Após 400ms: seta "→" pisca 2x com glow dourado para direcionar o olhar
3. "R$ 130,00" conta de 0 a 130 com 600ms de delay após o primeiro
4. "Economia de R$ 210,00" aparece com fade e recebe pulsação dourada por 3 ciclos

### Seção Planos — Destaque "Recomendado"

1. "Pedido Avulso" entra com 0ms de delay
2. "Giro Trimestral" (Recomendado) entra com 180ms, já com borda dourada visível
3. Após 500ms, borda faz animação de "pulse" por 3 ciclos de 800ms
4. "Anual UaaS" entra com 360ms de delay

---

## 10 — Carrossel Infinito de Parceiros

Implementado com CSS `animation: marquee linear infinite`.

```css
/* Máscara de fade nas bordas */
.parceiros-track {
  mask-image: linear-gradient(to right,
    transparent 0%, black 12%,
    black 88%, transparent 100%);
}
```

**Comportamento:**

1. Inicialmente pausado (`animation-play-state: paused`)
2. Ao entrar na viewport: `animation-play-state: running` com `animation-duration: 60s → 30s` nos primeiros 800ms (simula aceleração)
3. Logos com `opacity: 0.5 → 1` ao entrar na área visível
4. Pausa total no `mouseenter` — hover em qualquer logo congela o carrossel

---

## 11 — Seção de Contato: Convite Final

1. Título faz wipe clip-path horizontal em 700ms
2. Campos (Nome, Empresa, Setor, Quantidade, Mensagem) aparecem de cima para baixo com 80ms de delay entre cada
3. CTA "Solicitar Análise →" aparece por último com 600ms de delay
4. Botão WhatsApp: `animation: pulse 2s ease-in-out infinite` após entrar — scale 1.0→1.02→1.0. Para no hover.
5. Infos de contato (WhatsApp, Localização, Horário) entram em stagger com 100ms entre cada

---

## 12 — Regras de Interatividade

> **Contrato central:** as animações servem o usuário, não o sequestram. Qualquer tentativa de usar o site normalmente deve funcionar sem fricção.

| Ação do usuário | ✅ Comportamento esperado | ❌ Comportamento proibido |
|---|---|---|
| Clicar em link do nav | Scroll imediato para seção — sem esperar animação acabar | Bloquear nav até animação terminar |
| Hover em card de carrossel | Auto-play pausa instantaneamente | Continuar avançando com cursor no card |
| Clicar em seta do carrossel | Avança imediatamente, reseta timer | Ignorar clique durante transição |
| Scroll rápido pela página | Animações disparam, mas não travam o scroll | Travar scroll para mostrar animação |
| Clicar em CTA | Executa ação imediatamente | Esperar animação pendente |
| Scroll de volta ao topo | Seções NÃO repetem animação (já marcadas como vistas) | Reanimar seções no scroll reverso |
| Tab / Teclado | Foco visível, ordem correta | Elementos animados quebrando foco |
| `prefers-reduced-motion` | Todas animações desativadas — conteúdo aparece direto | Ignorar media query de acessibilidade |

> **Acessibilidade obrigatória:** envolver toda lógica de animação em `if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches)`. Usuários com epilepsia ou preferências de acessibilidade não devem ver nenhuma animação de movimento.

---

## 13 — Stack Técnico & Performance

### Dependências

| Opção | Descrição | Recomendação |
|---|---|---|
| **Sem dependências** | IntersectionObserver nativo + CSS transitions + Vanilla JS. Tamanho zero extra. | ✅ Recomendado |
| **GSAP** | `gsap` core + `ScrollTrigger` para efeitos sofisticados (linha do processo, parallax). ~70KB gzip. | Usar se necessário |
| AOS.js / Animate.css | Classes genéricas, menos controle | ❌ Evitar |

### Critérios de Performance

- ✅ Usar apenas `transform` e `opacity` nas animações — sem animar `width`, `height`, `top`, `left`
- ✅ `will-change: transform, opacity` apenas nos elementos que realmente animam
- ✅ Fotos reais: lazy load com `loading="lazy"` + pré-download só quando seção entra na viewport
- ✅ Carrosseis: usar `transform: translateX` em vez de `left` — evita reflow
- ✅ Mobile: reduzir duração de todas as animações em 30%

### Atributos `data-*` definidos no HTML

| Atributo | Valores | Efeito disparado |
|---|---|---|
| `data-anim="fade-up"` | — | `opacity 0→1` + `translateY 20→0` |
| `data-anim="fade-left"` | — | `opacity 0→1` + `translateX -16→0` |
| `data-anim="wipe-h"` | — | `clip-path` wipe horizontal |
| `data-anim="counter"` | `data-value="340"` | Conta de 0 ao valor em 1.2s |
| `data-anim="svg-foto"` | `data-foto-real="url"` | Crossfade placeholder → foto real |
| `data-anim="stagger"` | `data-delay="100"` | Delay incremental nos filhos diretos |
| `data-carousel` | `data-interval="2800"` | Inicia BZCarrossel ao entrar na viewport |
| `data-parallax` | `data-speed="0.3"` | Parallax no scroll (apenas hero) |

---

## 14 — Fases de Implementação

### Fase 1 — Fundação (CSS + IntersectionObserver)
Configurar o estado inicial de todos os elementos (`opacity:0, transform`), criar o observer e adicionar os `data-anim` no HTML. Validar que todas as seções entram corretamente. Incluir `prefers-reduced-motion`.

### Fase 2 — Carrosseis (BZCarrossel)
Implementar a classe `BZCarrossel`, aplicar em Linhas, Variações e Parceiros. Validar handoff de interatividade (hover, touch, saída de viewport). Testar mobile.

### Fase 3 — SVG → Foto
Implementar a estrutura `.img-stack` em todos os cards de produto, adicionar os `data-foto-real` e o módulo `triggerSVGtoFoto`. Iniciar com Linha Saúde e Corporativa (que têm placeholders). Expandir para as demais ao ter fotos reais.

### Fase 4 — Counters & Efeitos Finais
Implementar counter animado no ROI e no badge "25+ Anos". Adicionar pulse no plano Recomendado e no botão WhatsApp. Implementar parallax no Hero.

---

## Critério de Aceite Global

> Um gerente de compras que abre o site em uma reunião e precisa clicar rápido em "Falar com Consultor" não encontra nenhuma resistência. Cada seção deve ser indistinguível de um site estático quando o usuário está interagindo ativamente. As animações são percebidas, mas nunca sentidas como obstáculos.
