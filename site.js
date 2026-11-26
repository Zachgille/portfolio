// Small enhancements. Every page reads fine without this file.

// March Madness: champion-pick toy model.
// If only the champion pick matters and ties are broken at random, an entry whose
// champion wins (probability p) beats the field with probability E[1/(1+K)],
// where K ~ Binomial(N-1, s) counts opponents who picked the same team.
// E[1/(1+K)] = (1 - (1-s)^N) / (N s).
function poolWinChance(p, s, n) {
  if (s <= 0) return p;
  return p * (1 - Math.pow(1 - s, n)) / (n * s);
}

document.querySelectorAll('[data-pool]').forEach((fig) => {
  const size = fig.querySelector('[name="pool-size"]');
  const share = fig.querySelector('[name="fav-share"]');
  const picks = [...fig.querySelectorAll('[data-pick]')];
  const verdict = fig.querySelector('[data-verdict]');
  const pct = (x) => (x * 100).toFixed(x < 0.1 ? 1 : 0) + '%';

  function render() {
    const n = Number(size.value);
    fig.querySelector('[data-out="pool-size"]').value = n;
    if (share) {
      const s = Number(share.value) / 100;
      fig.querySelector('[data-out="fav-share"]').value = Math.round(s * 100) + '%';
      picks[0].dataset.share = s;
      const label = picks[0].querySelector('[data-share-label]');
      if (label) label.textContent = Math.round(s * 100) + '%';
    }
    const odds = picks.map((el) => poolWinChance(Number(el.dataset.title), Number(el.dataset.share), n));
    const best = odds[0] >= odds[1] ? 0 : 1;
    const top = Math.max(...odds);
    picks.forEach((el, i) => {
      el.querySelector('[data-odds]').textContent = pct(odds[i]);
      el.querySelector('.pool__bar').style.width = (odds[i] / Math.max(top, 0.0001)) * 100 + '%';
      el.classList.toggle('is-best', i === best);
    });
    const ratio = odds[best] / odds[1 - best];
    verdict.textContent = best === 1
      ? `In a pool of ${n}, the underdog pick wins the pool ${ratio.toFixed(1)}× as often, despite being half as likely to win the title.`
      : `In a pool of ${n}, the favorite is the better pick, at ${ratio.toFixed(1)}× the underdog's chance.`;
  }

  size.addEventListener('input', render);
  if (share) share.addEventListener('input', render);
  render();
});

// TriageFlow: before/after plan toggle.
document.querySelectorAll('[data-toggle]').forEach((group) => {
  const buttons = [...group.querySelectorAll('[data-show]')];
  const panels = [...group.querySelectorAll('[data-panel]')];
  buttons.forEach((btn) => btn.addEventListener('click', () => {
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    panels.forEach((p) => { p.hidden = p.dataset.panel !== btn.dataset.show; });
  }));
});

// Copy email.
document.querySelectorAll('[data-copy]').forEach((btn) => {
  btn.hidden = !navigator.clipboard;
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
      const label = btn.textContent;
      btn.textContent = 'Copied';
      setTimeout(() => { btn.textContent = label; }, 1600);
    } catch (_) { /* clipboard blocked; the mailto link still works */ }
  });
});

// Demo videos: pause for people who prefer reduced motion.
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('video[autoplay]').forEach((v) => { v.pause(); v.controls = true; });
}
