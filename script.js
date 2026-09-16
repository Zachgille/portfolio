document.querySelectorAll('[data-explorer]').forEach(explorer => {
  const buttons = [...explorer.querySelectorAll('[data-step]')];
  const panels = [...explorer.querySelectorAll('.step-panel')];
  buttons.forEach((button, index) => button.addEventListener('click', () => {
    buttons.forEach((item, i) => item.setAttribute('aria-pressed', String(i === index)));
    panels.forEach((panel, i) => { panel.hidden = i !== index; });
  }));
});
document.querySelectorAll('[data-print]').forEach(button => button.addEventListener('click', () => window.print()));
// Each page includes a no-script fallback that exposes every description.
