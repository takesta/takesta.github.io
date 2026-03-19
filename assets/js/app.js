/**
 * 慶應義塾體育會ゴルフ部 - SPA ルーター
 *
 * コンテンツの編集方法:
 *   content/home.json        → ホームページの紹介文
 *   content/about.json       → 部の理念
 *   content/contact.json     → SNS リンク
 *   content/schedule.json    → 年間スケジュール
 *   content/prospective.json → 新歓・入部案内
 *   content/team.json        → 部員名簿・主将・主務
 */
(function () {
  'use strict';

  // --- ユーティリティ ---

  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  async function fetchJson(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error('Failed to load ' + path + ' (' + res.status + ')');
    return res.json();
  }

  // --- 共通パーツ ---

  function renderContactLinks(contact) {
    const links = contact.links
      .map(function (l) {
        return '<p><a href="' + esc(l.url) + '" target="_blank" rel="noopener noreferrer">' + esc(l.label) + '</a></p>';
      })
      .join('');
    return (
      '<section id="contact">' +
      '<h2>お問い合わせ</h2>' +
      '<p>' + esc(contact.message) + '</p>' +
      links +
      '</section>'
    );
  }

  // --- ページレンダラー ---

  async function renderHome() {
    var results = await Promise.all([
      fetchJson('/content/home.json'),
      fetchJson('/content/contact.json'),
    ]);
    var home = results[0], contact = results[1];
    return (
      '<section class="hero">' +
      '<div class="hero-text">' +
      '<h2>慶應義塾體育會ゴルフ部</h2>' +
      '<p>KEIO UNIVERSITY GOLF TEAM</p>' +
      '</div>' +
      '</section>' +
      '<main class="container">' +
      '<p>' + esc(home.intro) + '</p>' +
      renderContactLinks(contact) +
      '</main>'
    );
  }

  async function renderAbout() {
    var about = await fetchJson('/content/about.json');
    return (
      '<div class="container">' +
      '<section id="philosophy">' +
      '<h2>理念</h2>' +
      '<p>' + esc(about.philosophy) + '</p>' +
      '</section>' +
      '</div>'
    );
  }

  async function renderTeam() {
    var data = await fetchJson('/content/team.json');
    var leadership = data.leadership;
    var members = data.members;

    // 学年ごとにグループ化
    var byYear = {};
    members.forEach(function (m) {
      if (!byYear[m.year]) byYear[m.year] = { men: [], women: [] };
      if (m.gender === 'male') byYear[m.year].men.push(m);
      else byYear[m.year].women.push(m);
    });

    // 学年を降順ソート（4年→3年→2年→1年）
    var yearOrder = ['4年', '3年', '2年', '1年'];
    var years = Object.keys(byYear).sort(function (a, b) {
      var ai = yearOrder.indexOf(a), bi = yearOrder.indexOf(b);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });

    var yearHtml = years.map(function (year) {
      var isLeaderYear = leadership && year === leadership.year;
      var menCards = byYear[year].men
        .map(function (m) { return '<div class="team-member-card"><p>' + esc(m.name) + '</p></div>'; })
        .join('');
      var womenCards = byYear[year].women
        .map(function (m) { return '<div class="team-member-card"><p>' + esc(m.name) + '</p></div>'; })
        .join('');
      var menLeader = isLeaderYear
        ? '<h4><span class="captain-manager">主将 ' + esc(leadership.men.captain) + '</span></h4>' +
          '<h4><span class="captain-manager">主務 ' + esc(leadership.men.manager) + '</span></h4>'
        : '';
      var womenLeader = isLeaderYear
        ? '<h4><span class="captain-manager">主将 ' + esc(leadership.women.captain) + '</span></h4>' +
          '<h4><span class="captain-manager">主務 ' + esc(leadership.women.manager) + '</span></h4>'
        : '';

      return (
        '<div class="year-section">' +
        '<h3>' + esc(year) + '</h3>' +
        '<h4>男子</h4>' +
        menLeader +
        '<div class="team-grid"><div class="members-grid">' + menCards + '</div>' +
        '<h4>女子</h4>' +
        womenLeader +
        '<div class="members-grid">' + womenCards + '</div></div>' +
        '</div>'
      );
    }).join('');

    return '<section id="team" class="container"><h2>部員紹介</h2>' + yearHtml + '</section>';
  }

  async function renderSchedule() {
    var schedule = await fetchJson('/content/schedule.json');
    var items = schedule.map(function (item) {
      var events = item.events && item.events.length > 0
        ? '\u3000\u3000' + item.events.map(esc).join('、')
        : '';
      return '<li>' + esc(item.month) + events + '</li>';
    }).join('');
    return (
      '<div class="container">' +
      '<h2>試合日程・結果</h2>' +
      '<h3>年間予定</h3>' +
      '<ul>' + items + '</ul>' +
      '</div>'
    );
  }

  async function renderProspective() {
    var d = await fetchJson('/content/prospective.json');
    var os = d.orientationSession, line = d.line;

    var fields = d.requiredFields
      .map(function (f) { return '<li>' + esc(f) + '</li>'; })
      .join('');

    var steps = d.timeline.map(function (step) {
      return (
        '<p>' +
        '<strong>' + esc(step.label) + '</strong><br>' +
        esc(step.date) +
        (step.time ? '<br>' + esc(step.time) : '') +
        (step.note ? '<br>※' + esc(step.note) : '') +
        '</p>'
      );
    }).join('');

    return (
      '<div class="container">' +
      '<h2>' + esc(String(d.year)) + '年度 新歓のお知らせ</h2>' +
      '<p>慶應義塾體育會ゴルフ部では、' + esc(String(d.year)) + '年度の新入部員を募集しております。' +
      'ゴルフ経験者はもちろん、大学からゴルフを始めたい方のご参加も歓迎いたします。</p>' +
      '<p>' + esc(os.date) + ' ' + esc(os.startTime) + 'から' + esc(os.endTime) + 'にかけて、' +
      esc(os.format) + 'にて入部説明会を開催いたします。</p>' +
      '<p>説明会への参加を希望される方は、LINE公式アカウント「' + esc(line.accountName) + '」（LINE ID：' + esc(line.id) + '）を' +
      '追加のうえ、' + esc(line.deadline) + 'までに以下の項目をご送信ください。</p>' +
      '<ul>' + fields + '</ul>' +
      '<p>なお、入部を希望される方は入部説明会への参加が必須となります。' +
      'やむを得ず説明会に参加できない場合は、別日程での対応を検討いたしますので、その旨を必ずご連絡ください。</p>' +
      '<p>※説明会のZoom URLは、LINE公式アカウントを通じてご案内いたします。</p>' +
      '<h3>入部までの流れ</h3>' +
      steps +
      '<p>ご不明点やご質問等がございましたら、LINE公式アカウントまたはInstagramのDMよりお気軽にお問い合わせください。</p>' +
      '</div>'
    );
  }

  async function renderContact() {
    var contact = await fetchJson('/content/contact.json');
    return '<div class="container">' + renderContactLinks(contact) + '</div>';
  }

  function render404() {
    return Promise.resolve(
      '<div class="container" style="padding:60px 0;text-align:center">' +
      '<h2>ページが見つかりません</h2>' +
      '<p><a href="/" data-nav>トップページへ戻る</a></p>' +
      '</div>'
    );
  }

  // --- ルーティング ---

  var ROUTES = {
    '/':                 renderHome,
    '/about':            renderAbout,
    '/team':             renderTeam,
    '/schedule-results': renderSchedule,
    '/prospective':      renderProspective,
    '/contact':          renderContact,
  };

  function updateNavActive(path) {
    document.querySelectorAll('nav a[data-nav]').forEach(function (a) {
      var isActive = a.getAttribute('href') === path;
      a.style.color = isActive ? '#036' : '';
      a.style.borderBottom = isActive ? '2px solid #036' : '';
    });
  }

  async function navigate(path) {
    var handler = ROUTES[path] || render404;
    var root = document.getElementById('root');
    root.innerHTML = '<div style="padding:40px;text-align:center">読み込み中...</div>';
    try {
      root.innerHTML = await handler();
    } catch (e) {
      console.error(e);
      root.innerHTML =
        '<div class="container"><p>コンテンツの読み込みに失敗しました。時間をおいて再度お試しください。</p></div>';
    }
    updateNavActive(path);
    window.scrollTo(0, 0);
  }

  // クリックイベントの委任（ヘッダー・コンテンツ内のナビリンク共通）
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[data-nav]');
    if (!link) return;
    e.preventDefault();
    var path = link.getAttribute('href');
    if (path !== location.pathname) {
      history.pushState(null, '', path);
    }
    navigate(path);
  });

  window.addEventListener('popstate', function () {
    navigate(location.pathname);
  });

  // 初回レンダリング
  navigate(location.pathname);
})();
