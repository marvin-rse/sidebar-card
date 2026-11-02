import { LitElement, css, html, nothing, svg } from 'lit';
import { formatNumber } from '../format';
import { entityName } from '../ha';
import { localize } from '../localize';
import type { HomeAssistant, TrendBand, TrendItemConfig, TrendsConfig } from '../types';

interface Point {
  t: number;
  v: number;
}

const MAX_POINTS = 120;
const AUTO_PAUSE_MS = 60_000;
const SERIES_COLORS = ['var(--sb-accent)', 'var(--orange-color, #ff9800)', 'var(--cyan-color, #00bcd4)'];

const AQI_BANDS: TrendBand[] = [
  { max: 50, label: 'aqi.0', color: '#00c853' },
  { max: 100, label: 'aqi.1', color: '#ffd600' },
  { max: 150, label: 'aqi.2', color: '#ff9100' },
  { max: 200, label: 'aqi.3', color: '#ff1744' },
  { max: 300, label: 'aqi.4', color: '#aa00ff' },
  { max: 500, label: 'aqi.5', color: '#880e4f' },
];

export function parseRange(range: string): number {
  const m = /^(\d+(?:\.\d+)?)\s*([hd])$/i.exec(String(range).trim());
  if (!m) return 24 * 3600_000;
  return Number(m[1]) * (m[2].toLowerCase() === 'd' ? 86400_000 : 3600_000);
}

function seriesOf(item: TrendItemConfig) {
  const list = item.entities?.length ? item.entities : item.entity ? [item.entity] : [];
  return list
    .map((e) => (typeof e === 'string' ? { entity: e } : e))
    .filter((e) => !!e?.entity)
    .slice(0, 3);
}

/** Averages points into evenly sized time buckets so long ranges stay light. */
function bucket(points: Point[], start: number, end: number): Point[] {
  if (points.length <= MAX_POINTS) return points;
  const size = (end - start) / MAX_POINTS;
  const out: Point[] = [];
  let i = 0;
  for (let b = 0; b < MAX_POINTS; b++) {
    const until = start + (b + 1) * size;
    let sum = 0;
    let n = 0;
    while (i < points.length && points[i].t < until) {
      sum += points[i].v;
      n++;
      i++;
    }
    if (n) out.push({ t: start + (b + 0.5) * size, v: sum / n });
  }
  return out;
}

class SbTrends extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { attribute: false },
    _page: { state: true },
    _range: { state: true },
    _hover: { state: true },
  };

  hass?: HomeAssistant;
  config?: TrendsConfig;
  private _page = 0;
  private _range = 0;
  private _hover: number | null = null;
  private _data = new Map<string, Point[]>();
  private _unsub?: () => Promise<void>;
  private _subKey = '';
  private _autoTimer?: number;
  private _pausedUntil = 0;
  private _downX: number | null = null;

  private get _items() {
    return (this.config?.items ?? []).filter((i) => seriesOf(i).length);
  }

  private get _ranges() {
    return this.config?.ranges?.length ? this.config.ranges : ['24h', '7d'];
  }

  connectedCallback() {
    super.connectedCallback();
    this._startAuto();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._unsubscribe();
    window.clearInterval(this._autoTimer);
  }

  protected updated(changed: Map<string, unknown>) {
    if (changed.has('config')) this._startAuto();
    if (!this.hass) return;
    const ids = [...new Set(this._items.flatMap((i) => seriesOf(i).map((s) => s.entity)))];
    const key = `${ids.join(',')}|${this._ranges[this._range]}`;
    if (key !== this._subKey) this._subscribe(ids, key);
  }

  private _unsubscribe() {
    this._unsub?.().catch(() => undefined);
    this._unsub = undefined;
    this._subKey = '';
  }

  // history/stream sends the window's history first and then every new state.
  private async _subscribe(ids: string[], key: string) {
    this._unsubscribe();
    this._subKey = key;
    this._data = new Map();
    if (!ids.length || !this.hass) return;
    const span = parseRange(this._ranges[this._range]);
    try {
      const unsub = await this.hass.connection.subscribeMessage<any>((msg) => this._onHistory(msg), {
        type: 'history/stream',
        entity_ids: ids,
        start_time: new Date(Date.now() - span).toISOString(),
        minimal_response: true,
        no_attributes: true,
        significant_changes_only: false,
      });
      if (this._subKey !== key || !this.isConnected) unsub().catch(() => undefined);
      else this._unsub = unsub;
    } catch (err) {
      console.warn('sidebar-card: could not subscribe to history', err);
    }
  }

  private _onHistory(msg: any) {
    const states = msg?.states;
    if (!states) return;
    for (const id of Object.keys(states)) {
      const list = this._data.get(id) ?? [];
      for (const s of states[id] ?? []) {
        const v = parseFloat(s.s ?? s.state);
        const t = s.lu !== undefined ? s.lu * 1000 : s.lc !== undefined ? s.lc * 1000 : Date.parse(s.last_updated ?? s.last_changed);
        if (!Number.isNaN(v) && !Number.isNaN(t)) list.push({ t, v });
      }
      list.sort((a, b) => a.t - b.t);
      this._data.set(id, list);
    }
    this.requestUpdate();
  }

  private _points(entity: string, start: number, end: number) {
    const all = (this._data.get(entity) ?? []).filter((p) => p.t >= start);
    const live = parseFloat(this.hass?.states[entity]?.state ?? '');
    if (!Number.isNaN(live)) all.push({ t: end, v: live });
    return bucket(all, start, end);
  }

  private _startAuto() {
    window.clearInterval(this._autoTimer);
    const secs = Number(this.config?.autoAdvance ?? 0);
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!this.isConnected || secs < 3 || reduced) return;
    this._autoTimer = window.setInterval(() => {
      if (Date.now() < this._pausedUntil || this._items.length < 2) return;
      this._go(this._page + 1);
    }, secs * 1000);
  }

  private _pause() {
    this._pausedUntil = Date.now() + AUTO_PAUSE_MS;
  }

  private _go(page: number) {
    const n = this._items.length;
    this._page = n ? (page + n) % n : 0;
    this._hover = null;
  }

  private _onDown(e: PointerEvent) {
    this._pause();
    this._downX = e.clientX;
  }

  private _onUp(e: PointerEvent) {
    if (this._downX === null) return;
    const dx = e.clientX - this._downX;
    this._downX = null;
    if (Math.abs(dx) > 40) this._go(this._page + (dx < 0 ? 1 : -1));
  }

  private _onMove(e: PointerEvent, count: number) {
    if (e.pointerType !== 'mouse' || count < 2) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    this._hover = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
  }

  render() {
    const items = this._items;
    if (!this.hass || !items.length) return nothing;
    const lang = this.hass.language;
    const item = items[Math.min(this._page, items.length - 1)];
    const series = seriesOf(item);
    const end = Date.now();
    const start = end - parseRange(this._ranges[this._range]);
    const data = series.map((s) => this._points(s.entity, start, end));
    const values = data.flat().map((p) => p.v);
    const bands = item.bands === 'aqi' ? AQI_BANDS : Array.isArray(item.bands) ? item.bands : [];

    let lo = item.min ?? Math.min(...values);
    let hi = item.max ?? Math.max(...values);
    if (!Number.isFinite(lo) || !Number.isFinite(hi)) {
      lo = 0;
      hi = 1;
    }
    if (hi - lo < 1e-9) {
      lo -= 1;
      hi += 1;
    }
    const pad = (hi - lo) * 0.08;
    if (item.min === undefined) lo -= pad;
    if (item.max === undefined) hi += pad;
    const x = (t: number) => ((t - start) / (end - start)) * 100;
    const y = (v: number) => 40 - ((v - lo) / (hi - lo)) * 40;

    const first = series[0];
    const firstObj = this.hass.states[first.entity];
    const unit = firstObj?.attributes.unit_of_measurement ?? '';
    const current = parseFloat(firstObj?.state ?? '');
    const hoverPoint = this._hover !== null && data[0].length ? data[0][Math.round(this._hover * (data[0].length - 1))] : null;
    const shown = hoverPoint ? hoverPoint.v : current;
    const band = !Number.isNaN(current) ? bands.find((b) => current <= b.max) : undefined;

    const line = (points: Point[]) => points.map((p, i) => `${i ? 'L' : 'M'}${x(p.t).toFixed(2)},${y(p.v).toFixed(2)}`).join('');

    return html`<section
      class="tile"
      @pointerdown=${this._onDown}
      @pointerup=${this._onUp}
      @pointercancel=${() => (this._downX = null)}
    >
      <header>
        <div class="title">${item.name ?? entityName(this.hass, first.entity)}</div>
        ${band ? html`<span class="pill" style="--band:${band.color}">${localize(lang, band.label)}</span>` : nothing}
      </header>
      <div class="value">
        ${Number.isNaN(shown) ? '–' : formatNumber(shown, lang)}<span class="unit">${unit}</span>
        ${hoverPoint
          ? html`<span class="when">${new Date(hoverPoint.t).toLocaleString(lang, { weekday: 'short', hour: '2-digit', minute: '2-digit' })}</span>`
          : nothing}
      </div>
      ${series.length > 1
        ? html`<div class="legend">
            ${series.map((s, i) => {
              const v = parseFloat(this.hass!.states[s.entity]?.state ?? '');
              return html`<span><i style="background:${SERIES_COLORS[i]}"></i>${s.name ?? entityName(this.hass!, s.entity)}
                ${Number.isNaN(v) ? '' : formatNumber(v, lang)}</span>`;
            })}
          </div>`
        : nothing}
      <div class="chart" @pointermove=${(e: PointerEvent) => this._onMove(e, data[0].length)} @pointerleave=${() => (this._hover = null)}>
        ${values.length
          ? svg`<svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stop-color=${SERIES_COLORS[0]} stop-opacity="0.28"></stop>
                  <stop offset="1" stop-color=${SERIES_COLORS[0]} stop-opacity="0"></stop>
                </linearGradient>
              </defs>
              ${bands.map((b, i) => {
                const from = i ? bands[i - 1].max : -Infinity;
                const top = y(Math.min(b.max, hi));
                const bottom = y(Math.max(from, lo));
                return bottom > top ? svg`<rect x="0" width="100" y=${top} height=${bottom - top} fill=${b.color} opacity="0.1"></rect>` : nothing;
              })}
              ${data[0].length > 1 ? svg`<path class="area" d="${line(data[0])}L100,40L${x(data[0][0].t)},40Z"></path>` : nothing}
              ${data.map((pts, i) => (pts.length > 1 ? svg`<path class="line" d=${line(pts)} stroke=${SERIES_COLORS[i]}></path>` : nothing))}
              ${hoverPoint ? svg`<line class="cursor" x1=${x(hoverPoint.t)} x2=${x(hoverPoint.t)} y1="0" y2="40"></line>` : nothing}
            </svg>`
          : html`<div class="empty">${localize(lang, 'trends.no_data')}</div>`}
      </div>
      <footer>
        <div class="ranges">
          ${this._ranges.map(
            (r, i) => html`<button class=${i === this._range ? 'on' : ''} @click=${() => { this._pause(); this._range = i; }}>${r}</button>`,
          )}
        </div>
        ${items.length > 1
          ? html`<div class="dots">
              ${items.map(
                (_, i) => html`<button class=${i === this._page ? 'on' : ''} aria-label=${String(i + 1)} @click=${() => { this._pause(); this._go(i); }}></button>`,
              )}
            </div>`
          : nothing}
      </footer>
    </section>`;
  }

  static styles = css`
    :host {
      display: block;
    }
    .tile {
      padding: 14px 16px 10px;
      border-radius: calc(var(--sb-radius) + 4px);
      background: var(--sb-surface);
      box-shadow: var(--sb-shadow);
      color: var(--sb-text);
      touch-action: pan-y;
      user-select: none;
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .title {
      font-size: 13px;
      color: var(--sb-muted);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .pill {
      flex: none;
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 11px;
      background: color-mix(in srgb, var(--band) 22%, transparent);
      border: 1px solid color-mix(in srgb, var(--band) 60%, transparent);
    }
    .value {
      margin-top: 2px;
      font-size: 30px;
      font-weight: 300;
      font-variant-numeric: tabular-nums;
      display: flex;
      align-items: baseline;
      gap: 4px;
      flex-wrap: wrap;
    }
    .unit {
      font-size: 15px;
      color: var(--sb-muted);
    }
    .when {
      margin-left: auto;
      font-size: 12px;
      color: var(--sb-muted);
    }
    .legend {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 12px;
      font-size: 12px;
      color: var(--sb-muted);
    }
    .legend i {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 5px;
    }
    .chart {
      height: 72px;
      margin: 8px 0 4px;
    }
    svg {
      width: 100%;
      height: 100%;
      overflow: visible;
    }
    .area {
      fill: url(#fill);
    }
    .line {
      fill: none;
      stroke-width: 2;
      vector-effect: non-scaling-stroke;
      stroke-linejoin: round;
      stroke-linecap: round;
    }
    .cursor {
      stroke: var(--sb-muted);
      stroke-width: 1;
      vector-effect: non-scaling-stroke;
      stroke-dasharray: 2 2;
    }
    .empty {
      height: 100%;
      display: grid;
      place-items: center;
      font-size: 13px;
      color: var(--sb-muted);
    }
    footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    button {
      all: unset;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }
    .ranges {
      display: flex;
      gap: 4px;
    }
    .ranges button {
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 12px;
      color: var(--sb-muted);
    }
    .ranges button.on {
      background: var(--sb-active-bg);
      color: var(--sb-accent);
      font-weight: 500;
    }
    .dots {
      display: flex;
      gap: 2px;
    }
    .dots button {
      width: 22px;
      height: 22px;
      display: grid;
      place-items: center;
    }
    .dots button::after {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--sb-muted);
      opacity: 0.4;
      transition: opacity 150ms ease, transform 150ms ease;
    }
    .dots button.on::after {
      opacity: 1;
      background: var(--sb-accent);
      transform: scale(1.2);
    }
  `;
}

if (!customElements.get('sidebar-card-trends')) customElements.define('sidebar-card-trends', SbTrends);
