// Decorative only: links retain native navigation, with no click interception.
(() => {
  const ns = 'http://www.w3.org/2000/svg';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('.rg-circuit-mark').forEach(mark => {
    const signal = mark.querySelector('path').cloneNode();
    // Animate a single continuous lead; the ground bars light only on arrival.
    signal.setAttribute('d', signal.getAttribute('d').split('m')[0]);
    signal.classList.add('circuit-signal');
    signal.setAttribute('pathLength', '100');
    const ground = document.createElementNS(ns, 'path');
    ground.classList.add('circuit-ground');
    ground.setAttribute('d', 'M138 16h24m-20 5h16m-12 5h8');
    mark.append(signal, ground);
  });

  document.querySelectorAll('.page-component-line').forEach(line => {
    const svg = line.querySelector('svg');
    const drawLine = () => {
      const width = line.clientWidth;
      if (!width) return;
      const middle = width / 2;
      const end = width - 16;
      const lead = `M0 12 H18 l4 -5 8 10 8 -10 8 10 4 -5 H${middle - 18} l4 -5 8 10 8 -10 8 10 4 -5 H${end} V24`;
      const ground = `M${end - 12} 24 h24 M${end - 8} 29 h16 M${end - 4} 34 h8`;
      svg.setAttribute('viewBox', `0 0 ${width} 40`);
      svg.querySelector('.circuit-trace').setAttribute('d', lead + ' ' + ground);
      svg.querySelector('.circuit-signal').setAttribute('d', lead);
      svg.querySelector('.circuit-ground').setAttribute('d', ground);
    };
    new ResizeObserver(drawLine).observe(line);
    drawLine();
  });

  const list = document.querySelector('.route-list');
  if (!list) return;
  const links = [...list.querySelectorAll('.route-link')];
  const wire = document.createElementNS(ns, 'svg');
  wire.classList.add('route-wire');
  wire.setAttribute('aria-hidden', 'true');
  wire.setAttribute('focusable', 'false');
  const trace = document.createElementNS(ns, 'path');
  trace.classList.add('circuit-trace');
  const signal = document.createElementNS(ns, 'path');
  signal.classList.add('circuit-signal');
  signal.setAttribute('pathLength', '100');
  const ground = document.createElementNS(ns, 'path');
  ground.classList.add('circuit-ground');
  wire.append(trace, signal, ground);
  list.prepend(wire);

  // Keep schematic geometry in screen pixels, rather than stretching components.
  function draw() {
    const bounds = list.getBoundingClientRect();
    const contacts = links.map(link => {
      const rect = link.querySelector('.route-switch').getBoundingClientRect();
      return { input: rect.left - bounds.left + 8, output: rect.left - bounds.left + 36, y: rect.top - bounds.top + 12 };
    });
    if (!contacts.length || !bounds.width) return;
    const stacked = matchMedia('(max-width: 850px)').matches;
    const first = contacts[0];
    let d = `M0 ${first.y} H12 l4 -5 7 10 7 -10 7 10 4 -5 H${first.input}`;
    let groundD = '';
    contacts.forEach((contact, index) => {
      const next = contacts[index + 1];
      d += ` M${contact.output} ${contact.y}`;
      if (next && stacked) {
        const railY = (contact.y + 22 + next.y) / 2;
        d += ` h24 v22 H12 V${railY - 18} l-5 4 10 7 -10 7 10 7 -5 4 V${next.y} H${next.input}`;
      } else if (next) {
        const middle = (contact.output + next.input) / 2;
        d += ` H${middle - 20} l4 -5 8 10 8 -10 8 10 4 -5 H${next.input} V${next.y}`;
      } else {
        const groundX = bounds.width - 18;
        const groundY = contact.y + 18;
        d += ` H${groundX} V${groundY}`;
        groundD = ` M${groundX - 12} ${groundY} h24 M${groundX - 8} ${groundY + 5} h16 M${groundX - 4} ${groundY + 10} h8`;
      }
    });
    wire.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
    trace.setAttribute('d', d + groundD);
    signal.setAttribute('d', d.replaceAll(' M', ' L'));
    ground.setAttribute('d', groundD);
  }

  function sweep() {
    if (reducedMotion.matches) return;
    list.classList.remove('is-signaling');
    // Restart even when moving directly between links during the previous sweep.
    void signal.getBoundingClientRect();
    list.classList.add('is-signaling');
  }
  links.forEach(link => {
    link.addEventListener('pointerenter', sweep);
    link.addEventListener('focus', sweep);
    link.addEventListener('pointerdown', event => { if (event.pointerType === 'touch') sweep(); });
  });
  signal.addEventListener('animationend', () => list.classList.remove('is-signaling'));
  reducedMotion.addEventListener('change', () => list.classList.remove('is-signaling'));
  new ResizeObserver(draw).observe(list);
  document.fonts.ready.then(draw);
  draw();
})();
