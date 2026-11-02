import { LitElement, css, html, nothing, svg } from 'lit';
import { formatClock } from '../format';

class SbClock extends LitElement {
  static properties = {
    mode: {},
    seconds: { type: Boolean },
    hour12: { type: Boolean },
    period: { type: Boolean },
    _now: { state: true },
  };

  mode: 'digital' | 'analog' | 'both' = 'digital';
  seconds = false;
  hour12 = false;
  period = false;
  private _now = new Date();
  private _timer?: number;

  connectedCallback() {
    super.connectedCallback();
    this._schedule();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.clearTimeout(this._timer);
    this._timer = undefined;
  }

  // Tick on the second when seconds are visible, otherwise on the minute.
  private _schedule() {
    window.clearTimeout(this._timer);
    const perSecond = this.seconds || this.mode !== 'digital';
    const now = Date.now();
    const delay = perSecond ? 1000 - (now % 1000) : 60000 - (now % 60000);
    this._timer = window.setTimeout(() => {
      this._now = new Date();
      this._schedule();
    }, delay + 5);
  }

  protected updated(changed: Map<string, unknown>) {
    if (changed.has('seconds') || changed.has('mode')) this._schedule();
  }

  private _analog() {
    const d = this._now;
    const s = d.getSeconds();
    const m = d.getMinutes() + s / 60;
    const h = (d.getHours() % 12) + m / 60;
    const ticks = Array.from({ length: 12 }, (_, i) => {
      const major = i % 3 === 0;
      return svg`<line class="tick ${major ? 'major' : ''}" x1="50" y1=${major ? 6 : 7} x2="50" y2=${major ? 13 : 11}
        transform="rotate(${i * 30} 50 50)"></line>`;
    });
    return html`<svg class="analog" viewBox="0 0 100 100" role="img" aria-label=${d.toLocaleTimeString()}>
      <circle class="face" cx="50" cy="50" r="48"></circle>
      ${ticks}
      <line class="hand hour" x1="50" y1="50" x2="50" y2="27" transform="rotate(${h * 30} 50 50)"></line>
      <line class="hand minute" x1="50" y1="50" x2="50" y2="14" transform="rotate(${m * 6} 50 50)"></line>
      <line class="hand second" x1="50" y1="58" x2="50" y2="11" transform="rotate(${s * 6} 50 50)"></line>
      <circle class="pin" cx="50" cy="50" r="2.6"></circle>
    </svg>`;
  }

  render() {
    const { time, suffix } = formatClock(this._now, { seconds: this.seconds, hour12: this.hour12, period: this.period });
    return html`
      ${this.mode === 'analog' || this.mode === 'both' ? this._analog() : nothing}
      ${this.mode === 'digital' || this.mode === 'both'
        ? html`<div class="digital ${this.seconds ? 'with-seconds' : ''}">
            ${time}${suffix ? html`<span class="suffix">${suffix}</span>` : nothing}
          </div>`
        : nothing}
    `;
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: 12px;
      container-type: inline-size;
    }
    .digital {
      font-size: clamp(44px, 30cqi, 112px);
      line-height: 0.95;
      font-weight: 250;
      letter-spacing: -0.03em;
      font-variant-numeric: tabular-nums;
      color: var(--sb-text);
    }
    .digital.with-seconds {
      font-size: clamp(36px, 22cqi, 84px);
    }
    .suffix {
      font-size: 0.32em;
      margin-left: 0.25em;
      letter-spacing: 0;
      color: var(--sb-muted);
      text-transform: uppercase;
    }
    .analog {
      width: min(100%, 220px);
      aspect-ratio: 1;
      align-self: center;
    }
    .face {
      fill: var(--face-color, color-mix(in srgb, var(--sb-text) 4%, transparent));
      stroke: var(--face-border-color, color-mix(in srgb, var(--sb-text) 12%, transparent));
      stroke-width: 1;
    }
    .tick {
      stroke: var(--sb-muted);
      stroke-width: 1;
      stroke-linecap: round;
    }
    .tick.major {
      stroke: var(--sb-text);
      stroke-width: 2;
    }
    .hand {
      stroke: var(--clock-hands-color, var(--sb-text));
      stroke-linecap: round;
    }
    .hour {
      stroke-width: 4;
    }
    .minute {
      stroke-width: 2.6;
    }
    .second {
      stroke: var(--clock-seconds-hand-color, var(--sb-accent));
      stroke-width: 1.2;
    }
    .pin {
      fill: var(--clock-middle-background, var(--sb-accent));
      stroke: var(--clock-middle-border, none);
    }
  `;
}

if (!customElements.get('sidebar-card-clock')) customElements.define('sidebar-card-clock', SbClock);
