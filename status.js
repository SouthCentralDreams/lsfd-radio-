// Status text is copied exactly as shown; explanations are display-only.
const UNIT_STATUSES = [
  ['Radio', 'Available on radio, driving around not at station'],
  ['Quarters', 'Available in quarters, at station on radio for calls'],
  ['Not Available', 'Not available for calls'],
  ['Enroute', 'Enroute to call'],
  ['On scene', 'On scene of call'],
  ['Transporting', 'Transporting patient to the hospital'],
  ['At PHMC', 'At the hospital after transport'],
  ['Mark us CAV', 'Conditionally Available: doing other stuff; call only if absolutely needed']
];
const deskTabs = [...document.querySelectorAll('.desk-tabs [role="tab"]')];
function activateDeskTab(tab) {
  deskTabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
  });
}
deskTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateDeskTab(tab));
  tab.addEventListener('keydown', event => {
    let target;
    if (event.key === 'ArrowRight') target = deskTabs[(index + 1) % deskTabs.length];
    if (event.key === 'ArrowLeft') target = deskTabs[(index - 1 + deskTabs.length) % deskTabs.length];
    if (event.key === 'Home') target = deskTabs[0];
    if (event.key === 'End') target = deskTabs[deskTabs.length - 1];
    if (!target) return;
    event.preventDefault(); activateDeskTab(target); target.focus();
  });
});
const statusRows = UNIT_STATUSES.map(([status, explanation]) => {
  const row = document.createElement('div'); row.className = 'status-row';
  const details = document.createElement('div'); details.className = 'status-details';
  const text = document.createElement('input'); text.readOnly = true; text.setAttribute('aria-label', `${status} radio text`);
  const hint = document.createElement('p'); hint.textContent = explanation;
  const button = document.createElement('button'); button.type = 'button'; button.className = 'status-copy'; button.textContent = 'Copy'; button.setAttribute('aria-label', `Copy ${status} status`);
  details.append(text, hint); row.append(details, button); document.getElementById('status-list').append(row);
  button.addEventListener('click', async () => {
    const message = text.value;
    const feedback = document.getElementById('unit-copy-status');
    try {
      await navigator.clipboard.writeText(message);
      feedback.textContent = `Copied: ${message}`;
    } catch {
      text.focus(); text.select();
      let copied = false;
      try { copied = document.execCommand('copy'); } catch {}
      feedback.textContent = copied ? `Copied: ${message}` : 'Radio text selected. Press Ctrl+C (or ⌘C) to copy.';
    }
  });
  return {status, text};
});
function updateUnitStatuses() {
  const unit = document.getElementById('unit-name').value.trim().replace(/\s+/g, ' ').replace(/[,;]+$/, '').trim();
  statusRows.forEach(({status, text}) => text.value = unit ? `${unit}, ${status}` : status);
  document.getElementById('unit-copy-status').textContent = '';
}
document.getElementById('unit-name').addEventListener('input', updateUnitStatuses);
updateUnitStatuses();
