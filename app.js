const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const toast = (message) => {
  const element = $('#toast');
  element.textContent = message;
  element.classList.add('show');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => element.classList.remove('show'), 2200);
};

const modal = $('#modal');
const openModal = (title, text) => {
  $('#modalTitle').textContent = title;
  $('#modalText').textContent = text;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
};
const closeModal = () => {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
};

$('#dailyAnswer').addEventListener('click', () => openModal(
  '为什么会产生牛鞭效应？',
  '需求预测更新、批量订购、价格波动与短缺博弈，会让微小的终端需求变化沿供应链逐级放大。共享真实需求数据、缩短交付周期，是缓解它的关键。'
));
$('#learnConcept').addEventListener('click', () => openModal(
  '牛鞭效应 · Bullwhip Effect',
  '当零售端的需求发生小幅变化，上游企业往往因预测误差、安全库存和订购批量而做出更大的调整。越靠近供应链上游，订单波动通常越明显。'
));
$('#modalClose').addEventListener('click', closeModal);
$('#modalOkay').addEventListener('click', closeModal);
modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeModal(); });

$('#continueBtn').addEventListener('click', (event) => {
  const button = event.currentTarget;
  button.innerHTML = '<span>✓</span>已进入课程';
  const current = Number(localStorage.getItem('supplyChainWeek') || 3);
  const next = Math.min(5, current + 1);
  localStorage.setItem('supplyChainWeek', next);
  $('#weekCount').textContent = next;
  $('.mini-progress i').style.width = `${next * 20}%`;
  toast('课程已为你准备好，继续保持！');
});

const savedWeek = Number(localStorage.getItem('supplyChainWeek') || 3);
$('#weekCount').textContent = savedWeek;
$('.mini-progress i').style.width = `${savedWeek * 20}%`;

const cards = [
  { tag: '核心概念', title: '牛鞭效应', text: '供应链中，需求信息从下游向上游传递时，波动被逐级放大的现象。' },
  { tag: '计划方法', title: 'S&OP', text: '通过跨部门协同，将销售预测、运营能力与财务目标统一到一套可执行计划中。' },
  { tag: '库存策略', title: '安全库存', text: '为应对需求与交付的不确定性而设置的额外库存，是服务水平的重要保障。' }
];
let currentCard = 0;
$('#refreshCard').addEventListener('click', () => {
  currentCard = (currentCard + 1) % cards.length;
  const card = cards[currentCard];
  const body = $('#knowledgeCard');
  body.animate([{ opacity: .35, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], { duration: 280 });
  body.querySelector('.tiny-tag').textContent = card.tag;
  body.querySelector('h3').textContent = card.title;
  body.querySelector('.concept-copy p').textContent = card.text;
});

const search = $('#searchInput');
const filterCards = () => {
  const query = search.value.trim().toLowerCase();
  let visible = 0;
  $$('.path-card').forEach((card) => {
    const match = card.dataset.search.toLowerCase().includes(query);
    card.style.display = match ? '' : 'none';
    if (match) visible += 1;
  });
  $('#noResults').style.display = visible ? 'none' : 'block';
};
search.addEventListener('input', filterCards);
document.addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    search.focus();
  }
});

$$('.nav-item').forEach((item) => item.addEventListener('click', () => {
  $$('.nav-item').forEach((nav) => nav.classList.remove('active'));
  item.classList.add('active');
  if (item.dataset.page !== 'home') toast(`${item.textContent.trim()}模块即将开放`);
  $('#sidebar').classList.remove('open');
}));
$('#menuBtn').addEventListener('click', () => $('#sidebar').classList.toggle('open'));
