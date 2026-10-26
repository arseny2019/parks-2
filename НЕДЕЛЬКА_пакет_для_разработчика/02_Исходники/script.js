const practicals = [
  {
    status: 'past',
    statusLabel: 'Доступен в записи',
    name: 'Имя эксперта',
    meta: 'Регалии и короткое описание эксперта',
    topic: 'Тема практикума / навык недели',
    cta: 'Приобрести доступ за 1 500 ₽',
    url: ''
  },
  {
    status: 'future',
    statusLabel: 'Скоро',
    name: 'Имя эксперта',
    meta: 'Регалии и короткое описание эксперта',
    topic: 'Тема предстоящего практикума',
    cta: 'Записаться на предстоящее событие',
    url: ''
  },
  {
    status: 'past',
    statusLabel: 'Доступен в записи',
    name: 'Имя эксперта',
    meta: 'Регалии и короткое описание эксперта',
    topic: 'Тема практикума / навык недели',
    cta: 'Приобрести доступ за 1 500 ₽',
    url: ''
  },
  {
    status: 'future',
    statusLabel: 'Скоро',
    name: 'Имя эксперта',
    meta: 'Регалии и короткое описание эксперта',
    topic: 'Тема предстоящего практикума',
    cta: 'Записаться на предстоящее событие',
    url: ''
  }
];

const grid = document.querySelector('#expertGrid');
const toast = document.querySelector('#toast');

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('is-visible'), 2800);
}

function renderPracticals() {
  grid.innerHTML = practicals.map((item, index) => `
    <article class="expert-card">
      <div class="expert-photo">
        <span class="expert-status expert-status--${item.status}">${item.statusLabel}</span>
        <span class="expert-index">${String(index + 1).padStart(2, '0')}</span>
      </div>
      <div class="expert-content">
        <div class="expert-name">${item.name}</div>
        <div class="expert-meta">${item.meta}</div>
        <div class="expert-topic">${item.topic}</div>
        <div class="expert-action">
          <a class="button ${item.status === 'past' ? 'button--primary' : 'button--future'} practical-link" href="${item.url || '#'}" data-url="${item.url}" data-index="${index}">${item.cta}</a>
        </div>
      </div>
    </article>
  `).join('');
}

renderPracticals();

document.addEventListener('click', (event) => {
  const practical = event.target.closest('.practical-link');
  if (practical && !practical.dataset.url) {
    event.preventDefault();
    showToast('Ссылка на оплату/регистрацию подключается при интеграции.');
  }

  const partner = event.target.closest('.partner');
  if (partner && !partner.dataset.partnerUrl) {
    event.preventDefault();
    showToast('Ссылка партнёра подключается при интеграции.');
  }
});

const ticker = document.querySelector('#skillTicker');
const words = ['ПРОМПТЫ', 'КОНТЕНТ', 'АВТОМАТИЗАЦИЯ', 'АНАЛИТИКА', 'AI-ИНСТРУМЕНТЫ'];
let wordIndex = 0;
if (ticker) {
  window.setInterval(() => {
    ticker.style.opacity = '0';
    ticker.style.transform = 'translateY(5px)';
    window.setTimeout(() => {
      wordIndex = (wordIndex + 1) % words.length;
      ticker.textContent = words[wordIndex];
      ticker.style.opacity = '1';
      ticker.style.transform = 'translateY(0)';
    }, 180);
  }, 2200);
}
