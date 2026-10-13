// Fonctionnement du site. Les infos du club (groupes, horaires, tarifs, téléphone)
// sont dans assets/js/data.js.

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(pointer: coarse)').matches;
const isMobile = () => window.innerWidth <= 960;
const euro = (n) => `${n} €`;

// ---------------------------------------------------------
// Fenêtre de demande et message éphémère (communs à toutes les pages)
// ---------------------------------------------------------
document.body.insertAdjacentHTML('beforeend', `
<dialog class="modal" id="modal" aria-labelledby="m-title">
  <form class="modal__box" id="modal-form">
    <span class="modal__grip" aria-hidden="true"></span>
    <button type="button" class="modal__close" data-close aria-label="Fermer">×</button>
    <div id="m-fields">
      <p class="kicker" id="m-kicker"></p>
      <h2 class="h3" id="m-title"></h2>
      <p class="modal__recap" id="m-recap"></p>
      <div class="field">
        <label for="m-name" id="m-name-label">Nom et prénom</label>
        <input id="m-name" name="name" required autocomplete="name">
      </div>
      <div class="field-row">
        <div class="field" id="f-age">
          <label for="m-age">Âge de l'enfant</label>
          <input id="m-age" name="age" type="number" min="3" max="18" inputmode="numeric">
        </div>
        <div class="field">
          <label for="m-tel">Votre téléphone</label>
          <input id="m-tel" name="tel" type="tel" required autocomplete="tel" inputmode="tel" placeholder="06 12 34 56 78">
        </div>
      </div>
      <div class="field">
        <label for="m-msg">Message <span class="optional">(facultatif)</span></label>
        <textarea id="m-msg" name="msg" rows="3" placeholder="Disponibilités, questions…"></textarea>
      </div>
      <p class="modal__how">Votre demande arrive directement sur le téléphone du club :</p>
      <div class="modal__actions">
        <button type="submit" class="btn btn--pink" data-via="sms">Envoyer par SMS</button>
        <button type="submit" class="btn btn--whatsapp" data-via="wa">Envoyer par WhatsApp</button>
      </div>
      <p class="modal__alt">Ou appelez le <a href="tel:${CLUB.phone.sms}">${CLUB.phone.display}</a></p>
    </div>
    <div class="modal__done" id="m-done" hidden>
      <span class="modal__check" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12l5 5 9-10"/></svg></span>
      <h2 class="h3">C'est presque fini !</h2>
      <p id="m-done-text"></p>
      <button type="button" class="btn btn--navy" data-close>Fermer</button>
    </div>
  </form>
</dialog>
<div class="toast" id="toast" role="status" aria-live="polite"></div>`);

const toastEl = document.getElementById('toast');
let toastTimer;
function toast(message) {
  toastEl.textContent = message;
  toastEl.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('is-visible'), 4500);
}

// Sur ordinateur, un lien « tel: » ne fait rien : on copie le numéro à la place.
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="tel:"]');
  if (!link || isTouch) return;
  e.preventDefault();
  if (navigator.clipboard) navigator.clipboard.writeText(CLUB.phone.display).catch(() => {});
  toast(`Numéro copié : ${CLUB.phone.display}. Appelez-nous depuis votre téléphone.`);
});

document.querySelectorAll('[data-season]').forEach((el) => { el.textContent = CLUB.season; });

// ---------------------------------------------------------
// Menu
// ---------------------------------------------------------
const header = document.querySelector('.header');
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

function closeMenu() {
  nav.classList.remove('is-open');
  document.body.classList.remove('menu-open');
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-label', 'Ouvrir le menu');
}

burger.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  document.body.classList.toggle('menu-open', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
});
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

const totop = document.getElementById('totop');
function onScroll() {
  header.classList.toggle('is-scrolled', window.scrollY > 10);
  totop.classList.toggle('is-visible', window.scrollY > 700);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---------------------------------------------------------
// Cartes des groupes (pages École et Adultes), à partir de data.js
// ---------------------------------------------------------
function slotHtml(s) {
  return `<li><span class="slot__day">${s.day}</span><span class="slot__time">${s.time}</span>` +
    `<span class="pool pool--${s.pool}">${POOLS[s.pool].name}</span></li>`;
}

function priceHtml(prices) {
  const entries = Object.entries(prices);
  if (entries.length === 1) {
    const [n, p] = entries[0];
    return `<strong>${euro(p)}</strong> / an · ${n} séance${n > 1 ? 's' : ''} par semaine`;
  }
  return entries.map(([n, p]) => `<strong>${euro(p)}</strong> ${n} séance${n > 1 ? 's' : ''}`).join(' · ');
}

document.querySelectorAll('[data-groups]').forEach((box) => {
  box.innerHTML = GROUPS.filter((g) => g.who === box.dataset.groups).map((g) => `
    <article class="group${g.featured ? ' group--featured' : ''} reveal" data-group="${g.id}">
      <header class="group__head"><h3 class="group__tag">${g.name}</h3><p class="group__goal">${g.goal}</p></header>
      <ul class="slots">${g.slots.map(slotHtml).join('')}</ul>
      <footer class="group__price">${priceHtml(g.prices)}<a class="group__join" href="adherer.html?groupe=${g.id}">Choisir ce groupe →</a></footer>
    </article>`).join('');

  // Filtres par piscine
  const present = Object.keys(POOLS).filter((k) => k !== 'sea' && box.querySelector('.pool--' + k));
  if (present.length < 2) return;
  const bar = document.createElement('div');
  bar.className = 'filters';
  bar.innerHTML = '<span class="filters__label">Piscine :</span>' +
    '<button type="button" class="filter" aria-pressed="true" data-pool="all">Toutes</button>' +
    present.map((k) => `<button type="button" class="filter" aria-pressed="false" data-pool="${k}">` +
      `<span class="filter__dot" style="--c:${POOLS[k].color}"></span>${POOLS[k].name}</button>`).join('');
  box.before(bar);

  bar.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter');
    if (!btn) return;
    const pool = btn.dataset.pool;
    bar.querySelectorAll('.filter').forEach((f) => f.setAttribute('aria-pressed', String(f === btn)));
    box.querySelectorAll('.group').forEach((group) => {
      const items = [...group.querySelectorAll('.slots li')];
      items.forEach((li) => li.classList.toggle('is-dim', pool !== 'all' && !li.querySelector('.pool--' + pool)));
      group.classList.toggle('is-empty', items.every((li) => li.classList.contains('is-dim')));
    });
  });
});

// ---------------------------------------------------------
// Carrousels sur téléphone : points de position sous les cartes
// ---------------------------------------------------------
document.querySelectorAll('[data-carousel]').forEach((track) => {
  const items = [...track.children];
  if (items.length < 2) return;
  const dots = document.createElement('div');
  dots.className = 'dots';
  dots.setAttribute('aria-hidden', 'true');
  dots.innerHTML = items.map(() => '<span></span>').join('');
  track.after(dots);
  const update = () => {
    const center = track.scrollLeft + track.clientWidth / 2;
    let active = 0;
    items.forEach((it, i) => { if (it.offsetLeft - track.offsetLeft <= center) active = i; });
    dots.querySelectorAll('span').forEach((d, i) => d.classList.toggle('is-active', i === active));
  };
  track.addEventListener('scroll', update, { passive: true });
  update();
});

// ---------------------------------------------------------
// Apparitions au défilement
// ---------------------------------------------------------
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const siblings = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
    if (siblings.length > 1) el.style.transitionDelay = (siblings.indexOf(el) % 4) * 80 + 'ms';
    el.classList.add('is-visible');
    revealObserver.unobserve(el);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// ---------------------------------------------------------
// Compteurs animés
// ---------------------------------------------------------
function animateNumber(el, from, to, duration) {
  if (reduceMotion || from === to) { el.textContent = to; return; }
  const start = performance.now();
  function frame(now) {
    const t = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - t, 3)));
    if (t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    animateNumber(el, Number(el.dataset.from || 0), Number(el.dataset.count), 1600);
    countObserver.unobserve(el);
  });
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach((el) => {
  el.textContent = el.dataset.from || 0;
  countObserver.observe(el);
});

// ---------------------------------------------------------
// Bulles et ondes dans le grand bandeau d'accueil
// ---------------------------------------------------------
const hero = document.getElementById('hero');
if (hero && !reduceMotion) {
  const bubbles = document.getElementById('bubbles');
  const rand = (min, max) => min + Math.random() * (max - min);
  for (let i = 0; i < (isMobile() ? 10 : 18); i++) {
    const b = document.createElement('span');
    const size = rand(6, 22);
    b.className = 'bubble';
    b.style.cssText = `left:${rand(0, 100)}%;width:${size}px;height:${size}px;` +
      `--dur:${rand(9, 19)}s;--delay:${-rand(0, 19)}s;--sway:${rand(-40, 40)}px`;
    bubbles.appendChild(b);
  }

  hero.addEventListener('pointerdown', (e) => {
    if (e.target.closest('a, button')) return;
    const rect = hero.getBoundingClientRect();
    const r = document.createElement('span');
    r.className = 'ripple';
    r.style.left = e.clientX - rect.left + 'px';
    r.style.top = e.clientY - rect.top + 'px';
    hero.appendChild(r);
    r.addEventListener('animationend', () => r.remove());
  });
}

// ---------------------------------------------------------
// Page Adhérer : choix du nageur, du groupe et des séances
// ---------------------------------------------------------
const join = { who: 'enfant', group: null, sessions: null, price: 0 };
const groupById = Object.fromEntries(GROUPS.map((g) => [g.id, g]));
const choicesBox = document.getElementById('choices');

function payLink() {
  return CLUB.payLinks[join.group] || CLUB.payLinks.default;
}

function priceRange(prices) {
  const values = Object.values(prices);
  const min = Math.min(...values);
  const max = Math.max(...values);
  return min === max ? euro(min) : `${min} – ${max} €`;
}

if (choicesBox) {
  const tabs = document.querySelectorAll('.tab');
  const helpBox = document.getElementById('join-help');
  const summary = document.getElementById('summary');

  const setWho = (who) => {
    join.who = who;
    join.group = null;
    tabs.forEach((t) => t.setAttribute('aria-selected', String(t.dataset.tab === who)));
    choicesBox.innerHTML = GROUPS.filter((g) => g.who === who).map((g) =>
      `<button type="button" class="choice" role="radio" aria-checked="false" data-choice="${g.id}" aria-label="${g.name}, ${priceRange(g.prices)}">` +
        `<span class="choice__tag">${g.name}</span>` +
        `<span class="choice__who">${g.forWho}</span>` +
        `<span class="choice__price">${priceRange(g.prices)} <small>/ saison</small></span>` +
      '</button>'
    ).join('');
    helpBox.innerHTML = who === 'enfant'
      ? 'Vous ne savez pas quel groupe choisir ? <button type="button" class="link-btn" data-modal="test">Réservez une séance de test</button>, l\'éducateur oriente votre enfant.'
      : 'Pas sûr de votre niveau ? <button type="button" class="link-btn" data-modal="question">Posez-nous la question</button>, on vous conseille.';
    renderSummary();
  };

  const selectGroup = (id, scroll) => {
    const g = groupById[id];
    if (!g) return;
    if (g.who !== join.who) setWho(g.who);
    join.group = id;
    const counts = Object.keys(g.prices);
    join.sessions = counts[counts.length - 1];
    choicesBox.querySelectorAll('.choice').forEach((c) => c.setAttribute('aria-checked', String(c.dataset.choice === id)));
    renderSummary();
    // Sur téléphone, le récapitulatif est sous les choix : on y descend.
    if (scroll && isMobile()) {
      const top = summary.getBoundingClientRect().top + window.scrollY - 76;
      window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  };

  function renderSummary() {
    const empty = document.getElementById('s-empty');
    const full = document.getElementById('s-full');
    if (!join.group) { empty.hidden = false; full.hidden = true; join.price = 0; return; }

    const g = groupById[join.group];
    const isChild = g.who === 'enfant';
    empty.hidden = true;
    full.hidden = false;

    document.getElementById('s-name').textContent = g.name;
    document.getElementById('s-goal').textContent = g.goal;
    document.getElementById('s-sessions').innerHTML = Object.keys(g.prices).map((n) =>
      `<button type="button" class="sess" role="radio" aria-checked="${n === join.sessions}" data-sess="${n}">${SESSION_LABELS[n]}</button>`
    ).join('');
    const newPrice = g.prices[join.sessions];
    animateNumber(document.getElementById('s-price'), join.price, newPrice, 450);
    join.price = newPrice;
    document.getElementById('s-slots').innerHTML = g.slots.map(slotHtml).join('');

    const hasPay = Boolean(payLink());
    document.getElementById('s-note').textContent = isChild
      ? "Nouveau nageur ? Une séance de test confirme d'abord le groupe. Les tests ont lieu en mai, et en cours d'année s'il reste des places."
      : hasPay
        ? 'Paiement sécurisé par carte sur HelloAsso. Vous recevez la confirmation par e-mail.'
        : "Envoyez votre demande : le club vous recontacte pour finaliser l'adhésion.";

    const joinBtn = (cls) => hasPay
      ? `<a href="${payLink()}" class="btn ${cls}" target="_blank" rel="noopener">Payer l'adhésion</a>`
      : `<button type="button" class="btn ${cls}" data-modal="adhesion">Demander l'adhésion</button>`;
    document.getElementById('s-actions').innerHTML = isChild
      ? '<button type="button" class="btn btn--pink btn--glow" data-modal="test">Réserver un test</button>' + joinBtn('btn--outline')
      : joinBtn('btn--pink btn--glow') + '<button type="button" class="btn btn--outline" data-modal="question">Poser une question</button>';
  }

  tabs.forEach((t) => t.addEventListener('click', () => setWho(t.dataset.tab)));
  document.getElementById('adherer').addEventListener('click', (e) => {
    const choice = e.target.closest('[data-choice]');
    const sess = e.target.closest('[data-sess]');
    if (choice) selectGroup(choice.dataset.choice, true);
    if (sess) { join.sessions = sess.dataset.sess; renderSummary(); }
  });

  setWho('enfant');
  // Arrivée depuis « Choisir ce groupe » : adherer.html?groupe=en1
  const preselect = new URLSearchParams(location.search).get('groupe');
  if (preselect) selectGroup(preselect, true);
}

// ---------------------------------------------------------
// Fenêtre de demande : séance de test, adhésion ou question.
// Le message est préparé puis envoyé par SMS ou WhatsApp au club.
// ---------------------------------------------------------
const modal = document.getElementById('modal');
const form = document.getElementById('modal-form');
let modalType = 'test';

const MODAL_TEXT = {
  test: { kicker: 'École de natation', title: 'Réserver une séance de test', intro: 'Bonjour, je souhaite réserver une séance de test au Celtic Marseille Natation.' },
  adhesion: { kicker: 'Adhésion', title: "Demander l'adhésion", intro: 'Bonjour, je souhaite adhérer au Celtic Marseille Natation.' },
  question: { kicker: 'Contact', title: 'Envoyer un message', intro: "Bonjour, j'ai une question pour le Celtic Marseille Natation." },
};

function currentChoice() {
  if (!join.group) return '';
  return `${groupById[join.group].name} · ${SESSION_LABELS[join.sessions]} · ${euro(join.price)}`;
}

function openModal(type) {
  modalType = type;
  const text = MODAL_TEXT[type];
  const forChild = type === 'test' || (join.group ? groupById[join.group].who === 'enfant' : join.who === 'enfant');
  const showAge = type !== 'question' && forChild;
  const choice = type === 'question' ? '' : currentChoice();

  form.reset();
  document.getElementById('m-fields').hidden = false;
  document.getElementById('m-done').hidden = true;
  document.getElementById('m-kicker').textContent = text.kicker;
  document.getElementById('m-title').textContent = text.title;
  document.getElementById('m-recap').textContent = choice
    ? (type === 'test' ? 'Groupe envisagé : ' : 'Groupe choisi : ') + choice : '';
  document.getElementById('m-name-label').textContent = type === 'question'
    ? 'Votre nom' : forChild ? "Nom et prénom de l'enfant" : 'Votre nom et prénom';
  document.getElementById('f-age').hidden = !showAge;
  document.getElementById('m-age').required = showAge;
  document.getElementById('m-msg').required = type === 'question';
  document.querySelector('label[for="m-msg"] .optional').hidden = type === 'question';

  modal.showModal();
  document.body.classList.add('modal-open');
  if (!isTouch) document.getElementById('m-name').focus();
}

function buildMessage() {
  const data = new FormData(form);
  const lines = [MODAL_TEXT[modalType].intro, ''];
  lines.push(`${document.getElementById('m-name-label').textContent} : ${data.get('name').trim()}`);
  if (!document.getElementById('f-age').hidden && data.get('age')) lines.push(`Âge : ${data.get('age')} ans`);
  if (modalType !== 'question' && currentChoice()) lines.push(`Groupe : ${currentChoice()}`);
  lines.push(`Téléphone : ${data.get('tel').trim()}`);
  if (data.get('msg').trim()) lines.push('', data.get('msg').trim());
  return lines.join('\n');
}

document.addEventListener('click', (e) => {
  const opener = e.target.closest('[data-modal]');
  if (opener) { e.preventDefault(); openModal(opener.dataset.modal); }
  if (e.target.closest('[data-close]')) modal.close();
});
modal.addEventListener('click', (e) => { if (e.target === modal) modal.close(); });
modal.addEventListener('close', () => document.body.classList.remove('modal-open'));

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!form.reportValidity()) return;
  const via = e.submitter && e.submitter.dataset.via === 'wa' ? 'wa' : 'sms';
  const text = encodeURIComponent(buildMessage());

  if (via === 'wa') window.open(`https://wa.me/${CLUB.phone.whatsapp}?text=${text}`, '_blank', 'noopener');
  else window.location.href = `sms:${CLUB.phone.sms}?&body=${text}`;

  document.getElementById('m-done-text').textContent = via === 'wa'
    ? "Votre message est prêt dans WhatsApp : il ne reste qu'à appuyer sur Envoyer. Le club vous recontacte rapidement."
    : `Votre message est prêt dans l'application SMS : il ne reste qu'à appuyer sur Envoyer. Si rien ne s'est ouvert, utilisez WhatsApp ou appelez le ${CLUB.phone.display}.`;
  document.getElementById('m-fields').hidden = true;
  document.getElementById('m-done').hidden = false;
});

document.getElementById('year').textContent = new Date().getFullYear();
