'use strict';
/* Discover is self-contained; the Home FIX + Share Edition v11 interaction code is unchanged. */
(() => {
  const $d = id => document.getElementById(id);
  const items = window.BHINNEKA_DISCOVER;
  const atlas = window.BHINNEKA_GLYPHS;
  const xrayData = window.BHINNEKA_XRAY;
  if (!Array.isArray(items) || items.length !== 38 || !atlas || !xrayData) {
    console.error('Discover requires the bilingual data and glyph atlas.');
    return;
  }
  const discover = $d('discover');
  const stage = $d('discoverStage');
  const object = $d('discoverObject');
  let active = 0;
  let xrayPinned = false;
  let xrayVisible = false;
  const ns = 'http://www.w3.org/2000/svg';
  const indices = Object.fromEntries('aeiou'.split('').map(v => [v, items.findIndex(item => item.letter === v)]));
  const number = i => String(i).padStart(2, '0');
  const setText = (id, value) => { $d(id).textContent = value; };
  const population = n => (n / 1e6).toFixed(2) + ' MILLION';

  function svgLayer(item) {
    const [xmin, ymin, xmax, ymax] = item.bbox;
    const pad = 25;
    // ViewBox mirrors the real font coordinates, flipped to SVG's +Y-down system.
    const vx = xmin-pad, vy = -(ymax+pad), vw = xmax-xmin+pad*2, vh = ymax-ymin+pad*2;
    const vb = [vx, vy, vw, vh].join(' ');
    const glyphName = atlas.substitutions[item.letter]?.[String(item.variant)] || item.code;
    const glyph = atlas.glyphs[glyphName];
    const meta = xrayData[glyphName];
    if (!glyph || !glyph.d || !meta) return '';
    const safePath = glyph.d.replace(/"/g,'&quot;');
    const radius = Math.max(128, Math.min(215, vw * .36));
    const guide = meta.guides;
    const anchors = meta.anchors;
    const controls = meta.controls;
    // This is not an approximation: the tiny squares are the glyph's true on-curve
    // nodes, and the dotted construction lines connect genuine quadratic controls.
    return `<svg class="discover-layer discover-xray-svg" aria-hidden="true" viewBox="${vb}" preserveAspectRatio="xMidYMid meet">
      <defs><clipPath id="discoverXrayClip" clipPathUnits="userSpaceOnUse"><circle id="discoverLensMask" cx="${vx+vw/2}" cy="${vy+vh/2}" r="${radius}"/></clipPath></defs>
      <path class="discover-letter-solid" transform="scale(1,-1)" d="${safePath}"/>
      <g class="discover-lens-content" clip-path="url(#discoverXrayClip)">
        <rect x="${vx}" y="${vy}" width="${vw}" height="${vh}" fill="#fafafa" style="fill:var(--d-paper, #fafafa)"/>
        <g transform="scale(1,-1)">
          <path class="discover-xray-letter" d="${safePath}"/>
          <path class="discover-xray-guides" d="${guide}"/>
          <path class="discover-xray-controls" d="${controls}"/>
          <path class="discover-xray-anchors" d="${anchors}"/>
        </g>
      </g>
      <circle id="discoverLensRing" class="discover-lens-ring" cx="${vx+vw/2}" cy="${vy+vh/2}" r="${radius}"/>
    </svg>`;
  }

  function setXrayVisible(visible) {
    xrayVisible = visible;
    object.classList.toggle('is-xray', visible);
  }

  function moveLens(clientX, clientY) {
    const svg = object.querySelector('svg');
    if (!svg) return;
    const matrix = svg.getScreenCTM();
    if (!matrix) return;
    // Keep the lens at a consistent visual size across all 38 glyphs.
    // Standard desktop: 230px diameter; exhibition iMac: 350px.
    // Narrow/mobile screens cap the diameter to fit the available stage.
    const exhibition=document.documentElement.classList.contains('imac-mode') && window.matchMedia('(min-width: 1400px) and (min-height: 780px)').matches;
    const rect=stage.getBoundingClientRect();
    const targetDiameter=exhibition ? 350 : Math.min(230, rect.width*0.75, rect.height*0.75);
    const radiusPx=Math.min(targetDiameter,rect.width*0.92,rect.height*0.92)/2;
    const screenScale=Math.hypot(matrix.a, matrix.b) || 1;
    const lensRadius=radiusPx/screenScale;
    // Keep the lens inside the stage on large screens, protecting navigation.
    if(exhibition){
      clientX=Math.max(rect.left+radiusPx,Math.min(clientX,rect.right-radiusPx));
      clientY=Math.max(rect.top+radiusPx,Math.min(clientY,rect.bottom-radiusPx+10));
    }
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const mapped = pt.matrixTransform(matrix.inverse());
    for (const id of ['discoverLensMask','discoverLensRing']) {
      const circle = svg.querySelector('#' + id);
      if (!circle) continue;
      circle.setAttribute('cx', String(mapped.x));
      circle.setAttribute('cy', String(mapped.y));
      circle.setAttribute('r',String(lensRadius));
    }
  }

  function centerLens() {
    const box = stage.getBoundingClientRect();
    moveLens(box.left+box.width/2,box.top+box.height/2);
  }

  const infoCard = discover.querySelector('.discover-info');
  let alignFrame = 0;
  function alignInfoBottom() {
    // Discover becomes a stacked layout on mobile, where independent
    // bottom alignment would pull the information card over the viewer.
    if (discover.hidden || window.matchMedia('(max-width: 760px)').matches) {
      infoCard.style.removeProperty('--discover-info-align-offset');
      return;
    }
    const glyphInk = object.querySelector('.discover-letter-solid');
    if (!glyphInk) return;
    // Actual rendered SVG path bounds (not the padded SVG stage) ensure
    // the card also lines up for thin I's and unusually short U forms.
    const current = parseFloat(infoCard.style.getPropertyValue('--discover-info-align-offset')) || 0;
    const difference = glyphInk.getBoundingClientRect().bottom - infoCard.getBoundingClientRect().bottom;
    if (Math.abs(difference) > 0.35) {
      infoCard.style.setProperty('--discover-info-align-offset', `${(current + difference).toFixed(2)}px`);
    }
  }
  function scheduleInfoBottomAlign() {
    cancelAnimationFrame(alignFrame);
    alignFrame = requestAnimationFrame(alignInfoBottom);
  }

  function paint() {
    const item = items[active];
    object.innerHTML = svgLayer(item);
    xrayPinned = false;
    setXrayVisible(false);
    setText('discoverProvince', item.province);
    setText('discoverProvinceKo', item.provinceKo);
    setText('discoverRegionShort', `${item.region.toUpperCase()} / ${item.letter.toUpperCase()}`);
    setText('discoverCode', item.code);
    setText('discoverGlyph', item.code);
    setText('discoverRegion', item.region);
    setText('discoverPopulation', population(item.population));
    setText('discoverFrequency', item.vowelFrequency.toFixed(2) + '%');
    setText('discoverDescriptionEn', item.descriptionEn);
    setText('discoverDescriptionKo', item.descriptionKo);
    setText('discoverInfoIndex', number(active+1) + ' OF ' + number(items.length));
    stage.setAttribute('aria-label', `${item.code}: ${item.province}. ${item.descriptionEn}`);
    scheduleInfoBottomAlign();
    document.querySelectorAll('.discover-vowel-button').forEach(btn => {
      const selected = btn.dataset.vowel === item.letter;
      btn.classList.toggle('active', selected);
      btn.setAttribute('aria-pressed', String(selected));
    });
  }

  function showIndex(index) {
    active = (index + items.length) % items.length;
    paint();
  }

  // The letterform archive lives below Discover. A tile sends its exact
  // OpenType variant code here, updates the large X-ray glyph & data panel,
  // and takes the visitor back up to the large viewer.
  window.BHINNEKA_OPEN_LETTERFORM = (code) => {
    const index = items.findIndex(item => item.code === code);
    if(index < 0){console.warn('Unknown provincial letterform:',code);return false;}
    showIndex(index);
    if(discover.hidden) openDiscover();
    window.scrollTo({top:0,behavior:'smooth'});
    return true;
  };

  function openDiscover() {
    if (typeof markActivity === 'function') markActivity();
    if (typeof stopHomeSequence === 'function') stopHomeSequence();
    $d('screensaver').hidden = true;
    $d('studio').hidden = true;
    discover.hidden = false;
    document.body.style.overflow = 'auto';
    window.scrollTo(0,0);
    paint();
  }

  function goHome() {
    discover.hidden = true;
    if (typeof screensaver === 'function') screensaver();
    else $d('screensaver').hidden = false;
  }

  function goPlayground() {
    discover.hidden = true;
    if (typeof enter === 'function') enter();
    else $d('studio').hidden = false;
  }

  for (const v of 'aeiou') {
    const btn=document.createElement('button');
    btn.type='button';
    btn.className='discover-vowel-button';
    btn.dataset.vowel = v;
    btn.textContent = v.toUpperCase();
    btn.setAttribute('aria-label', `Show ${v.toUpperCase()} letterforms`);
    btn.addEventListener('click', () => showIndex(indices[v]));
    $d('discoverVowelNav').appendChild(btn);
  }
  // Cursor-tracking X-ray lens. Pointer events are attached to the stage,
  // while the SVG overlay cannot trap clicks or interfere with the nav arrows.
  stage.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
      setXrayVisible(true);
      moveLens(event.clientX,event.clientY);
    }
  });
  stage.addEventListener('pointermove', event => {
    if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
      setXrayVisible(true);
      moveLens(event.clientX,event.clientY);
    }
  });
  stage.addEventListener('pointerleave', event => {
    if (!xrayPinned) setXrayVisible(false);
  });
  stage.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch') {
      xrayPinned = !xrayPinned;
      setXrayVisible(xrayPinned);
      moveLens(event.clientX,event.clientY);
    }
  });
  stage.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      xrayPinned = !xrayPinned;
      if (xrayPinned) centerLens();
      setXrayVisible(xrayPinned);
    }
  });
  stage.addEventListener('blur', () => {
    xrayPinned = false;
    setXrayVisible(false);
  });

  window.addEventListener('resize', scheduleInfoBottomAlign, {passive: true});
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(scheduleInfoBottomAlign);
  $d('discoverFromStudio').addEventListener('click', openDiscover);
  $d('discoverHome').addEventListener('click', goHome);
  $d('discoverPlayground').addEventListener('click', goPlayground);
  $d('discoverScrollToArchive').addEventListener('click', () => {
    const archive = $d('specimen');
    if (archive) archive.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      block: 'start'
    });
  });
  $d('discoverPrev').addEventListener('click', () => showIndex(active-1));
  $d('discoverNext').addEventListener('click', () => showIndex(active+1));
  $d('discoverSourcesToggle').addEventListener('click', () => {
    const showing = $d('discoverSources').hidden;
    $d('discoverSources').hidden = !showing;
    discover.classList.toggle('sources-expanded', showing);
    $d('discoverSourcesToggle').setAttribute('aria-expanded', String(showing));
    $d('discoverSourcesToggle').textContent = showing ? 'DATA SOURCES −' : 'DATA SOURCES +';
  });
  window.addEventListener('keydown', (event) => {
    if (discover.hidden || event.altKey || event.metaKey || event.ctrlKey) return;
    if (event.key === 'ArrowLeft') { event.preventDefault(); showIndex(active-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); showIndex(active+1); }
    if (event.key === 'Escape') goHome();
  });
  paint();
})();
