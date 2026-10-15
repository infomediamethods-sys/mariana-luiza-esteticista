/* movimento.js — movimento DESTE site, reproduzido da Temple (Kit de Design, seção "Movimento"; design.md §10).
   Primeiro o comportamento (vale com e sem prefers-reduced-motion): "Ver todos" dos procedimentos e o guia
   "Por onde começar?". Depois o movimento (só sem reduced-motion): revelar com fade + 26px, 0,9s, escalonamento 90ms.
   main.js e base.css não se editam. */
(function () {
  'use strict';
  var reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Procedimentos: 3 + 3 em "Ver todos" ---------- */
  var verTodos = document.querySelector('[data-ver-todos]');
  var extras = document.querySelectorAll('#procs-lista [data-extra]');
  if (verTodos && extras.length) {
    var fechado = verTodos.querySelector('[data-rotulo-fechado]');
    var aberto = verTodos.querySelector('[data-rotulo-aberto]');
    var definir = function (abrir) {
      extras.forEach(function (li) { li.hidden = !abrir; });
      verTodos.setAttribute('aria-expanded', abrir ? 'true' : 'false');
      fechado.hidden = abrir; aberto.hidden = !abrir;
      if (window.__lenis) window.__lenis.resize();
    };
    definir(false);
    verTodos.hidden = false;
    verTodos.addEventListener('click', function () {
      var abrir = verTodos.getAttribute('aria-expanded') !== 'true';
      definir(abrir);
      if (!abrir) {
        var lista = document.getElementById('procedimentos');
        var topo = lista.getBoundingClientRect().top;
        if (topo < 0) { if (window.__lenis) window.__lenis.scrollTo(lista, { immediate: true }); else lista.scrollIntoView(); }
      }
    });
  }

  /* ---------- Guia "Por onde começar?" (2 passos) ---------- */
  var guia = document.querySelector('[data-guia]');
  if (guia) {
    var passo1 = guia.querySelector('[data-passo="1"]');
    var passo2 = guia.querySelector('[data-passo="2"]');
    var respostas = guia.querySelectorAll('[data-resposta]');
    var aviso = guia.querySelector('[data-guia-aviso]');
    var entrar = function (el) {
      if (reduzir) return;
      el.classList.remove('guia__passo-entra'); void el.offsetWidth; el.classList.add('guia__passo-entra');
    };
    var focar = function (el) { try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); } };
    guia.querySelectorAll('[data-opcao]').forEach(function (b) {
      b.addEventListener('click', function () {
        var alvo = null;
        respostas.forEach(function (r) { var ok = r.dataset.resposta === b.dataset.opcao; r.hidden = !ok; if (ok) alvo = r; });
        passo1.hidden = true; passo2.hidden = false; entrar(passo2);
        if (alvo) {
          var t = alvo.querySelector('.guia__indicacao');
          aviso.textContent = 'Passo 2 de 2: ' + t.textContent;
          focar(t);
        }
        if (window.__lenis) window.__lenis.resize();
      });
    });
    var voltar = guia.querySelector('[data-voltar]');
    if (voltar) voltar.addEventListener('click', function () {
      passo2.hidden = true; passo1.hidden = false; entrar(passo1);
      aviso.textContent = 'Passo 1 de 2';
      focar(passo1.querySelector('.guia__pergunta'));
      if (window.__lenis) window.__lenis.resize();
    });
  }

  if (reduzir || !('IntersectionObserver' in window)) return;

  /* ---------- Revelar da Temple ---------- */
  document.documentElement.classList.add('mov');
  var itens = document.querySelectorAll('.rt');
  var obs = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target;
      var irmaos = Array.prototype.filter.call(el.parentNode.children, function (c) { return c.classList.contains('rt') && !c.hidden; });
      var i = Math.min(Math.max(irmaos.indexOf(el), 0), 3);
      el.style.transitionDelay = (i * 90) + 'ms';
      el.classList.add('rt--in');
      el.addEventListener('transitionend', function limpar(ev) {
        if (ev.target !== el) return;
        el.style.transitionDelay = '';
        el.removeEventListener('transitionend', limpar);
      });
      obs.unobserve(el);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });
  itens.forEach(function (el) { obs.observe(el); });
})();
