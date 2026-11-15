// Lemon Score Wiki — раздел сайта. Подключается после app.js и получает от него помощники (h, rpc, lemon ...).
// Маршруты (все под #/wiki):
//   #/wiki                      главная вики
//   #/wiki/books?q=&style=      все книги
//   #/wiki/book/<ASIN>          страница книги
//   #/wiki/authors | series | publishers | styles          списки
//   #/wiki/author/<ключ> | series/<ключ> | publisher/<ключ> | style/<slug>   страницы
// Данные: функции wiki_* из supabase/wiki.sql. Все тексты выводятся через textContent (h()), HTML не вставляется.
(() => {
  'use strict';

  const STYLE_NAMES = {
    en: {
      'bold-and-easy': 'Bold & Easy', cozy: 'Cozy', 'kawaii-cute': 'Kawaii & Cute', mandala: 'Mandala', floral: 'Floral',
      animals: 'Animals', 'cats-dogs': 'Cats & Dogs', 'nature-landscapes': 'Nature & Landscapes', fantasy: 'Fantasy',
      'seasonal-holiday': 'Seasonal & Holiday', 'color-by-number': 'Color by Number', 'gothic-dark': 'Gothic & Dark',
      'anime-manga': 'Anime & Manga', 'food-drinks': 'Food & Drinks', 'vintage-retro': 'Vintage & Retro',
      'large-print': 'Large Print', 'stress-relief': 'Stress Relief', kids: 'Kids', 'teens-adults': 'Teens & Adults',
    },
    ru: {
      'bold-and-easy': 'Bold & Easy (крупные линии)', cozy: 'Уют (cozy)', 'kawaii-cute': 'Кавай и милое', mandala: 'Мандалы', floral: 'Цветы',
      animals: 'Животные', 'cats-dogs': 'Кошки и собаки', 'nature-landscapes': 'Природа и пейзажи', fantasy: 'Фэнтези',
      'seasonal-holiday': 'Сезонное и праздники', 'color-by-number': 'Раскраски по номерам', 'gothic-dark': 'Готика и мрачное',
      'anime-manga': 'Аниме и манга', 'food-drinks': 'Еда и напитки', 'vintage-retro': 'Винтаж и ретро',
      'large-print': 'Крупный формат', 'stress-relief': 'Антистресс', kids: 'Для детей', 'teens-adults': 'Подростки и взрослые',
    },
  };

  const S = {
    en: {
      wiki: 'Wiki', wikiTitle: 'Coloring Book Wiki',
      lead: 'A catalog of coloring books on Amazon: books, authors, series, publishers and styles. Data is collected from the pages Lemon Score users open, and each page shows the Lemon Score rating.',
      empty: 'The catalog is still empty. Run supabase/wiki.sql and the import files first.',
      searchBooks: 'Search books by title or author', search: 'Search',
      books: 'Books', authors: 'Authors', series: 'Series', publishers: 'Publishers', styles: 'Styles',
      nBooks: { one: '{n} book', other: '{n} books' },
      top: { authors: 'Authors with the most books', series: 'Biggest series', publishers: 'Publishers with the most books', styles: 'Styles' },
      newest: 'Newest releases', all: 'All', seeAll: 'See all',
      fullTitle: 'Full title on Amazon', back: 'Back to the Wiki', loadMore: 'Show more', retry: 'Retry', errLoad: 'Could not load data. Please try again.',
      notFound: 'Nothing found here yet.',
      untitled: '(untitled)', unknownAuthor: 'Author unknown',
      author: 'Author', publisher: 'Publisher', series: 'Series', published: 'Published', pages: 'Pages', size: 'Size',
      isbn13: 'ISBN-13', isbn10: 'ISBN-10', language: 'Language', rank: 'Best Sellers Rank', categories: 'Categories', styleLbl: 'Styles', asin: 'ASIN',
      bookOf: 'Book {n} of {m}', bookN: 'Book {n}', inSeries: 'In this series', moreByAuthor: 'More by this author', onAmazon: 'Open on Amazon',
      lemonTitle: 'Lemon Score', lemonNone: 'No Lemon Score ratings yet. Rate this book on Amazon with the extension.',
      lemonRatings: { one: '{n} rating', other: '{n} ratings' }, lemonAvg: 'average AI suspicion {s} of 5',
      stub: 'Only the basics are known so far. Open this book on Amazon with the Lemon Score extension to fill in the series, publisher and other details.',
      confirmed: { one: 'confirmed by {n} reader', other: 'confirmed by {n} readers' },
      ratedBooks: 'Books with ratings', avgAi: 'Average AI suspicion', detailed: 'with details',
      related: { author: 'Authors', publisher: 'Publishers', series: 'Series' },
      ofTotal: 'of {m} in the series',
      seriesTotalNote: 'The series has {m} books on Amazon, {n} of them are in the catalog.',
      sortNew: 'Newest first', sortTitle: 'By title', sortSeries: 'By number',
      footnote: 'Data comes from public Amazon pages opened by Lemon Score users. Covers and links lead to Amazon. This is not an official Amazon catalog.',
    },
    ru: {
      wiki: 'Вики', wikiTitle: 'Вики раскрасок',
      lead: 'Каталог раскрасок с Amazon: книги, авторы, серии, издатели и стили. Данные собираются со страниц, которые открывают пользователи Lemon Score, на каждой странице есть оценка Lemon Score.',
      empty: 'Каталог пока пуст. Сначала запустите supabase/wiki.sql и файлы импорта.',
      searchBooks: 'Поиск книг по названию или автору', search: 'Найти',
      books: 'Книги', authors: 'Авторы', series: 'Серии', publishers: 'Издатели', styles: 'Стили',
      nBooks: { one: '{n} книга', few: '{n} книги', many: '{n} книг', other: '{n} книги' },
      top: { authors: 'Авторы с наибольшим числом книг', series: 'Крупнейшие серии', publishers: 'Издатели с наибольшим числом книг', styles: 'Стили' },
      newest: 'Свежие выпуски', all: 'Все', seeAll: 'Смотреть все',
      fullTitle: 'Полное название на Amazon', back: 'Назад в вики', loadMore: 'Показать ещё', retry: 'Повторить', errLoad: 'Не удалось загрузить данные. Попробуйте ещё раз.',
      notFound: 'Здесь пока ничего нет.',
      untitled: '(без названия)', unknownAuthor: 'Автор неизвестен',
      author: 'Автор', publisher: 'Издатель', series: 'Серия', published: 'Дата выхода', pages: 'Страниц', size: 'Размер',
      isbn13: 'ISBN-13', isbn10: 'ISBN-10', language: 'Язык', rank: 'Рейтинг продаж', categories: 'Рубрики', styleLbl: 'Стили', asin: 'ASIN',
      bookOf: 'Книга {n} из {m}', bookN: 'Книга {n}', inSeries: 'Книги серии', moreByAuthor: 'Ещё книги автора', onAmazon: 'Открыть на Amazon',
      lemonTitle: 'Lemon Score', lemonNone: 'Оценок Lemon Score пока нет. Оцените эту книгу на Amazon с расширением.',
      lemonRatings: { one: '{n} оценка', few: '{n} оценки', many: '{n} оценок', other: '{n} оценки' }, lemonAvg: 'средняя «ИИ-шность» {s} из 5',
      stub: 'Пока известны только основные данные. Откройте эту книгу на Amazon с расширением Lemon Score, чтобы заполнились серия, издатель и остальное.',
      confirmed: { one: 'подтверждено {n} читателем', few: 'подтверждено {n} читателями', many: 'подтверждено {n} читателями', other: 'подтверждено {n} читателями' },
      ratedBooks: 'Книг с оценками', avgAi: 'Средняя «ИИ-шность»', detailed: 'с подробными данными',
      related: { author: 'Авторы', publisher: 'Издатели', series: 'Серии' },
      ofTotal: 'из {m} в серии',
      seriesTotalNote: 'В серии {m} книг на Amazon, в каталоге из них {n}.',
      sortNew: 'Сначала новые', sortTitle: 'По названию', sortSeries: 'По номеру',
      footnote: 'Данные берутся с открытых страниц Amazon, которые просматривают пользователи Lemon Score. Обложки и ссылки ведут на Amazon. Это не официальный каталог Amazon.',
    },
  };

  // kind -> параметры списка и фильтра книг
  const KINDS = {
    author: { list: 'authors', filter: 'p_author_key' },
    series: { list: 'series', filter: 'p_series_key' },
    publisher: { list: 'publishers', filter: 'p_publisher_key' },
    style: { list: 'styles', filter: 'p_style' },
  };
  const LIST_TO_KIND = { authors: 'author', series: 'series', publishers: 'publisher', styles: 'style' };
  const PAGE = 24;

  let A = null; // помощники сайта (из app.js)
  const lang = () => (A.lang === 'ru' ? 'ru' : 'en');
  const s = (k) => S[lang()][k] ?? S.en[k] ?? k;
  const f = (k, vars) => Object.entries(vars).reduce((acc, [a, b]) => acc.replace('{' + a + '}', b), s(k));
  const pl = (k, n) => {
    const forms = S[lang()][k] || S.en[k];
    return (forms[new Intl.PluralRules(lang()).select(n)] || forms.other).replace('{n}', Number(n).toLocaleString(lang()));
  };
  const styleName = (slug) => STYLE_NAMES[lang()][slug] || STYLE_NAMES.en[slug] || slug;
  const href = (...parts) => '#/wiki' + parts.map((p) => '/' + encodeURIComponent(p)).join('');
  const h = (...args) => A.h(...args);

  // ---------------------------------------------------------------- общие кусочки
  const thumb = (url, cls = 'wiki-thumb') => {
    const box = h('span', { class: cls });
    const blank = () => box.replaceChildren(A.lemon(false, 'big'));
    if (!url) {
      blank();
      return box;
    }
    const img = h('img', { src: url, alt: '', loading: 'lazy', decoding: 'async', referrerpolicy: 'no-referrer' });
    img.addEventListener('error', blank, { once: true });
    img.addEventListener('load', () => { if (img.naturalWidth < 20) blank(); }, { once: true });
    box.append(img);
    return box;
  };

  const seriesLabel = (b) => (b.series_pos != null && b.series_total ? f('bookOf', { n: b.series_pos, m: b.series_total }) : b.series_pos != null ? f('bookN', { n: b.series_pos }) : null);

  const bookCard = (b) =>
    h('li', { class: 'wiki-card book-card' },
      h('a', { class: 'wiki-card-link', href: href('book', b.asin) }, thumb(b.cover_url)),
      h('div', { class: 'wiki-card-body' },
        h('h3', { class: 'wiki-card-title' }, h('a', { href: href('book', b.asin) }, b.title || s('untitled'))),
        b.author_key ? h('a', { class: 'wiki-sub', href: href('author', b.author_key) }, b.author) : h('span', { class: 'wiki-sub muted' }, s('unknownAuthor')),
        b.series_key ? h('a', { class: 'wiki-chip', href: href('series', b.series_key) }, [b.series_name, seriesLabel(b) ? ' · ' + seriesLabel(b) : '']) : null,
        b.lemon_n ? h('span', { class: 'score' }, A.meter(Math.round(Number(b.lemon_avg)), f('lemonAvg', { s: A.fmt(b.lemon_avg) })), h('span', { class: 'score-num' }, A.fmt(b.lemon_avg))) : null
      ));

  const entityCard = (kind, e) => {
    const link = kind === 'style' ? href('style', e.key) : href(kind, e.key);
    const name = kind === 'style' ? styleName(e.key) : e.name;
    return h('li', { class: 'wiki-card entity-card' },
      h('a', { class: 'wiki-card-link', href: link }, thumb(e.cover_url, 'wiki-thumb small')),
      h('div', { class: 'wiki-card-body' },
        h('h3', { class: 'wiki-card-title' }, h('a', { href: link }, name)),
        h('span', { class: 'wiki-sub muted' }, pl('nBooks', e.books), kind === 'series' && e.total && e.total > e.books ? ' ' + f('ofTotal', { m: e.total }) : '')));
  };

  const loadingBox = () => h('p', { class: 'muted', role: 'status' }, '…');
  const fail = (retry) => A.errorBox(retry, s('errLoad'));

  // Постраничный список с кнопкой «Показать ещё». fetchPage(offset) -> rows (первая строка несёт total_count).
  const pagedList = (cls, fetchPage, renderRow, emptyText) => {
    const list = h('ul', { class: cls });
    const foot = h('div', { class: 'grid-foot' });
    let offset = 0;
    let busy = false;
    const more = async () => {
      if (busy) return;
      busy = true;
      foot.replaceChildren(loadingBox());
      try {
        const rows = await fetchPage(offset);
        if (offset === 0 && !rows.length) {
          foot.replaceChildren(h('div', { class: 'notice' }, h('p', {}, emptyText || s('notFound'))));
        } else {
          list.append(...rows.map(renderRow));
          offset += rows.length;
          const total = Number(rows[0]?.total_count ?? 0);
          foot.replaceChildren(...(rows.length >= PAGE && (!total || offset < total) ? [h('button', { class: 'btn ghost', type: 'button', onclick: more }, s('loadMore'))] : []));
        }
      } catch {
        foot.replaceChildren(fail(more));
      }
      busy = false;
    };
    more();
    return h('div', {}, list, foot);
  };

  const booksList = (filters, sort) =>
    pagedList('wiki-grid', (offset) => A.rpc('wiki_list_books', { ...filters, p_limit: PAGE, p_offset: offset, p_sort: sort || 'title' }), bookCard);
  const entitiesList = (kind, q) =>
    pagedList('wiki-grid entities', (offset) => A.rpc('wiki_list_entities', { p_kind: kind, p_q: q || null, p_limit: PAGE, p_offset: offset }), (e) => entityCard(kind, e));

  const searchForm = (placeholder, value, action) => {
    const input = h('input', { class: 'search', type: 'search', placeholder, 'aria-label': placeholder, value: value || '', maxlength: 100 });
    return h('form', { class: 'wiki-search', onsubmit: (e) => { e.preventDefault(); location.hash = action(input.value.trim()); } }, input, h('button', { class: 'btn', type: 'submit' }, s('search')));
  };

  const head = (title, ...extra) => h('header', { class: 'page-head' }, h('a', { class: 'back', href: '#/wiki' }, '← ' + s('wiki')), h('h1', { class: 'page-title' }, title), ...extra);

  // ---------------------------------------------------------------- главная
  const showHome = async () => {
    document.title = `${s('wikiTitle')} — Lemon Score`;
    A.view.replaceChildren(h('header', { class: 'page-head' }, h('h1', { class: 'page-title' }, s('wikiTitle')), h('p', { class: 'page-text' }, s('lead'))), loadingBox());
    let stats;
    try {
      stats = await A.rpc('wiki_stats');
    } catch {
      A.view.replaceChildren(h('header', { class: 'page-head' }, h('h1', { class: 'page-title' }, s('wikiTitle'))), fail(showHome));
      return;
    }
    const num = (n) => Number(n || 0).toLocaleString(lang());
    const tile = (label, n, to) => h('a', { class: 'wiki-tile', href: to }, h('b', {}, num(n)), h('span', {}, label));
    const section = (title, to, node) => h('section', { class: 'wiki-section' }, h('div', { class: 'wiki-section-head' }, h('h2', { class: 'section-title' }, title), to ? h('a', { href: to }, s('seeAll')) : null), node);
    const head0 = h('header', { class: 'page-head' }, h('h1', { class: 'page-title' }, s('wikiTitle')), h('p', { class: 'page-text' }, s('lead')),
      searchForm(s('searchBooks'), '', (q) => '#/wiki/books' + (q ? '?q=' + encodeURIComponent(q) : '')));
    if (!stats || !Number(stats.books)) {
      A.view.replaceChildren(head0, h('div', { class: 'notice' }, h('p', {}, s('empty'))));
      return;
    }
    const tiles = h('div', { class: 'wiki-tiles' },
      tile(s('books'), stats.books, href('books')), tile(s('authors'), stats.authors, href('authors')),
      tile(s('series'), stats.series, href('series')), tile(s('publishers'), stats.publishers, href('publishers')));
    const styleBox = h('div', { class: 'wiki-chips' });
    const seriesBox = h('div', {});
    const newBox = h('div', {});
    A.view.replaceChildren(head0, tiles,
      section(s('styles'), href('styles'), styleBox),
      section(s('top').series, href('series'), seriesBox),
      section(s('newest'), href('books') + '?sort=new', newBox),
      h('p', { class: 'muted small-note' }, s('footnote')));
    A.rpc('wiki_list_entities', { p_kind: 'style', p_limit: 24 }).then((rows) =>
      styleBox.replaceChildren(...rows.map((e) => h('a', { class: 'wiki-chip big', href: href('style', e.key) }, `${styleName(e.key)} · ${e.books}`)))).catch(() => {});
    A.rpc('wiki_list_entities', { p_kind: 'series', p_limit: 6 }).then((rows) =>
      seriesBox.replaceChildren(h('ul', { class: 'wiki-grid entities' }, rows.map((e) => entityCard('series', e))))).catch(() => {});
    A.rpc('wiki_list_books', { p_limit: 8, p_sort: 'new' }).then((rows) =>
      newBox.replaceChildren(h('ul', { class: 'wiki-grid' }, rows.map(bookCard)))).catch(() => {});
  };

  // ---------------------------------------------------------------- все книги
  const showBooks = (route) => {
    const q = (route.params.get('q') || '').slice(0, 100);
    const sort = ['new', 'title'].includes(route.params.get('sort')) ? route.params.get('sort') : 'title';
    document.title = `${s('books')} — ${s('wikiTitle')} — Lemon Score`;
    const sortLink = (v, label) => h('a', { class: 'wiki-chip' + (sort === v ? ' on' : ''), href: href('books') + `?sort=${v}${q ? '&q=' + encodeURIComponent(q) : ''}` }, label);
    A.view.replaceChildren(
      head(s('books'), searchForm(s('searchBooks'), q, (x) => '#/wiki/books' + (x ? '?q=' + encodeURIComponent(x) : '') + (sort !== 'title' ? (x ? '&' : '?') + 'sort=' + sort : '')),
        h('div', { class: 'wiki-chips' }, sortLink('title', s('sortTitle')), sortLink('new', s('sortNew')))),
      booksList({ p_q: q || null }, sort));
  };

  // ---------------------------------------------------------------- списки сущностей
  const showEntityList = (listName, route) => {
    const kind = LIST_TO_KIND[listName];
    const q = (route.params.get('q') || '').slice(0, 100);
    document.title = `${s(listName)} — ${s('wikiTitle')} — Lemon Score`;
    A.view.replaceChildren(
      head(s(listName), kind === 'style' ? null : searchForm(s('search'), q, (x) => href(listName) + (x ? '?q=' + encodeURIComponent(x) : ''))),
      entitiesList(kind, q));
  };

  // ---------------------------------------------------------------- страница автора / серии / издателя / стиля
  const showEntity = async (kind, key) => {
    A.view.replaceChildren(head('…'), loadingBox());
    let e;
    try {
      e = await A.rpc('wiki_get_entity', { p_kind: kind, p_key: key });
    } catch {
      A.view.replaceChildren(head(kind === 'style' ? styleName(key) : key), fail(() => showEntity(kind, key)));
      return;
    }
    if (!e) {
      A.view.replaceChildren(head(kind === 'style' ? styleName(key) : key), h('div', { class: 'notice' }, h('p', {}, s('notFound'))));
      return;
    }
    const name = kind === 'style' ? styleName(key) : e.name;
    document.title = `${name} — ${s('wikiTitle')} — Lemon Score`;
    const stats = h('p', { class: 'author-stats' },
      h('span', {}, pl('nBooks', e.books)),
      kind === 'series' && e.series_total && e.series_total > e.books ? h('span', {}, f('seriesTotalNote', { m: e.series_total, n: e.books })) : null,
      e.rated_books ? h('span', { class: 'score' }, `${s('ratedBooks')}: ${e.rated_books}`, ' · ', A.meter(Math.round(Number(e.avg_ai)), f('lemonAvg', { s: A.fmt(e.avg_ai) })), h('span', { class: 'score-num' }, A.fmt(e.avg_ai))) : null);
    const groups = {};
    for (const r of e.related || []) (groups[r.kind] ||= []).push(r);
    const related = Object.entries(groups).map(([k, list]) =>
      h('section', { class: 'wiki-section' }, h('h2', { class: 'section-title' }, s('related')[k] || k),
        h('div', { class: 'wiki-chips' }, list.map((r) => h('a', { class: 'wiki-chip', href: href(k, r.key) }, `${r.name} · ${r.books}`)))));
    const filters = { [KINDS[kind].filter]: key };
    A.view.replaceChildren(head(name, stats), ...related,
      h('h2', { class: 'section-title' }, s('books')), booksList(filters, kind === 'series' ? 'series' : 'title'));
  };

  // ---------------------------------------------------------------- страница книги
  const showBook = async (asin) => {
    A.view.replaceChildren(head('…'), loadingBox());
    let d;
    try {
      d = await A.rpc('wiki_get_book', { p_asin: asin });
    } catch {
      A.view.replaceChildren(head(asin), fail(() => showBook(asin)));
      return;
    }
    if (!d) {
      A.view.replaceChildren(head(asin), h('div', { class: 'notice' }, h('p', {}, s('notFound'))));
      return;
    }
    const b = d.book;
    document.title = `${b.title || asin} — ${s('wikiTitle')} — Lemon Score`;
    const rows = [];
    const row = (label, node) => { if (node != null && node !== '') rows.push(h('tr', {}, h('th', { scope: 'row' }, label), h('td', {}, node))); };
    row(s('author'), b.author_key ? h('a', { href: href('author', b.author_key) }, b.author) : null);
    row(s('publisher'), b.publisher_key ? h('a', { href: href('publisher', b.publisher_key) }, b.publisher) : null);
    row(s('series'), b.series_key ? [h('a', { href: href('series', b.series_key) }, b.series_name || b.series_key), seriesLabel(b) ? ` (${seriesLabel(b)})` : ''] : null);
    row(s('published'), b.pub_date ? new Date(b.pub_date + 'T00:00:00Z').toLocaleDateString(lang(), { dateStyle: 'long', timeZone: 'UTC' }) : null);
    row(s('pages'), b.pages);
    row(s('size'), b.dimensions);
    row(s('language'), b.language);
    row(s('isbn13'), b.isbn13);
    row(s('isbn10'), b.isbn10);
    row(s('rank'), b.bsr ? `#${Number(b.bsr).toLocaleString(lang())}${b.bsr_category ? ' · ' + b.bsr_category : ''}` : null);
    row(s('styleLbl'), (b.styles || []).length ? h('span', { class: 'wiki-chips inline' }, b.styles.map((x) => h('a', { class: 'wiki-chip', href: href('style', x) }, styleName(x)))) : null);
    row(s('categories'), (b.categories || []).length ? b.categories.join(' › ') : null);
    row(s('asin'), b.asin);

    const lemon = d.lemon && Number(d.lemon.n) > 0
      ? h('p', { class: 'score' }, A.meter(Math.round(Number(d.lemon.avg)), f('lemonAvg', { s: A.fmt(d.lemon.avg) })), h('span', { class: 'score-num' }, A.fmt(d.lemon.avg)), h('span', { class: 'muted' }, ` · ${pl('lemonRatings', Number(d.lemon.n))}`))
      : h('p', { class: 'muted' }, s('lemonNone'));

    const side = [];
    if (d.series && d.series.books?.length) {
      side.push(h('section', { class: 'wiki-section' }, h('h2', { class: 'section-title' }, `${s('inSeries')}: ${d.series.name || ''}`),
        d.series.total && d.series.total > d.series.books.length ? h('p', { class: 'muted small-note' }, f('seriesTotalNote', { m: d.series.total, n: d.series.books.length })) : null,
        h('ol', { class: 'wiki-mini' }, d.series.books.map((x) => h('li', { class: x.asin === b.asin ? 'on' : '' },
          h('a', { href: href('book', x.asin) }, thumb(x.cover_url, 'wiki-thumb tiny'), h('span', {}, x.pos != null ? `${x.pos}. ` : '', x.title || s('untitled'))))))));
    }
    if (d.author_books?.length) {
      side.push(h('section', { class: 'wiki-section' }, h('h2', { class: 'section-title' }, s('moreByAuthor')),
        h('ul', { class: 'wiki-mini' }, d.author_books.map((x) => h('li', {}, h('a', { href: href('book', x.asin) }, thumb(x.cover_url, 'wiki-thumb tiny'), h('span', {}, x.title || s('untitled'))))))));
    }

    A.view.replaceChildren(
      head(b.title || asin),
      b.title_full && b.title_full !== b.title ? h('p', { class: 'muted small-note' }, `${s('fullTitle')}: ${b.title_full}`) : null,
      h('div', { class: 'wiki-book' },
        h('div', { class: 'wiki-book-cover' }, thumb(b.cover_url, 'wiki-thumb large'),
          h('a', { class: 'btn small', href: A.amazonUrl('com', b.asin), target: '_blank', rel: 'noopener' }, s('onAmazon'))),
        h('div', { class: 'wiki-book-main' },
          h('section', { class: 'wiki-section' }, h('h2', { class: 'section-title' }, s('lemonTitle')), lemon),
          !b.detailed_at ? h('div', { class: 'notice' }, h('p', {}, s('stub'))) : null,
          h('table', { class: 'wiki-info' }, h('tbody', {}, rows)),
          d.reports ? h('p', { class: 'muted small-note' }, pl('confirmed', Number(d.reports))) : null),
        h('aside', { class: 'wiki-book-side' }, side)),
      h('p', { class: 'muted small-note' }, s('footnote')));
  };

  // ---------------------------------------------------------------- вход из app.js
  const show = (route, api) => {
    A = api;
    const [a, b] = route.parts || [];
    if (!a) return showHome();
    if (a === 'books') return showBooks(route);
    if (a === 'book' && b) return showBook(String(b).toUpperCase());
    if (LIST_TO_KIND[a]) return showEntityList(a, route);
    if (KINDS[a] && b) return showEntity(a, b);
    return showHome();
  };

  window.LemonWiki = { show };
})();
