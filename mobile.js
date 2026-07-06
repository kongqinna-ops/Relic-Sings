const mobileArtifacts = window.RELIC_ARTIFACTS || [];
const cards = document.getElementById('mobileCards');
const detail = document.getElementById('mobileDetail');
const detailBody = document.getElementById('mobileDetailBody');
const closeBtn = document.getElementById('mobileClose');

function mEsc(text){
  return String(text || '').replace(/[&<>]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[s]));
}

function mNl(text){
  return mEsc(text).replace(/\n/g, '<br>');
}

function mCleanLyrics(text){
  return String(text || '')
    .replace(/\*\*\[[^\]]+\]\*\*/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function getNetEaseId(item){
  const url = item?.media?.musicLinks?.[0]?.url || '';
  const match = String(url).match(/[?&]id=(\d+)/);
  return match ? match[1] : '';
}

function mobileImage(item){
  const file = String(item.image || '').split('/').pop().replace(/\.(png|jpg|jpeg)$/i, '.webp');
  return `./assets/mobile/${file}`;
}

function renderCards(){
  cards.innerHTML = mobileArtifacts.map(item => `
    <article class="m-card" data-id="${mEsc(item.id)}">
      <img src="${mEsc(mobileImage(item))}" alt="${mEsc(item.artifact)} · ${mEsc(item.singer)}" loading="lazy">
      <div class="m-card-copy">
        <span>${mEsc(item.id)} · ${mEsc(item.exactPeriod || item.periodGroup)}</span>
        <h3>${mEsc(item.artifact)} · ${mEsc(item.singer)}</h3>
        <p>${mEsc(item.tagline)}</p>
        <small>${mEsc(item.song)} ｜ ${mEsc(item.museum)}</small>
      </div>
    </article>
  `).join('');
  cards.querySelectorAll('.m-card').forEach(card => {
    card.addEventListener('click', () => openMobileDetail(card.dataset.id));
  });
}

function renderMobilePlayer(item){
  const id = getNetEaseId(item);
  if(!id){
    return `<div class="m-empty-player">音乐发布后，将在这里接入播放器。</div>`;
  }
  return `<div class="m-detail-player">
    <div class="m-player-head"><strong>${mEsc(item.song)}</strong><span>网易云音乐</span></div>
    <iframe title="${mEsc(item.song)} 网易云音乐播放器" frameborder="no" border="0" marginwidth="0" marginheight="0" width="100%" height="86" src="https://music.163.com/outchain/player?type=2&id=${mEsc(id)}&auto=0&height=66"></iframe>
  </div>`;
}

function openMobileDetail(id){
  const item = mobileArtifacts.find(x => x.id === id);
  if(!item) return;
  detailBody.innerHTML = `
    <img class="m-detail-image" src="${mEsc(mobileImage(item))}" alt="${mEsc(item.artifact)}">
    <section class="m-detail-content">
      <p class="m-kicker">${mEsc(item.exactPeriod)} · ${mEsc(item.museum)}</p>
      <h2>${mEsc(item.artifact)} · ${mEsc(item.singer)}</h2>
      <p class="m-song">歌曲：${mEsc(item.song)}</p>
      ${renderMobilePlayer(item)}
      <h3>文物自述</h3>
      <p>${mNl(item.story)}</p>
      <h3>完整歌词</h3>
      <p class="m-lyrics">${mNl(mCleanLyrics(item.lyrics))}</p>
    </section>
  `;
  detail.showModal();
}

closeBtn.addEventListener('click', () => detail.close());
detail.addEventListener('click', event => {
  if(event.target === detail) detail.close();
});

renderCards();
