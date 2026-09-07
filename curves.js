// ============================================================================
// Performance-curve charts.
//
// Draws the catalogue's own picture: a family of Q-H curves with the duty
// point marked on it, so you can see how much margin a selection actually has
// and where it sits on the curve -- flat left-hand side, or already falling
// away on the right.
//
// Plain inline SVG on purpose. This is an offline-first PWA behind a strict
// asset list, so a charting library would be another thing to cache, another
// thing to break, and it would earn none of that: everything here is polylines
// and ticks. Nothing is animated, so a curve is readable the moment it paints.
//
// All three ranges feed the same renderer, because all three end up as the
// same shape -- x flow, y head or power, one highlighted line among faint
// siblings:
//   Selector    every model in the series, the selected one picked out
//   Horizontal  per-stage catalogue curve x stage count, for each impeller trim
//   Vertical    the model's published duty points, plus its power curve
// ============================================================================

// The SVG is scaled to its container, so viewBox units are NOT pixels: a
// 640-unit box rendered 322px wide on a phone shrinks 10-unit tick text to
// about 5px. Sizing the box near the width it will actually occupy keeps
// 1 unit ~ 1px, so the labels stay the size they say they are.
const PAD = { t: 14, r: 16, b: 40, l: 52 };

function chartBox(){
  const w = (typeof window !== "undefined" && window.innerWidth) || 640;
  const tab = (typeof currentTab !== "undefined") ? currentTab : "selector";
  let inner;
  if (w >= 900){
    // Desktop shell: 1160px cap, 30px main padding, 20px card padding. The
    // Selector gives its curve the full width of both columns; the surface
    // tabs keep theirs in the result column beside a 400px form.
    const content = Math.min(1160, w) - 60;
    inner = (tab === "selector") ? content - 40 : content - 428 - 40;
  } else {
    // Phone/tablet: single 560px column, 14px main padding, 12px card padding.
    inner = Math.min(560, w) - 28 - 24;
  }
  const W = Math.max(300, Math.round(inner));
  // A very wide frame with a 300-unit height turns the curve into a flat
  // smear, so the taller frame is only used once there is width to justify it.
  return { W: W, H: W > 850 ? 380 : 300 };
}

// Axis ticks land on 1/2/2.5/5 x 10^n so the labels stay round however the
// duty point scales the axes -- a pump curve's ranges vary by three orders of
// magnitude across the catalogue (2 m3/h borehole to 2580 m3/h vertical).
function niceStep(span, target){
  const raw = span / Math.max(1, target);
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const n = raw / mag;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * mag;
}

function axisTicks(lo, hi, target){
  const step = niceStep(hi - lo, target);
  const out = [];
  for (let v = Math.ceil(lo / step) * step; v <= hi + step * 1e-6; v += step){
    out.push(Math.abs(v) < step * 1e-6 ? 0 : Number(v.toFixed(6)));
  }
  return out;
}

function axisFmt(v){
  if (v === 0) return '0';
  const a = Math.abs(v);
  if (a >= 1000) return String(Math.round(v));
  if (a >= 10) return String(Math.round(v * 10) / 10).replace(/\.0$/, '');
  return String(Math.round(v * 100) / 100);
}

/**
 * opts = {
 *   series : [{ q:[], y:[], cls:'main'|'sib', label? }]   // at least one
 *   duty   : { q, y } | null                              // marked with cross-hairs
 *   guide  : number | null                                // dashed design-head line
 *   yLabel, xLabel : string
 *   height : number
 * }
 */
function curveChartSVG(opts){
  const series = (opts.series || []).filter(s => s.q && s.q.length > 1);
  if (!series.length) return '';
  const box = chartBox();
  const CHART_W = box.W;
  const H = opts.height || box.H;

  let xs = [], ys = [];
  series.forEach(s => { xs = xs.concat(s.q); });
  // The y-scale follows the SELECTED curve, not the whole family. A borehole
  // series spans 1 to 60 stages, so scaling to the tallest sibling squashed the
  // chosen pump into the bottom eighth of the plot -- the one curve you opened
  // the chart to read. Siblings still draw for context and are clipped at the
  // frame, the way a catalogue page crops them.
  const main = series.filter(s => (s.cls || '').indexOf('main') >= 0);
  (main.length ? main : series).forEach(s => { ys = ys.concat(s.y); });
  if (opts.duty){ xs.push(opts.duty.q); ys.push(opts.duty.y); }
  if (opts.guide != null) ys.push(opts.guide);
  xs = xs.filter(v => v != null && isFinite(v));
  ys = ys.filter(v => v != null && isFinite(v));
  if (xs.length < 2 || !ys.length) return '';

  const x0 = 0;
  const x1 = Math.max.apply(null, xs) * 1.04 || 1;
  // Head charts read naturally from zero; power charts too, and starting both
  // at zero keeps the shape of the curve honest rather than exaggerating it.
  const y0 = 0;
  const y1 = Math.max.apply(null, ys) * 1.08 || 1;

  const px = q => PAD.l + (q - x0) / (x1 - x0) * (CHART_W - PAD.l - PAD.r);
  const py = v => H - PAD.b - (v - y0) / (y1 - y0) * (H - PAD.t - PAD.b);

  const xt = axisTicks(x0, x1, 6), yt = axisTicks(y0, y1, 5);

  const grid = xt.map(v =>
      `<line x1="${px(v).toFixed(1)}" y1="${PAD.t}" x2="${px(v).toFixed(1)}" y2="${H - PAD.b}" class="cg"/>`)
    .concat(yt.map(v =>
      `<line x1="${PAD.l}" y1="${py(v).toFixed(1)}" x2="${CHART_W - PAD.r}" y2="${py(v).toFixed(1)}" class="cg"/>`))
    .join('');

  const xlabels = xt.map(v =>
      `<text x="${px(v).toFixed(1)}" y="${H - PAD.b + 15}" class="ct" text-anchor="middle">${axisFmt(v)}</text>`).join('');
  const ylabels = yt.map(v =>
      `<text x="${PAD.l - 7}" y="${(py(v) + 3.5).toFixed(1)}" class="ct" text-anchor="end">${axisFmt(v)}</text>`).join('');

  const paths = series.map(s => {
    const pts = [];
    for (let i = 0; i < s.q.length; i++){
      const a = s.q[i], b = s.y[i];
      if (a == null || b == null || !isFinite(a) || !isFinite(b)) continue;
      pts.push(px(a).toFixed(1) + ',' + py(b).toFixed(1));
    }
    if (pts.length < 2) return '';
    return `<polyline points="${pts.join(' ')}" class="cl ${s.cls || 'sib'}"/>`;
  }).join('');
  const clipId = 'cp' + Math.random().toString(36).slice(2, 8);
  const clip = `<clipPath id="${clipId}"><rect x="${PAD.l}" y="${PAD.t}" `
    + `width="${CHART_W - PAD.l - PAD.r}" height="${H - PAD.t - PAD.b}"/></clipPath>`;

  let guide = '';
  if (opts.guide != null && isFinite(opts.guide) && opts.guide <= y1){
    guide = `<line x1="${PAD.l}" y1="${py(opts.guide).toFixed(1)}" x2="${CHART_W - PAD.r}" y2="${py(opts.guide).toFixed(1)}" class="cguide"/>`;
  }

  let duty = '';
  if (opts.duty && isFinite(opts.duty.q) && isFinite(opts.duty.y)){
    const cx = px(opts.duty.q), cy = py(opts.duty.y);
    duty =
      `<line x1="${PAD.l}" y1="${cy.toFixed(1)}" x2="${cx.toFixed(1)}" y2="${cy.toFixed(1)}" class="cdrop"/>` +
      `<line x1="${cx.toFixed(1)}" y1="${(H - PAD.b).toFixed(1)}" x2="${cx.toFixed(1)}" y2="${cy.toFixed(1)}" class="cdrop"/>` +
      `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="5.5" class="cdot"/>`;
  }

  const axes =
    `<line x1="${PAD.l}" y1="${PAD.t}" x2="${PAD.l}" y2="${H - PAD.b}" class="ca"/>` +
    `<line x1="${PAD.l}" y1="${H - PAD.b}" x2="${CHART_W - PAD.r}" y2="${H - PAD.b}" class="ca"/>`;

  const axisNames =
    `<text x="${CHART_W - PAD.r}" y="${H - 4}" class="cax" text-anchor="end">${opts.xLabel || ''}</text>` +
    `<text x="${PAD.l - 7}" y="${PAD.t - 3}" class="cax" text-anchor="end">${opts.yLabel || ''}</text>`;

  return `<svg class="curve" viewBox="0 0 ${CHART_W} ${H}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${opts.aria || ''}">`
       + clip + grid + guide + `<g clip-path="url(#${clipId})">` + paths + `</g>` + duty + axes + xlabels + ylabels + axisNames + `</svg>`;
}

// --- per-range adapters -----------------------------------------------------

// Borehole: the catalogue prints one flow row per series and a head row per
// model, so the whole series draws as a family and the picked model is lifted
// out of it -- the same way you'd read it off the printed page.
function boreholeCurve(seriesTag, modelName, dutyQ, dutyH, designHead){
  const s = (typeof PUMP_DATA !== 'undefined') && PUMP_DATA[seriesTag];
  if (!s) return '';
  const series = s.models.map(m => ({
    q: s.flows, y: m.heads, cls: m.name === modelName ? 'main' : 'sib'
  }));
  return curveChartSVG({
    series,
    duty: (dutyQ > 0 && dutyH > 0) ? { q: dutyQ, y: dutyH } : null,
    guide: designHead,
    xLabel: 'Q  m³/h', yLabel: 'H  m',
    aria: modelName || seriesTag
  });
}

// Horizontal: catalogue heads are PER STAGE, so each impeller trim is scaled
// by the stage count actually selected. Sibling trims are drawn at the same
// stage count, which is what the pump would give with a different impeller.
function horizontalCurve(cand){
  const td = (typeof MMP_DATA !== 'undefined') && MMP_DATA[cand.type];
  if (!td) return '';
  const impellers = td.speeds[String(cand.rpm)] || {};
  const series = Object.keys(impellers).map(dia => ({
    q: impellers[dia].q,
    y: impellers[dia].h.map(h => h * cand.stages),
    cls: Number(dia) === cand.impeller ? 'main' : 'sib'
  }));
  return curveChartSVG({
    series,
    duty: { q: cand.Q, y: cand.achievedHead },
    guide: cand.designHead,
    xLabel: 'Q  m³/h', yLabel: 'H  m',
    aria: cand.model
  });
}

// Vertical: the published duty points are the curve. Power gets its own panel
// below rather than a second y-axis -- two scales on one frame is how catalogue
// charts get misread.
function verticalCurve(cand){
  const m = (typeof MTP_VERTICAL_DATA !== 'undefined')
    && MTP_VERTICAL_DATA.find(x => x.ref === cand.ref && x.code === cand.code && x.rpm === cand.rpm);
  if (!m) return '';
  const head = curveChartSVG({
    series: [{ q: m.q, y: m.h, cls: 'main' }],
    duty: { q: cand.Q, y: cand.achievedHead },
    guide: cand.designHead,
    xLabel: 'Q  m³/h', yLabel: 'H  m',
    aria: cand.code
  });
  const hasP = m.p.some(v => v != null && v > 0);
  const power = hasP ? curveChartSVG({
    series: [{ q: m.q, y: m.p, cls: 'main power' }],
    duty: (cand.absorbedKw > 0) ? { q: cand.Q, y: cand.absorbedKw } : null,
    xLabel: 'Q  m³/h', yLabel: 'P  kW',
    height: 190, aria: cand.code + ' power'
  }) : '';
  return { head, power };
}
