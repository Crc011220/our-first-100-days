const dialog = document.querySelector('#memoryDialog');
const content = document.querySelector('#dialogContent');
const close = document.querySelector('.close');
const gallery = document.querySelector('#gallery');
const milestoneTimeline = document.querySelector('#milestoneTimeline');
const assetVersion = '100days-photo-fix-1';
const assetUrl = (path) => `${path}?v=${assetVersion}`;

function renderMilestones(events) {
  const milestones = events.filter((event) => event.day);
  milestoneTimeline.innerHTML = milestones.map((event, index) => `
    <li class="milestone ${index % 2 ? 'right' : 'left'}" data-event-index="${events.indexOf(event)}">
      <button type="button" aria-label="查看 ${event.title} 的回忆">
        <span class="milestone-day">DAY ${String(event.day).padStart(2, '0')}</span>
        <span class="milestone-dot">${event.day === 2 ? '✦' : '●'}</span>
        <span class="milestone-copy">
          <strong>${event.title}</strong>
          ${event.location ? `<small>${event.location}</small>` : ''}
          ${event.caption ? `<em>${event.caption}</em>` : ''}
        </span>
      </button>
    </li>
  `).join('');

  milestoneTimeline.querySelectorAll('.milestone').forEach((milestone) => {
    milestone.addEventListener('click', () => {
      const card = gallery.querySelector(`[data-index="${milestone.dataset.eventIndex}"]`);
      card?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
}

function renderGallery(events) {
  gallery.innerHTML = events.map((event, index) => `
    <article class="memory-card ${index === 0 ? 'featured' : ''}" data-index="${index}">
      <div class="card-image"><img loading="lazy" src="${assetUrl(event.images[0])}" alt="${event.title}" /></div>
      <div class="card-content">
        ${event.location ? `<p class="date">${event.location}</p>` : ''}
        <h3>${event.title}</h3>
        ${event.caption ? `<p>${event.caption}</p>` : ''}
        <span>打开回忆 ↗</span>
      </div>
    </article>
  `).join('');

  [...gallery.children].forEach((card, index) => card.addEventListener('click', () => {
    const event = events[index];
    content.innerHTML = `
      <h2 class="modal-title">${event.title}</h2>
      ${event.location ? `<p class="modal-note">${event.location}</p>` : ''}
      ${event.caption ? `<p class="modal-note">${event.caption}</p>` : ''}
      <div class="gallery">${event.images.map((src) => `<img loading="lazy" src="${assetUrl(src)}" alt="${event.title}">`).join('')}</div>
    `;
    dialog.showModal();
  }));
}

fetch('assets/data/gallery.json?v=100days-gallery-fix-2')
  .then((response) => response.json())
  .then(({ events, total }) => {
    const introCopy = document.querySelector('.intro > p:last-child');
    if (introCopy) introCopy.textContent = `一共 ${total} 张照片，按每一个事件好好收藏。点开它们，我们再走一遍那些小小的、却很重要的瞬间。`;
    renderMilestones(events);
    renderGallery(events);
  })
  .catch((error) => {
    console.error('Memory gallery failed to load:', error);
    gallery.innerHTML = '<p class="gallery-error">回忆正在装进相册，请稍后再来看看。</p>';
  });

close.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });

const promise = document.querySelector('#promiseButton');
const secret = document.querySelector('#secret');
promise.addEventListener('click', () => {
  secret.classList.toggle('show');
  promise.innerHTML = secret.classList.contains('show') ? '我爱你 ♥' : '点一下这里就给你摸鸡';
});

const player = document.querySelector('#bgm');
const music = document.querySelector('#musicButton');
const toast = document.querySelector('#toast');
let playing = false;
const tip = (message) => {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
};
music.addEventListener('click', async () => {
  if (playing) {
    player.pause();
    playing = false;
    music.innerHTML = '♪ <span>第几个一百天</span>';
    return;
  }
  try {
    await player.play();
    playing = true;
    music.innerHTML = 'Ⅱ <span>音乐播放中</span>';
  } catch {
    tip('放入已获授权的音乐文件后，就能在这里播放。');
  }
});
