/* Pure report formatter, also used by the browser. Blank values emit no clauses. */
(function (root) {
  const clean = value => String(value ?? '').trim().replace(/\s+/g, ' ').replace(/[.!?,;]+$/, '');
  const sentence = value => value ? value.charAt(0).toUpperCase() + value.slice(1) + '.' : '';
  const numberWord = n => ['zero','one','two','three','four','five','six','seven','eight','nine','ten'][n] || String(n);
  function composeReport(type, patients, eta) {
    const active = patients.map(p => Object.fromEntries(['age','gender','reason','vitals','treatment'].map(k => [k, clean(p[k])]))).filter(p => Object.values(p).some(Boolean));
    const multiple = active.length > 1;
    const blocks = active.map((p, index) => {
      const name = multiple ? `patient ${numberWord(index + 1)}` : 'patient';
      const description = [p.age ? `${p.age} year old` : '', p.gender].filter(Boolean).join(' ');
      let intro = '';
      if (description) {
        const article = p.age ? ([8,11,18].includes(Number(p.age)) || (Number(p.age) >= 80 && Number(p.age) <= 89) ? 'an' : 'a') : 'a';
        intro = `${name} is ${article} ${description}${p.reason ? ` with ${p.reason}` : ''}`;
      } else if (p.reason) intro = `${name} has ${p.reason}`;
      const clinical = [p.vitals ? `Vitals are ${p.vitals}` : '', p.treatment ? `treated with ${p.treatment}` : ''].filter(Boolean).join(', ');
      let body = [sentence(intro), sentence(clinical)].filter(Boolean).join(' ');
      if (multiple && !intro) body = `${sentence(name).slice(0,-1)}: ${body}`;
      return body;
    });
    const header = ['EMS','Trauma'].includes(type) ? `${type} report${multiple ? ` with ${numberWord(active.length)}` : ''}` : '';
    if (header) {
      if (blocks.length && /^Patient\b/.test(blocks[0])) blocks[0] = `${header}, ${blocks[0][0].toLowerCase()}${blocks[0].slice(1)}`;
      else blocks.unshift(header + '.');
    }
    const arrival = clean(eta);
    if (arrival) {
      const text = /^at your doors now$/i.test(arrival) ? 'At your doors now.' : `ETA of ${arrival}.`;
      if (blocks.length) blocks[blocks.length - 1] += ' ' + text;
      else blocks.push(text);
    }
    return blocks.join('\n\n');
  }
  root.composeReport = composeReport;
  if (typeof module !== 'undefined') module.exports = {composeReport};
})(globalThis);
