// Lemon Score — сайт. Без сборки: чистый JS, данные из Supabase (RPC), обложки с серверов Amazon.
(() => {
  'use strict';
  const CFG = window.LEMON_CONFIG;
  const VERDICTS = ['likely_human', 'mixed', 'suspicious'];

  // ------------------------------------------------------------------ i18n
  const I18N = {
    en: {
      navBooks: 'Books',
      navAuthors: 'Authors',
      heroTitle: 'Was this coloring book drawn by a human?',
      heroText: 'Readers with the Lemon Score extension rate coloring books on Amazon for signs of AI art. These are all the books rated so far.',
      install: 'Install the extension',
      installNote: 'to rate books right on Amazon and see your ratings here.',
      footer: 'Ratings are opinions of Lemon Score users, not Amazon. Covers and links lead to Amazon.',
      skip: 'Skip to books',
      all: 'All',
      v_likely_human: 'Likely not AI',
      v_mixed: 'Disputed',
      v_suspicious: 'Suspected AI',
      mine: 'Rated by me',
      search: 'Search by title, author or ASIN',
      searchAuthors: 'Search authors',
      sortLabel: 'Sort',
      s_recent: 'Recently rated',
      s_most_rated: 'Most ratings',
      s_most_ai: 'Most AI-like first',
      s_least_ai: 'Least AI-like first',
      store: 'Store',
      allStores: 'All stores',
      ratings: { one: '{n} rating', other: '{n} ratings' },
      books: { one: '{n} book', other: '{n} books' },
      few: 'few ratings',
      notAi: 'Not AI',
      yourRating: 'You',
      yourRatingLong: 'Your rating: {s} of 5',
      yourRatingZero: 'Your rating: not AI',
      untitled: 'Untitled book',
      unknownAuthor: 'Author unknown',
      openAmazon: 'Open on Amazon',
      loadMore: 'Show more books',
      loading: 'Loading…',
      errLoad: 'Couldn’t load data from the Lemon Score server.',
      retry: 'Try again',
      emptyBooks: 'No rated books match these filters.',
      emptyMine: 'You haven’t rated any books yet. Open a coloring book on Amazon and rate it in the Lemon Score panel.',
      needExt: 'Install the Lemon Score extension to see the books you rated.',
      extOn: { one: 'You rated {n} book', other: 'You rated {n} books' },
      extOnZero: 'Extension connected',
      extReload: 'Reload the page to reconnect the extension',
      authorsTitle: 'Authors',
      authorsText: 'Authors whose coloring books have been rated, with how readers judged each of their books.',
      emptyAuthors: 'No authors found.',
      avgScore: 'Average AI score {s} of 5',
      authorBooks: 'Books by this author',
      authorNotFound: 'This author has no rated books yet.',
      backToAuthors: 'All authors',
      distLabel: 'Books by verdict',
      showing: 'Showing {a} of {b}',
    },
    ru: {
      navBooks: 'Книги',
      navAuthors: 'Авторы',
      heroTitle: 'Эту раскраску нарисовал человек?',
      heroText: 'Пользователи расширения Lemon Score оценивают раскраски на Amazon: есть ли в них признаки ИИ. Здесь все книги, которые уже оценили.',
      install: 'Установить расширение',
      installNote: 'чтобы оценивать книги прямо на Amazon и видеть свои оценки здесь.',
      footer: 'Оценки — мнение пользователей Lemon Score, а не Amazon. Обложки и ссылки ведут на Amazon.',
      skip: 'К списку книг',
      all: 'Все',
      v_likely_human: 'Скорее не ИИ',
      v_mixed: 'Спорно',
      v_suspicious: 'Подозрение на ИИ',
      mine: 'Мои оценки',
      search: 'Поиск по названию, автору или ASIN',
      searchAuthors: 'Поиск автора',
      sortLabel: 'Порядок',
      s_recent: 'Недавно оценённые',
      s_most_rated: 'Больше всего оценок',
      s_most_ai: 'Сначала похожие на ИИ',
      s_least_ai: 'Сначала непохожие на ИИ',
      store: 'Магазин',
      allStores: 'Все магазины',
      ratings: { one: '{n} оценка', few: '{n} оценки', many: '{n} оценок', other: '{n} оценки' },
      books: { one: '{n} книга', few: '{n} книги', many: '{n} книг', other: '{n} книги' },
      few: 'мало оценок',
      notAi: 'Не ИИ',
      yourRating: 'Вы',
      yourRatingLong: 'Ваша оценка: {s} из 5',
      yourRatingZero: 'Ваша оценка: не ИИ',
      untitled: 'Без названия',
      unknownAuthor: 'Автор неизвестен',
      openAmazon: 'Открыть на Amazon',
      loadMore: 'Показать ещё',
      loading: 'Загрузка…',
      errLoad: 'Не удалось получить данные с сервера Lemon Score.',
      retry: 'Повторить',
      emptyBooks: 'Под эти фильтры не подходит ни одна оценённая книга.',
      emptyMine: 'Вы пока не оценили ни одной книги. Откройте раскраску на Amazon и оцените её в блоке Lemon Score.',
      needExt: 'Установите расширение Lemon Score, чтобы видеть книги, которые вы оценили.',
      extOn: { one: 'Вы оценили {n} книгу', few: 'Вы оценили {n} книги', many: 'Вы оценили {n} книг', other: 'Вы оценили {n} книги' },
      extOnZero: 'Расширение подключено',
      extReload: 'Перезагрузите страницу, чтобы снова подключить расширение',
      authorsTitle: 'Авторы',
      authorsText: 'Авторы оценённых раскрасок и то, как читатели оценили каждую их книгу.',
      emptyAuthors: 'Авторы не найдены.',
      avgScore: 'Средняя оценка ИИ {s} из 5',
      authorBooks: 'Книги автора',
      authorNotFound: 'У этого автора пока нет оценённых книг.',
      backToAuthors: 'Все авторы',
      distLabel: 'Книги по вердиктам',
      showing: 'Показано {a} из {b}',
    },
  };
  const readLang = () => {
    try {
      const saved = localStorage.getItem('lemon-lang');
      if (saved === 'ru' || saved === 'en') return saved;
    } catch {
      /* хранилище недоступно — берём язык браузера */
    }
    return (navigator.language || 'en').toLowerCase().startsWith('ru') ? 'ru' : 'en';
  };
  let LANG = readLang();
  const t = (k) => I18N[LANG][k] ?? I18N.en[k] ?? k;
  const tf = (k, vars) => Object.entries(vars).reduce((s, [a, b]) => s.replace('{' + a + '}', b), t(k));
  const plural = (k, n) => {
    const forms = I18N[LANG][k];
    return (forms[new Intl.PluralRules(LANG).select(n)] || forms.other).replace('{n}', n.toLocaleString(LANG));
  };
  const fmt = (x) => Number(x).toLocaleString(LANG, { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  // --------------------------------------------------------------- helpers
  const h = (tag, props, ...children) => {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(props || {})) {
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'style') el.style.cssText = v;
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : String(v));
    }
    for (const c of children.flat(Infinity)) {
      if (c == null || c === false) continue;
      el.append(c.nodeType ? c : document.createTextNode(String(c)));
    }
    return el;
  };
  const svgNS = 'http://www.w3.org/2000/svg';
  const lemon = (on, cls = '') => {
    const s = document.createElementNS(svgNS, 'svg');
    s.setAttribute('viewBox', '0 0 32 32');
    s.setAttribute('class', `lemon ${on ? 'on' : 'off'} ${cls}`.trim());
    s.setAttribute('aria-hidden', 'true');
    const u = document.createElementNS(svgNS, 'use');
    u.setAttribute('href', '#lemon');
    s.append(u);
    return s;
  };
  const meter = (filled, label) =>
    h('span', { class: 'meter', role: 'img', 'aria-label': label }, [1, 2, 3, 4, 5].map((i) => lemon(i <= filled)));

  const amazonUrl = (mp, asin) => `https://www.amazon.${mp}/dp/${encodeURIComponent(asin)}`;
  const MARKETPLACES = ['com', 'co.uk', 'de', 'fr', 'it', 'es', 'ca', 'com.au', 'co.jp', 'in', 'com.br', 'com.mx', 'nl', 'se', 'pl'];

  // ------------------------------------------------------------------- API
  const rpc = async (fn, body) => {
    const headers = { 'Content-Type': 'application/json', apikey: CFG.SUPABASE_KEY };
    if (CFG.SUPABASE_KEY.startsWith('eyJ')) headers.Authorization = `Bearer ${CFG.SUPABASE_KEY}`;
    const res = await fetch(`${CFG.SUPABASE_URL.replace(/\/+$/, '')}/rest/v1/rpc/${fn}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body || {}),
    });
    if (!res.ok) throw new Error(`http_${res.status}`);
    return res.json();
  };

  // ------------------------------------------------- мостик к расширению
  // Расширение подключает к сайту site-bridge.js и отвечает на postMessage.
  // Так сайт узнаёт, какие книги оценило это устройство, не видя его ID.
  const ext = { installed: false, version: null, ratings: new Map(), error: null };
  let reqSeq = 0;
  const askExtension = (type, timeoutMs) =>
    new Promise((resolve) => {
      const id = `${Date.now()}-${++reqSeq}`;
      const onMsg = (e) => {
        if (e.source !== window || !e.data || e.data.source !== 'lemon-score-extension' || e.data.id !== id) return;
        window.removeEventListener('message', onMsg);
        clearTimeout(timer);
        resolve(e.data);
      };
      const timer = setTimeout(() => {
        window.removeEventListener('message', onMsg);
        resolve(null);
      }, timeoutMs);
      window.addEventListener('message', onMsg);
      window.postMessage({ source: 'lemon-score-site', type, id }, location.origin);
    });

  const loadMyRatings = async () => {
    const pong = await askExtension('ping', 1200);
    ext.installed = !!pong || document.documentElement.hasAttribute('data-lemon-score-extension');
    if (!ext.installed) return;
    ext.version = pong?.version || document.documentElement.getAttribute('data-lemon-score-extension');
    const resp = await askExtension('getMyRatings', 12000);
    if (resp?.ok) {
      ext.ratings = new Map(resp.ratings.map((r) => [`${r.marketplace}:${r.asin}`, r.ai_score]));
      ext.error = null;
    } else {
      ext.error = resp?.error || 'timeout';
    }
  };

  // ---------------------------------------------------------------- router
  // #/                     — все книги
  // #/author/<ключ>        — книги автора
  // #/authors              — список авторов
  // параметры: ?v=verdict&q=поиск&sort=...&mp=de&mine=1
  const parseHash = () => {
    const raw = location.hash.replace(/^#/, '') || '/';
    const [path, qs] = raw.split('?');
    const params = new URLSearchParams(qs || '');
    const parts = path.split('/').filter(Boolean);
    if (parts[0] === 'author' && parts[1]) return { view: 'author', key: decodeURIComponent(parts.slice(1).join('/')), params };
    if (parts[0] === 'authors') return { view: 'authors', params };
    return { view: 'books', params };
  };
  const buildHash = (view, key, params) => {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v) qs.set(k, v);
    const base = view === 'author' ? `#/author/${encodeURIComponent(key)}` : view === 'authors' ? '#/authors' : '#/';
    const s = qs.toString();
    return s ? `${base}?${s}` : base;
  };
  const authorHref = (key) => buildHash('author', key, {});

  // -------------------------------------------------------------- shell UI
  const $view = document.getElementById('view');
  const $hero = document.getElementById('hero');
  const applyStaticText = () => {
    document.documentElement.lang = LANG;
    for (const el of document.querySelectorAll('[data-i18n]')) el.textContent = t(el.dataset.i18n);
    document.querySelector('.skip').textContent = t('skip');
    const btn = document.getElementById('langBtn');
    btn.textContent = LANG === 'ru' ? 'EN' : 'RU';
    btn.setAttribute('aria-label', LANG === 'ru' ? 'Switch to English' : 'Переключить на русский');
    document.getElementById('installLink').href = CFG.INSTALL_URL;
  };
  const renderExtStatus = () => {
    const chip = document.getElementById('extStatus');
    document.getElementById('heroCta').hidden = ext.installed;
    if (!ext.installed) {
      chip.hidden = true;
      return;
    }
    chip.hidden = false;
    chip.replaceChildren(lemon(true, 'chip-lemon'));
    if (ext.error === 'context') chip.append(t('extReload'));
    else if (ext.ratings.size) chip.append(plural('extOn', ext.ratings.size));
    else chip.append(t('extOnZero'));
  };
  const setNav = (view) => {
    for (const a of document.querySelectorAll('[data-nav]')) {
      const on = a.dataset.nav === (view === 'author' ? 'authors' : view);
      if (on) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    }
  };

  const errorBox = (onRetry) =>
    h('div', { class: 'notice err', role: 'alert' }, h('p', {}, t('errLoad')), h('button', { class: 'btn ghost', type: 'button', onclick: onRetry }, t('retry')));

  // ------------------------------------------------------------ book card
  const coverEl = (b) => {
    const wrap = h('a', { class: 'cover', href: amazonUrl(b.marketplace, b.asin), target: '_blank', rel: 'noopener', 'aria-label': `${b.title || t('untitled')} — ${t('openAmazon')}` });
    const placeholder = () =>
      wrap.replaceChildren(...[h('span', { class: 'cover-blank' }, lemon(false, 'big'), h('span', { class: 'cover-asin' }, b.asin)), mineBadge(b)].filter(Boolean));
    // Нет сохранённой обложки — пробуем старый адрес картинки Amazon по ASIN (работает для многих бумажных книг).
    const src = b.cover_url || `https://images-na.ssl-images-amazon.com/images/P/${encodeURIComponent(b.asin)}.01.LZZZZZZZ.jpg`;
    const img = h('img', { src, alt: '', loading: 'lazy', decoding: 'async', referrerpolicy: 'no-referrer' });
    img.addEventListener('error', placeholder, { once: true });
    img.addEventListener('load', () => {
      if (img.naturalWidth < 20) placeholder(); // Amazon отвечает прозрачной точкой 1×1, если картинки нет
    }, { once: true });
    wrap.append(...[img, mineBadge(b)].filter(Boolean));
    return wrap;
  };
  const mineBadge = (b) => {
    const s = ext.ratings.get(`${b.marketplace}:${b.asin}`);
    if (s == null) return null;
    const label = s === 0 ? t('yourRatingZero') : tf('yourRatingLong', { s });
    return h('span', { class: 'mine-badge', title: label, 'aria-label': label }, `${t('yourRating')}: `, s === 0 ? t('notAi').toLowerCase() : [String(s), lemon(true, 'tiny')]);
  };
  const bookCard = (b) => {
    const avg = Number(b.avg_ai);
    const title = b.title || t('untitled');
    return h(
      'li',
      { class: 'book' },
      coverEl(b),
      h(
        'div',
        { class: 'book-body' },
        h('h3', { class: 'book-title' }, h('a', { href: amazonUrl(b.marketplace, b.asin), target: '_blank', rel: 'noopener', title }, title)),
        b.author_key
          ? h('a', { class: 'book-author', href: authorHref(b.author_key) }, b.author)
          : h('span', { class: 'book-author muted' }, t('unknownAuthor')),
        h(
          'div',
          { class: 'score' },
          meter(Math.round(avg), tf('avgScore', { s: fmt(avg) })),
          h('span', { class: 'score-num' }, fmt(avg))
        ),
        h(
          'div',
          { class: 'book-meta' },
          h('span', { class: 'pill ' + b.verdict }, t('v_' + b.verdict)),
          h('span', { class: 'muted' }, plural('ratings', b.ratings_count), b.few_ratings ? `, ${t('few')}` : '', b.marketplace !== 'com' ? `, amazon.${b.marketplace}` : '')
        )
      )
    );
  };

  // ---------------------------------------------------------- books list
  // Общий блок «фильтры + сетка книг» для главной и для страницы автора.
  const booksBrowser = (route, authorKey) => {
    const p = route.params;
    const state = {
      v: VERDICTS.includes(p.get('v')) ? p.get('v') : '',
      q: (p.get('q') || '').slice(0, 100),
      sort: ['recent', 'most_rated', 'most_ai', 'least_ai'].includes(p.get('sort')) ? p.get('sort') : 'recent',
      mp: MARKETPLACES.includes(p.get('mp')) ? p.get('mp') : '',
      mine: p.get('mine') === '1',
    };
    const view = authorKey ? 'author' : 'books';
    const syncHash = () => {
      const next = buildHash(view, authorKey, { v: state.v, q: state.q, sort: state.sort === 'recent' ? '' : state.sort, mp: state.mp, mine: state.mine ? '1' : '' });
      if (next !== location.hash) history.replaceState(null, '', next);
    };

    const root = h('section', { class: 'browser', 'aria-label': t('navBooks') });
    const tabs = h('div', { class: 'tabs', role: 'group', 'aria-label': t('distLabel') });
    const search = h('input', { class: 'search', type: 'search', placeholder: t('search'), 'aria-label': t('search'), value: state.q, maxlength: 100 });
    const sort = h(
      'select',
      { class: 'select', 'aria-label': t('sortLabel') },
      ['recent', 'most_rated', 'most_ai', 'least_ai'].map((s) => h('option', { value: s, selected: s === state.sort }, t('s_' + s)))
    );
    const mp = h(
      'select',
      { class: 'select', 'aria-label': t('store') },
      h('option', { value: '' }, t('allStores')),
      MARKETPLACES.map((m) => h('option', { value: m, selected: m === state.mp }, 'amazon.' + m))
    );
    const grid = h('ul', { class: 'grid', 'aria-live': 'polite' });
    const footer = h('div', { class: 'grid-foot' });
    root.append(h('div', { class: 'filters' }, tabs, h('div', { class: 'filters-row' }, search, sort, mp)), grid, footer);

    let counts = null;
    let loaded = 0;
    let total = 0;
    let token = 0;

    const keysForMine = () => (state.mine ? [...ext.ratings.keys()] : null);

    const renderTabs = () => {
      const totalAll = counts ? VERDICTS.reduce((s, v) => s + (counts[v] || 0), 0) : null;
      const tab = (value, label, n, extra = '') =>
        h(
          'button',
          {
            class: 'tab ' + extra + (value ? ' t-' + value : ''),
            type: 'button',
            'aria-pressed': String(state.v === value),
            onclick: () => {
              state.v = value;
              reload();
            },
          },
          value ? h('span', { class: 'dot', 'aria-hidden': 'true' }) : null,
          label,
          n != null ? h('span', { class: 'tab-n' }, n.toLocaleString(LANG)) : null
        );
      const mineBtn = h(
        'button',
        {
          class: 'tab mine',
          type: 'button',
          'aria-pressed': String(state.mine),
          onclick: () => {
            state.mine = !state.mine;
            reload();
          },
        },
        lemon(state.mine, 'tiny'),
        t('mine'),
        ext.installed ? h('span', { class: 'tab-n' }, ext.ratings.size.toLocaleString(LANG)) : null
      );
      tabs.replaceChildren(
        tab('', t('all'), totalAll, ''),
        ...VERDICTS.map((v) => tab(v, t('v_' + v), counts ? counts[v] || 0 : null)),
        h('span', { class: 'tabs-gap', 'aria-hidden': 'true' }),
        mineBtn
      );
    };

    const fetchPage = async (my) => {
      const keys = keysForMine();
      return rpc('list_books', {
        p_verdict: state.v || null,
        p_author_key: authorKey || null,
        p_marketplace: state.mp || null,
        p_search: state.q || null,
        p_sort: state.sort,
        p_limit: CFG.PAGE_SIZE,
        p_offset: loaded,
        p_keys: keys,
      }).then((rows) => (my === token ? rows : null));
    };

    const renderFoot = () => {
      footer.replaceChildren();
      if (total > loaded) {
        footer.append(
          h('p', { class: 'muted' }, tf('showing', { a: loaded.toLocaleString(LANG), b: total.toLocaleString(LANG) })),
          h('button', { class: 'btn ghost', type: 'button', onclick: more }, t('loadMore'))
        );
      }
    };

    const more = async () => {
      const my = token;
      footer.replaceChildren(h('p', { class: 'muted' }, t('loading')));
      try {
        const rows = await fetchPage(my);
        if (!rows) return;
        rows.forEach((b) => grid.append(bookCard(b)));
        loaded += rows.length;
        renderFoot();
      } catch {
        footer.replaceChildren(errorBox(more));
      }
    };

    const reload = async () => {
      const my = ++token;
      syncHash();
      loaded = 0;
      total = 0;
      renderTabs();
      grid.replaceChildren();
      footer.replaceChildren(h('p', { class: 'muted' }, t('loading')));
      grid.setAttribute('aria-busy', 'true');

      if (state.mine && !ext.installed) {
        grid.removeAttribute('aria-busy');
        footer.replaceChildren(h('div', { class: 'notice' }, h('p', {}, t('needExt')), h('a', { class: 'btn', href: CFG.INSTALL_URL, target: '_blank', rel: 'noopener' }, t('install'))));
        counts = null;
        renderTabs();
        return;
      }
      if (state.mine && ext.ratings.size === 0) {
        grid.removeAttribute('aria-busy');
        footer.replaceChildren(h('div', { class: 'notice' }, h('p', {}, t('emptyMine'))));
        counts = { likely_human: 0, mixed: 0, suspicious: 0 };
        renderTabs();
        return;
      }
      try {
        const [rows, countRows] = await Promise.all([
          fetchPage(my),
          rpc('count_books', { p_author_key: authorKey || null, p_marketplace: state.mp || null, p_search: state.q || null, p_keys: keysForMine() }),
        ]);
        if (my !== token || !rows) return;
        counts = Object.fromEntries(countRows.map((r) => [r.verdict, r.books]));
        renderTabs();
        grid.removeAttribute('aria-busy');
        total = rows[0] ? Number(rows[0].total_count) : 0;
        rows.forEach((b) => grid.append(bookCard(b)));
        loaded = rows.length;
        if (!rows.length) footer.replaceChildren(h('div', { class: 'notice' }, h('p', {}, state.mine ? t('emptyMine') : t('emptyBooks'))));
        else renderFoot();
      } catch {
        if (my !== token) return;
        grid.removeAttribute('aria-busy');
        footer.replaceChildren(errorBox(reload));
      }
    };

    let debounce = null;
    search.addEventListener('input', () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        state.q = search.value.trim().slice(0, 100);
        reload();
      }, 300);
    });
    sort.addEventListener('change', () => {
      state.sort = sort.value;
      reload();
    });
    mp.addEventListener('change', () => {
      state.mp = mp.value;
      reload();
    });

    reload();
    return { root, refresh: reload };
  };

  // ------------------------------------------------- распределение вердиктов
  const distBar = (a) => {
    const seg = (cls, n) => (n ? h('span', { class: 'seg ' + cls, style: `flex-grow:${n}`, title: `${t('v_' + cls)}: ${n}` }) : null);
    return h(
      'div',
      { class: 'dist', role: 'img', 'aria-label': `${t('distLabel')}: ${VERDICTS.map((v) => `${t('v_' + v)} ${a[{ likely_human: 'human_books', mixed: 'mixed_books', suspicious: 'suspicious_books' }[v]]}`).join(', ')}` },
      seg('likely_human', a.human_books),
      seg('mixed', a.mixed_books),
      seg('suspicious', a.suspicious_books)
    );
  };
  const distLegend = (a) =>
    h(
      'ul',
      { class: 'legend' },
      [
        ['likely_human', a.human_books],
        ['mixed', a.mixed_books],
        ['suspicious', a.suspicious_books],
      ].map(([v, n]) => h('li', {}, h('span', { class: 'dot d-' + v, 'aria-hidden': 'true' }), `${t('v_' + v)}: ${n}`))
    );

  // ----------------------------------------------------------------- views
  let current = null;

  const showBooks = (route) => {
    $hero.hidden = false;
    current = booksBrowser(route, null);
    $view.replaceChildren(current.root);
  };

  const showAuthor = async (route) => {
    $hero.hidden = true;
    const head = h('header', { class: 'page-head' }, h('a', { class: 'back', href: '#/authors' }, t('backToAuthors')), h('h1', { class: 'page-title' }, '…'));
    $view.replaceChildren(head);
    let a;
    try {
      [a] = await rpc('list_authors', { p_author_key: route.key, p_limit: 1 });
    } catch {
      $view.replaceChildren(head, errorBox(() => showAuthor(route)));
      return;
    }
    if (!a) {
      head.querySelector('.page-title').textContent = route.key;
      $view.replaceChildren(head, h('div', { class: 'notice' }, h('p', {}, t('authorNotFound'))));
      return;
    }
    document.title = `${a.author} — Lemon Score`;
    head.replaceChildren(
      h('a', { class: 'back', href: '#/authors' }, t('backToAuthors')),
      h('h1', { class: 'page-title' }, a.author),
      h(
        'p',
        { class: 'author-stats' },
        h('span', {}, plural('books', a.books_count)),
        h('span', {}, plural('ratings', a.ratings_count)),
        h('span', { class: 'score' }, meter(Math.round(Number(a.avg_ai)), tf('avgScore', { s: fmt(a.avg_ai) })), h('span', { class: 'score-num' }, fmt(a.avg_ai)))
      ),
      distBar(a),
      distLegend(a)
    );
    current = booksBrowser(route, a.author_key);
    $view.replaceChildren(head, h('h2', { class: 'section-title' }, t('authorBooks')), current.root);
  };

  const showAuthors = (route) => {
    $hero.hidden = true;
    document.title = `${t('authorsTitle')} — Lemon Score`;
    const q0 = (route.params.get('q') || '').slice(0, 100);
    const search = h('input', { class: 'search', type: 'search', placeholder: t('searchAuthors'), 'aria-label': t('searchAuthors'), value: q0, maxlength: 100 });
    const list = h('ul', { class: 'authors', 'aria-live': 'polite' });
    const foot = h('div', { class: 'grid-foot' });
    $view.replaceChildren(
      h('header', { class: 'page-head' }, h('h1', { class: 'page-title' }, t('authorsTitle')), h('p', { class: 'page-text' }, t('authorsText'))),
      h('div', { class: 'filters' }, h('div', { class: 'filters-row' }, search)),
      list,
      foot
    );
    let offset = 0;
    let total = 0;
    let token = 0;
    const row = (a) =>
      h(
        'li',
        { class: 'author-row' },
        h('a', { class: 'author-name', href: authorHref(a.author_key) }, a.author),
        h('span', { class: 'muted' }, plural('books', a.books_count), ', ', plural('ratings', a.ratings_count)),
        h('span', { class: 'score' }, meter(Math.round(Number(a.avg_ai)), tf('avgScore', { s: fmt(a.avg_ai) })), h('span', { class: 'score-num' }, fmt(a.avg_ai))),
        distBar(a)
      );
    const load = async (reset) => {
      const my = reset ? ++token : token;
      const q = search.value.trim();
      if (reset) {
        offset = 0;
        list.replaceChildren();
        const next = buildHash('authors', null, { q });
        if (next !== location.hash) history.replaceState(null, '', next);
      }
      foot.replaceChildren(h('p', { class: 'muted' }, t('loading')));
      try {
        const rows = await rpc('list_authors', { p_search: q || null, p_limit: 50, p_offset: offset });
        if (my !== token) return;
        rows.forEach((a) => list.append(row(a)));
        offset += rows.length;
        total = rows[0] ? Number(rows[0].total_count) : reset ? 0 : total;
        foot.replaceChildren();
        if (!offset) foot.append(h('div', { class: 'notice' }, h('p', {}, t('emptyAuthors'))));
        else if (total > offset) foot.append(h('button', { class: 'btn ghost', type: 'button', onclick: () => load(false) }, t('loadMore')));
      } catch {
        if (my === token) foot.replaceChildren(errorBox(() => load(reset)));
      }
    };
    let deb = null;
    search.addEventListener('input', () => {
      clearTimeout(deb);
      deb = setTimeout(() => load(true), 300);
    });
    load(true);
  };

  let lastView = null;
  const route = () => {
    const r = parseHash();
    setNav(r.view);
    if (r.view === 'books') document.title = 'Lemon Score — ' + (LANG === 'ru' ? 'раскраски, оценённые на признаки ИИ' : 'coloring books rated for AI art');
    if (r.view !== lastView || r.view !== 'books') window.scrollTo(0, 0);
    lastView = r.view;
    if (r.view === 'author') showAuthor(r);
    else if (r.view === 'authors') showAuthors(r);
    else showBooks(r);
  };

  // ------------------------------------------------------------------ start
  document.getElementById('langBtn').addEventListener('click', () => {
    LANG = LANG === 'ru' ? 'en' : 'ru';
    try {
      localStorage.setItem('lemon-lang', LANG);
    } catch {
      /* не сохранится между визитами — не страшно */
    }
    applyStaticText();
    renderExtStatus();
    route();
  });
  window.addEventListener('hashchange', route);
  // Расширение могло загрузиться после сайта — тогда оно само пришлёт 'ready'.
  window.addEventListener('message', (e) => {
    if (e.source === window && e.data?.source === 'lemon-score-extension' && e.data.type === 'ready' && !ext.installed) {
      loadMyRatings().then(() => {
        renderExtStatus();
        current?.refresh();
      });
    }
  });

  applyStaticText();
  route(); // книги показываем сразу, не дожидаясь расширения
  loadMyRatings().then(() => {
    renderExtStatus();
    if (ext.installed) current?.refresh(); // перерисовать с отметками «Вы оценили» и счётчиком «Мои оценки»
  });
})();
