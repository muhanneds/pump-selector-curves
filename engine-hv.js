// ============================================================================
// Selection engine for the two surface ranges:
//   * MMP horizontal multistage  (MMP_DATA,          horizontal-data.js)
//   * MTP vertical line-shaft    (MTP_VERTICAL_DATA, vertical-data.js)
//
// These are NOT borehole pumps, so they do not go through engine.js's ladder
// logic. A borehole series is chosen by flow band and then the stage count is
// read off a model list; here the catalogues publish curves (horizontal) and
// duty tables (vertical) directly, so selection is a search over real points.
//
// Both ranges answer the same question -- which pump meets Q and H with the
// least waste -- but they can answer it to different depths:
//
//   VERTICAL publishes absorbed power P at every duty point, so pump
//   efficiency here is MEASURED, not assumed: eta = P_hydraulic / P_absorbed.
//
//   HORIZONTAL publishes head curves but not power, so there is no honest way
//   to state its efficiency. Rather than invent one, the horizontal result
//   reports the catalogue's own motor ladder for that pump/stage/speed and an
//   ESTIMATED shaft power, flagged as an estimate, from an assumed efficiency.
//   Anything derived from that assumption is marked `estimated: true`.
// ============================================================================

// Water at ambient: P_hydraulic(kW) = rho*g*Q*H / 3.6e6 with Q in m3/h, H in m,
// which is the familiar Q*H/367.
const HYD_DIVISOR = 367.0;

// Used only for the horizontal range, where the catalogue gives no power. Mid
// range for a multistage centrifugal at its duty point; every number derived
// from it is labelled as an estimate in the UI.
const ASSUMED_PUMP_EFF = 0.70;

// IE3 typical full-load efficiency by rating (4-pole, 50 Hz). Used to turn a
// pump efficiency into a system efficiency. It is a standards figure, not an
// MSP motor test, so the UI labels the system figure accordingly.
const IE3_EFF = [
  [0.75, 0.803], [1.1, 0.825], [1.5, 0.841], [2.2, 0.855], [3, 0.867],
  [4, 0.876], [5.5, 0.887], [7.5, 0.896], [11, 0.906], [15, 0.913],
  [18.5, 0.918], [22, 0.921], [30, 0.926], [37, 0.930], [45, 0.933],
  [55, 0.936], [75, 0.939], [90, 0.941], [110, 0.943], [132, 0.945],
  [160, 0.947], [200, 0.949], [250, 0.951], [315, 0.952], [1e9, 0.953]
];

// No pump reaches 90% wire-to-water, so an efficiency above this means the
// published absorbed power for that duty point is wrong, not that the pump is
// remarkable. 45 points across 17 models trip it -- some blatantly, e.g.
// MTP 42/7F-A at Q=36 H=136 lists P=1 kW when the hydraulic power alone is
// 13.3 kW. Their head data is still good, so the model stays selectable; only
// the efficiency figures are withheld and the row is flagged powerSuspect.
const MAX_PLAUSIBLE_EFF = 0.90;

function motorEff(kw){
  if (!(kw > 0)) return null;
  for (const [upto, eff] of IE3_EFF) if (kw <= upto) return eff;
  return 0.953;
}

function hydraulicKw(Q, H){
  if (!(Q > 0) || !(H > 0)) return null;
  return Q * H / HYD_DIVISOR;
}

// Linear interpolation on a monotonically increasing x series. Returns null
// when x sits outside the published range -- extrapolating a pump curve past
// its printed ends is exactly the kind of quiet invention this app avoids.
function interpAt(xs, ys, x){
  let n = xs.length;
  while (n > 0 && (xs[n - 1] === null || xs[n - 1] === undefined)) n--;
  if (n === 0) return null;
  if (x < xs[0] || x > xs[n - 1]) return null;
  if (x === xs[n - 1]) return ys[n - 1];
  let i = 0;
  while (i < n - 1 && xs[i + 1] <= x) i++;
  const x0 = xs[i], x1 = xs[i + 1], y0 = ys[i], y1 = ys[i + 1];
  if (y0 == null || y1 == null) return null;
  if (x1 === x0) return y0;
  return y0 + (x - x0) / (x1 - x0) * (y1 - y0);
}

function designHeadOf(H, safetyPct){
  const s = Number(safetyPct) || 0;
  return (Number(H) || 0) * (1 + s / 100);
}

// ---------------------------------------------------------------------------
// Horizontal — MMP
// ---------------------------------------------------------------------------
// The published curves are PER STAGE, so the stage count is what we solve for:
// the fewest stages whose combined head clears the design head. Two catalogue
// limits are hard filters, not preferences:
//   * the casing pressure rating (25 bar DN32-65, 40 bar DN80-150)
//   * the motor ladder -- an empty list means that stage count is simply not
//     offered at that speed (verified on the page: MMP 80/05 prints both speed
//     columns, 80/06 onward prints only 1450)
// ---------------------------------------------------------------------------
function selectHorizontal(opts){
  const Q = Number(opts.Q) || 0;
  const designHead = designHeadOf(opts.H, opts.safety);
  const speedFilter = opts.speed && opts.speed !== 'any' ? String(opts.speed) : null;
  if (!(Q > 0) || !(designHead > 0)) return { designHead, candidates: [] };
  if (typeof MMP_DATA === 'undefined') return { designHead, candidates: [] };

  const out = [];
  for (const [type, td] of Object.entries(MMP_DATA)){
    for (const [rpm, impellers] of Object.entries(td.speeds)){
      if (speedFilter && rpm !== speedFilter) continue;
      for (const [dia, curve] of Object.entries(impellers)){
        const hStage = interpAt(curve.q, curve.h, Q);
        if (hStage == null || !(hStage > 0)) continue;

        const need = Math.ceil(designHead / hStage - 1e-9);
        if (!td.stages.includes(need)) continue;

        const totalHead = need * hStage;
        const bar = totalHead / 10.2;
        if (td.maxBar && bar > td.maxBar) continue;

        const ladder = ((td.motorKw || {})[need] || {})[rpm] || [];
        if (!ladder.length) continue;
        const frames = ((td.motorIec || {})[need] || {})[rpm] || [];

        const pHyd = hydraulicKw(Q, totalHead);
        const pShaft = pHyd / ASSUMED_PUMP_EFF;
        let mi = ladder.findIndex(k => k >= pShaft);
        if (mi < 0) mi = ladder.length - 1;

        out.push({
          range: 'horizontal',
          type, model: type + '/' + String(need).padStart(2, '0'),
          rpm: Number(rpm), impeller: Number(dia),
          stages: need, headPerStage: hStage, achievedHead: totalHead,
          dn: td.dn, bar, maxBar: td.maxBar,
          Q, designHead,
          oversize: (totalHead - designHead) / designHead,
          hydraulicKw: pHyd,
          shaftKw: pShaft, estimated: true, assumedEff: ASSUMED_PUMP_EFF,
          motorLadder: ladder, motorFrames: frames,
          motorKw: ladder[mi], motorIec: frames[mi] || null,
          motorUndersized: ladder[ladder.length - 1] < pShaft
        });
      }
    }
  }

  // Least oversized first -- a pump that just clears the duty wastes the least
  // energy throttling. Ties break to the smaller bore, then fewer stages.
  out.sort((a, b) => a.oversize - b.oversize || a.dn - b.dn || a.stages - b.stages);

  // One entry per type+speed: many impeller trims of the same pump would
  // otherwise fill the whole list with near-identical rows.
  const seen = new Set(), best = [];
  for (const c of out){
    const k = c.type + '|' + c.rpm;
    if (seen.has(k)) continue;
    seen.add(k); best.push(c);
  }
  return { designHead, candidates: best, allCount: out.length };
}

// ---------------------------------------------------------------------------
// Vertical — MTP
// ---------------------------------------------------------------------------
// Every entry is already a complete pump (its own stage count is baked into
// the model code), so this is a filter over published duty points rather than
// a stage search. Because P is published, the ranking is by MEASURED pump
// efficiency at the duty point -- the best answer available, and the reason
// the efficiency work starts on this range.
// ---------------------------------------------------------------------------
// MSP's product code for a vertical pump, revised 8 Sep 2026.
//
//   MTP 12050-02TT (1480 E)
//       ^^ ^^^  ^^^^  ^^^^ ^
//       |  |    |     |    drive: E electric, D diesel
//       |  |    |     running speed, rpm
//       |  |    stage count, then one T per trailing digit of the
//       |  |    original stage segment (2F2 -> 02TT, 1F1 -> 01T, 1F -> 01)
//       |  nominal flow in L/s
//       bore in inches, the first two digits of the series number
//
// Reproduces all five codes MSP supplied for the VG 122 family.
//
// FLOW: the middle of the model's own published flow row, converted to L/s
// and rounded UP to the next 10 -- VG 122's 150 m3/h is 41.7 L/s and MSP
// writes it 050. One caveat worth keeping in view: VG 122 also has a row
// whose middle is exactly 50.0 L/s, so 'round up' and 'this series is simply
// 50' both reproduce the examples and disagree on most other series. If a
// code ever reads wrong on another family, this rounding is the line to
// change and nothing else.
//
// SPEED AND DRIVE are in the code because without them it does not identify a
// pump. Of 1452 models, the number sharing a code with another is:
//   bare code                1119
//   + running speed           743   (diesel and electric builds still collide)
//   + speed and drive          56
// The last 56 are pairs like MTP 124 / MTP 125 -- different pumps that share
// two leading digits and a nominal flow, separable only by a third series
// digit, which the code does not carry. The remaining 56 are pairs like MTP 124 and MTP 125, which are
// different pumps (180-330 vs 180-372 m3/h) that collapse onto the same two
// leading digits and share a nominal flow; only the third series digit could
// separate them, and MSP has chosen to keep the code at two.
function mtpShortCode(m){
  if (!m) return null;
  const num = String(m.series || '').split(' ')[1];
  const q = m.q;
  if (!num || !q || !q.length) return null;
  const mid = q[Math.floor(q.length / 2)];
  if (mid == null || !isFinite(mid)) return null;
  const ls = Math.ceil((mid / 3.6) / 10) * 10;
  const seg = String(m.code || '').split('/')[1];
  const g = seg ? seg.match(/^(\d+)F(\d*)(E?)/) : null;
  if (!g) return null;
  const stage = String(g[1]).padStart(2, '0')
              + 'T'.repeat(g[2] ? Number(g[2]) : 0)
              + (g[3] || '');
  const drive = m.drive === 'Electric' ? 'E' : 'D';
  return 'MTP ' + num.slice(0, 2) + String(ls).padStart(3, '0')
       + '-' + stage + ' (' + m.rpm + ' ' + drive + ')';
}

function selectVertical(opts){
  const Q = Number(opts.Q) || 0;
  const designHead = designHeadOf(opts.H, opts.safety);
  const freq = opts.freq && opts.freq !== 'any' ? opts.freq : null;
  const drive = opts.drive && opts.drive !== 'any' ? opts.drive : null;
  if (!(Q > 0) || !(designHead > 0)) return { designHead, candidates: [] };
  if (typeof MTP_VERTICAL_DATA === 'undefined') return { designHead, candidates: [] };

  const out = [];
  for (const m of MTP_VERTICAL_DATA){
    if (freq && m.freq !== freq) continue;
    if (drive && m.drive !== drive) continue;

    const h = interpAt(m.q, m.h, Q);
    if (h == null || h < designHead) continue;
    const p = interpAt(m.q, m.p, Q);

    const pHyd = hydraulicKw(Q, h);
    let pumpEff = (p > 0 && pHyd != null) ? pHyd / p : null;
    const powerSuspect = pumpEff != null && pumpEff > MAX_PLAUSIBLE_EFF;
    if (powerSuspect) pumpEff = null;
    const mEff = motorEff(m.motorKw || p);
    out.push({
      range: 'vertical',
      code: m.code, series: m.series, ref: m.ref,
      short: mtpShortCode(m),                // MSP product code
      drive: m.drive, freq: m.freq, rpm: m.rpm, stages: m.stages,
      weightKg: m.weightKg, motorKw: m.motorKw, motorHp: m.motorHp,
      Q, designHead, achievedHead: h,
      oversize: (h - designHead) / designHead,
      hydraulicKw: pHyd, absorbedKw: p,
      pumpEff,                                   // measured, from published P
      motorEff: mEff,                            // IE3 reference figure
      systemEff: (pumpEff != null && mEff != null) ? pumpEff * mEff : null,
      powerSuspect,                              // published P fails a sanity check
      estimated: false
    });
  }

  // Least oversized first, then best efficiency.
  //
  // Ranking on efficiency alone reads well but advises badly: within one series
  // the efficiency at a given flow barely moves between stage counts (58.4% vs
  // 58.7% for MTP 125/5F through /10F), so an efficiency-first sort floats a
  // pump 135% over the duty to the top purely on rounding noise. Oversizing is
  // the real selection criterion -- a pump that overshoots gets throttled back
  // and the surplus head is burnt across the valve. Efficiency is shown on
  // every candidate so a slightly larger but genuinely better pump can still be
  // picked deliberately.
  out.sort((a, b) => {
    if (Math.abs(a.oversize - b.oversize) > 0.02) return a.oversize - b.oversize;
    if (a.pumpEff != null && b.pumpEff != null) return b.pumpEff - a.pumpEff;
    return 0;
  });
  return { designHead, candidates: out.slice(0, 12), allCount: out.length };
}

if (typeof module !== 'undefined'){
  module.exports = { selectHorizontal, selectVertical, interpAt, hydraulicKw, mtpShortCode,
                     motorEff, designHeadOf, ASSUMED_PUMP_EFF };
}
