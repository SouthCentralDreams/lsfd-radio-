// Editable starter presets for fictional roleplay scenes.
const PRESETS = {
  vitals: [
    'WNL: BP 120/80, Heart Rate 75 bpm, Respiratory rate of 16, SpO₂ 98%',
    'ELEVATED: BP 145/90, Heart Rate 105 bpm, Respiratory rate of 24, SpO₂ 94%',
    'LOW: BP 85/55, Heart Rate 48 bpm, Respiratory rate of 8, SpO₂ 88%',
    'ADRENELINE RESPONSE: BP 140/85, Heart Rate 120 bpm, Respiratory rate of 26, SpO₂ 98%',
    'WNL'
  ],
  treatment: ['bandaging around the head, minor bleeding controlled, splint applied, 500 MG of Acetaminophen given orally for pain', 'SMR protocols taken', 'wound cleaning and dressing', 'direct pressure and bandaging', 'splinting and immobilization']
};
const $ = id => document.getElementById(id);
let nextId = 0;
const cards = () => [...$('patients').querySelectorAll('.patient-card')];
function update() {
  cards().forEach((card,i) => card.querySelector('.patient-number').textContent = i + 1);
  const patients = cards().map(card => Object.fromEntries([...card.querySelectorAll('[data-field]')].map(field => [field.dataset.field, field.value])));
  $('output').value = composeReport($('report-type').value, patients, $('eta').value);
  $('count').textContent = `${$('output').value.length} characters`;
  $('copy').disabled = !$('output').value;
  $('copy-status').textContent = $('output').value ? 'Ready to copy. Review before transmitting.' : 'Add any detail to start your report.';
}
function addPatient(values = {}) {
  const card = $('patient-template').content.firstElementChild.cloneNode(true);
  const id = ++nextId;
  card.querySelectorAll('[data-field]').forEach(field => {
    field.id = `patient-${id}-${field.dataset.field}`;
    card.querySelector(`[data-for="${field.dataset.field}"]`).htmlFor = field.id;
    field.value = values[field.dataset.field] || '';
    field.addEventListener('input', () => {
      const menu = card.querySelector(`[data-preset="${field.dataset.field}"]`);
      if (menu) menu.value = PRESETS[field.dataset.field].includes(field.value) ? field.value : '';
      update();
    });
  });
  card.querySelectorAll('[data-preset]').forEach(menu => {
    menu.add(new Option('Choose a preset…', ''));
    PRESETS[menu.dataset.preset].forEach(value => menu.add(new Option(value,value)));
    menu.value = values[menu.dataset.preset] || '';
    menu.addEventListener('change', () => { if(menu.value) card.querySelector(`[data-field="${menu.dataset.preset}"]`).value = menu.value; update(); });
  });
  card.querySelector('.remove-patient').addEventListener('click', () => {card.remove(); update(); $('add-patient').focus();});
  $('patients').append(card);
  update();
  return card;
}
$('report-form').addEventListener('submit', e => e.preventDefault());
$('report-type').addEventListener('change', update);
$('eta').addEventListener('input', () => { $('eta-preset').value = $('eta').value; update(); });
$('eta-preset').addEventListener('change', () => {if ($('eta-preset').value) $('eta').value = $('eta-preset').value; update();});
$('add-patient').addEventListener('click', () => addPatient().querySelector('input').focus());
$('clear').addEventListener('click', () => { $('report-form').reset(); $('patients').replaceChildren(); addPatient(); $('report-type').focus(); });
$('example').addEventListener('click', () => {
  $('report-type').value = 'Trauma'; $('eta').value = ''; $('eta-preset').value = '';
  $('patients').replaceChildren();
  addPatient({age:'18',gender:'male',reason:'a concussion, wrist sprain and small lacerations around his head',vitals:'WNL',treatment:PRESETS.treatment[0]});
  addPatient({age:'18',gender:'male',reason:'unequal pupils and issues with the neck',vitals:'WNL',treatment:'SMR protocols taken'});
});
$('copy').addEventListener('click', async () => {
  if (!$('report-form').reportValidity() || !$('output').value) return;
  try {
    await navigator.clipboard.writeText($('output').value);
    $('copy-status').textContent = 'Copied! Paste your report into radio.';
  } catch {
    $('output').focus(); $('output').select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch {}
    $('copy-status').textContent = copied ? 'Copied! Paste your report into radio.' : 'Report selected. Press Ctrl+C (or ⌘C) to copy.';
  }
});
addPatient();
