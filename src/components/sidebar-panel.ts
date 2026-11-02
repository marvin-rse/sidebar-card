import { LitElement, css, html, nothing } from 'lit';
import { formatDate, formatNumber } from '../format';
import { entityName, fireEvent, moreInfo, subscribeTemplate, type Unsubscribe } from '../ha';
import { localize } from '../localize';
import type { HomeAssistant, ResolvedConfig } from '../types';
import './sb-cards';
import './sb-clock';
import './sb-menu';
import './sb-status';
import './sb-trends';

const WEATHER_ICONS: Record<string, string> = {
  'clear-night': 'mdi:weather-night',
  cloudy: 'mdi:weather-cloudy',
  exceptional: 'mdi:alert-circle-outline',
  fog: 'mdi:weather-fog',
  hail: 'mdi:weather-hail',
  lightning: 'mdi:weather-lightning',
  'lightning-rainy': 'mdi:weather-lightning-rainy',
  partlycloudy: 'mdi:weather-partly-cloudy',
  pouring: 'mdi:weather-pouring',
  rainy: 'mdi:weather-rainy',
  snowy: 'mdi:weather-snowy',
  'snowy-rainy': 'mdi:weather-snowy-rainy',
  sunny: 'mdi:weather-sunny',
  windy: 'mdi:weather-windy',
  'windy-variant': 'mdi:weather-windy-variant',
};

/** Splits a rendered `template` into lines: one per <li>/<div>, else per text line. */
export function templateLines(result: unknown): string[] {
  const text = String(result ?? '');
  if (/<(li|div)[\s>]/i.test(text)) {
    const doc = new DOMParser().parseFromString(`<body>${text}</body>`, 'text/html');
    return [...doc.body.querySelectorAll('li, div')]
      .filter((el) => !el.querySelector('li, div'))
      .map((el) => el.textContent?.replace(/\s+/g, ' ').trim() ?? '')
      .filter(Boolean);
  }
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export class SidebarPanel extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { attribute: false },
    path: {},
    editMode: { type: Boolean, reflect: true, attribute: 'edit-mode' },
    _lines: { state: true },
  };

  hass?: HomeAssistant;
  config?: ResolvedConfig;
  path = '';
  editMode = false;
  private _lines: string[] = [];
  private _templateSub?: Unsubscribe;
  private _template?: string;
  private _dateTimer?: number;

  connectedCallback() {
    super.connectedCallback();
    this._dateTimer = window.setInterval(() => this.requestUpdate(), 60_000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.clearInterval(this._dateTimer);
    this._templateSub?.();
    this._templateSub = undefined;
    this._template = undefined;
  }

  protected willUpdate() {
    const tpl = this.config?.template;
    if (!this.hass || tpl === this._template) return;
    this._templateSub?.();
    this._templateSub = undefined;
    this._template = tpl;
    this._lines = [];
    if (tpl) {
      this._templateSub = subscribeTemplate(
        this.hass,
        tpl,
        (result) => (this._lines = templateLines(result)),
        (error) => console.warn('sidebar-card: template failed:', error),
      );
    }
  }

  private _head(c: ResolvedConfig, hass: HomeAssistant) {
    const weather = c.weatherEntity ? hass.states[c.weatherEntity] : undefined;
    const temp = weather?.attributes.temperature;
    const showDate = c.date;
    return html`
      ${c.clock !== 'none'
        ? html`<sidebar-card-clock
            .mode=${c.clock}
            .seconds=${c.clockSeconds}
            .hour12=${c.hour12}
            .period=${c.period}
          ></sidebar-card-clock>`
        : nothing}
      ${c.title ? html`<h1 class="title">${c.title}</h1>` : nothing}
      ${showDate || weather
        ? html`<div class="date-row">
            ${showDate ? html`<span class="date">${formatDate(new Date(), hass.language, c.dateFormat)}</span>` : nothing}
            ${weather
              ? html`<button class="weather" @click=${() => moreInfo(this, weather.entity_id)}>
                  <ha-icon .icon=${WEATHER_ICONS[weather.state] ?? 'mdi:weather-partly-cloudy'}></ha-icon>
                  ${temp !== undefined
                    ? html`<span>${formatNumber(Number(temp), hass.language)}${weather.attributes.temperature_unit ?? '°'}</span>`
                    : nothing}
                </button>`
              : nothing}
          </div>`
        : nothing}
    `;
  }

  private _presence(c: ResolvedConfig, hass: HomeAssistant) {
    if (!c.presence.length) return nothing;
    return html`<div class="presence">
      ${c.presence.map((p) => {
        const obj = hass.states[p.entity];
        const name = p.name ?? entityName(hass, p.entity);
        const state = obj?.state ?? 'unknown';
        const where = state === 'home' ? 'home' : state === 'not_home' || state === 'unknown' ? 'away' : 'zone';
        const label = `${name}: ${obj ? (hass.formatEntityState?.(obj) ?? state) : state}`;
        return html`<button class="avatar ${where}" title=${label} aria-label=${label} @click=${() => moreInfo(this, p.entity)}>
          ${obj?.attributes.entity_picture
            ? html`<img src=${obj.attributes.entity_picture} alt="" />`
            : html`<span>${initials(name)}</span>`}
          <i></i>
        </button>`;
      })}
    </div>`;
  }

  render() {
    const c = this.config;
    const hass = this.hass;
    if (!c || !hass) return nothing;
    const glanceBottom = c.glance.position === 'bottom' && c.glance.items.length;
    const glanceAttention = c.glance.position === 'attention' ? c.glance.items : [];

    return html`
      ${c.accentColor ? html`<style>:host{--sb-accent:${c.accentColor}}</style>` : nothing}
      ${c.style ? html`<style>${c.style}</style>` : nothing}
      <div class="scroll">
        <header class="head">${this._head(c, hass)}</header>
        ${this._presence(c, hass)}
        ${this._lines.length ? html`<ul class="info">${this._lines.map((l) => html`<li>${l}</li>`)}</ul>` : nothing}
        <sidebar-card-menu
          .hass=${hass}
          .items=${c.menu}
          .menuStyle=${c.menuStyle}
          .showLabel=${c.showLabel}
          .updateMenu=${c.updateMenu}
          .path=${this.path}
        ></sidebar-card-menu>
        ${c.trends ? html`<sidebar-card-trends .hass=${hass} .config=${c.trends}></sidebar-card-trends>` : nothing}
        <div class="spacer"></div>
        ${c.cards.length ? html`<sidebar-card-cards .hass=${hass} .cards=${c.cards} .cardStyle=${c.cardStyle}></sidebar-card-cards>` : nothing}
      </div>
      ${c.notifications || glanceAttention.length || glanceBottom
        ? html`<footer class="foot">
            ${c.notifications || glanceAttention.length
              ? html`<sidebar-card-attention .hass=${hass} .items=${glanceAttention} .notifications=${c.notifications}></sidebar-card-attention>`
              : nothing}
            ${glanceBottom ? html`<sidebar-card-glance .hass=${hass} .items=${c.glance.items}></sidebar-card-glance>` : nothing}
          </footer>`
        : nothing}
      ${this.editMode
        ? html`<button class="edit" title=${localize(hass.language, 'edit.open')} aria-label=${localize(hass.language, 'edit.open')}
            @click=${() => fireEvent(this, 'sidebar-card-edit')}>
            <ha-icon icon="mdi:cog"></ha-icon>
          </button>`
        : nothing}
    `;
  }

  static styles = css`
    :host {
      /* Public variables from v1 keep working; everything else derives from the HA theme. */
      --sb-accent: var(--sidebar-accent-color, var(--primary-color));
      --sb-bg: var(--sidebar-background, var(--ha-card-background, var(--card-background-color, #fff)));
      --sb-text: var(--sidebar-text-color, var(--primary-text-color));
      --sb-muted: var(--sidebar-muted-color, var(--secondary-text-color));
      --sb-icon: var(--sidebar-icon-color, var(--secondary-text-color));
      --sb-active-text: var(--sidebar-selected-text-color, var(--sb-accent));
      --sb-active-icon: var(--sidebar-selected-icon-color, var(--sb-accent));
      --sb-active-bg: color-mix(in srgb, var(--sb-accent) 14%, transparent);
      --sb-surface: color-mix(in srgb, var(--sb-text) 5%, var(--sb-bg));
      --sb-shadow: none;
      --sb-radius: var(--sidebar-radius, 14px);

      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      contain: layout;
      background: var(--sb-bg);
      color: var(--sb-text);
      border-inline-end: 1px solid var(--sidebar-border-color, var(--divider-color, transparent));
      font-family: var(--ha-font-family-body, inherit);
    }
    .scroll {
      box-sizing: border-box;
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      overscroll-behavior: contain;
      scrollbar-width: thin;
      display: flex;
      flex-direction: column;
      gap: 22px;
      padding: 28px 18px calc(18px + env(safe-area-inset-bottom, 0px));
      /* Soft edge where content scrolls under the footer. */
      mask-image: linear-gradient(to bottom, #000 calc(100% - 20px), transparent);
    }
    .head {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 0 6px;
    }
    .title {
      margin: 0;
      font-size: 26px;
      font-weight: 400;
      line-height: 1.2;
    }
    .date-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }
    .date {
      font-size: 19px;
      color: var(--sb-muted);
      font-weight: 400;
    }
    button {
      all: unset;
      box-sizing: border-box;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }
    button:focus-visible {
      outline: 2px solid var(--sb-accent);
      outline-offset: 2px;
    }
    .weather {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px 4px 8px;
      border-radius: 999px;
      background: var(--sb-surface);
      font-size: 17px;
      font-variant-numeric: tabular-nums;
      --mdc-icon-size: 22px;
    }
    .weather ha-icon {
      color: var(--sb-accent);
    }
    .presence {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      padding: 0 6px;
    }
    .avatar {
      position: relative;
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: var(--sb-surface);
      display: grid;
      place-items: center;
      font-size: 14px;
      font-weight: 500;
      color: var(--sb-text);
      transition: opacity 200ms ease, filter 200ms ease;
    }
    .avatar img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }
    .avatar i {
      position: absolute;
      right: -1px;
      bottom: -1px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid var(--sb-bg);
      background: var(--disabled-text-color, #9e9e9e);
    }
    .avatar.home i {
      background: var(--success-color, #43a047);
    }
    .avatar.zone i {
      background: var(--info-color, #039be5);
    }
    .avatar.away {
      opacity: 0.55;
      filter: grayscale(0.6);
    }
    .info {
      list-style: none;
      margin: 0;
      padding: 0 6px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .info li {
      font-size: 16px;
      line-height: 1.35;
      color: var(--sb-text);
    }
    .spacer {
      flex: 1;
      margin-top: -22px;
    }
    /* Alerts and the status bar stay in view; only the content above scrolls. */
    .foot {
      flex: none;
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 10px 18px calc(14px + env(safe-area-inset-bottom, 0px));
    }
    .foot:not(:has(> :not([empty]))) {
      display: none;
    }
    sidebar-card-attention[empty] {
      display: none;
    }
    /* Keep the clock clear of the edit button. */
    :host([edit-mode]) .scroll {
      padding-top: 68px;
    }
    .edit {
      position: absolute;
      top: 12px;
      inset-inline-end: 12px;
      z-index: 3;
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--sb-accent);
      color: var(--text-primary-color, #fff);
      box-shadow: 0 4px 14px rgb(0 0 0 / 0.25);
      animation: pop 200ms ease;
    }
    @keyframes pop {
      from {
        transform: scale(0.6);
        opacity: 0;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .edit {
        animation: none;
      }
    }
  `;
}

if (!customElements.get('sidebar-card')) customElements.define('sidebar-card', SidebarPanel);
