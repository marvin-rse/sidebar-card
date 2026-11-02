import { LitElement, css, html, nothing } from 'lit';
import { formatNumber, formatRelative } from '../format';
import { entityName, formatState, isActiveState, moreInfo, runAction } from '../ha';
import { localize } from '../localize';
import type { GlanceCondition, GlanceItem, GlanceTone, HomeAssistant } from '../types';

const TONE_RANK: Record<GlanceTone, number> = { alert: 0, warning: 1, info: 2 };
const ALERTS_VISIBLE = 2;

function minutes(time: string) {
  const [h, m] = time.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function evalCondition(hass: HomeAssistant, cond: GlanceItem['show'], defaultEntity: string): boolean {
  if (!cond || cond === 'always') return true;
  const c: GlanceCondition = typeof cond === 'string' ? { condition: cond } : cond;
  const obj = hass.states[c.entity || defaultEntity];
  const targets = Array.isArray(c.state) ? c.state : [c.state ?? ''];
  const value = obj ? parseFloat(obj.state) : NaN;
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  switch (c.condition) {
    case 'always': return true;
    case 'state': return !!obj && targets.includes(obj.state);
    case 'state_not': return !obj || !targets.includes(obj.state);
    case 'numeric_above': return c.threshold !== undefined && value > c.threshold;
    case 'numeric_below': return c.threshold !== undefined && value < c.threshold;
    case 'time_after': return !!c.after && nowMin >= minutes(c.after);
    case 'time_before': return !!c.before && nowMin < minutes(c.before);
    case 'sun_below_horizon': return hass.states['sun.sun']?.state === 'below_horizon';
    case 'sun_above_horizon': return hass.states['sun.sun']?.state === 'above_horizon';
    default: return false;
  }
}

/** Tone of an attention row, or null when a threshold item is within range. */
export function itemTone(hass: HomeAssistant, item: GlanceItem): GlanceTone | null {
  const tone = item.tone ?? 'alert';
  if (typeof tone === 'string') return tone;
  const v = parseFloat(hass.states[item.entity]?.state ?? '');
  if (Number.isNaN(v)) return null;
  if ((tone.alert_above !== undefined && v > tone.alert_above) || (tone.alert_below !== undefined && v < tone.alert_below)) return 'alert';
  if ((tone.warn_above !== undefined && v > tone.warn_above) || (tone.warn_below !== undefined && v < tone.warn_below)) return 'warning';
  return null;
}

function itemLabel(hass: HomeAssistant, item: GlanceItem) {
  const obj = hass.states[item.entity];
  const name = item.name ?? entityName(hass, item.entity);
  if (!item.label) return name;
  const numeric = obj ? parseFloat(obj.state) : NaN;
  const state = !obj ? '' : Number.isNaN(numeric) ? formatState(hass, item.entity) : formatNumber(numeric, hass.language, 2);
  return item.label
    .replace(/\{name\}/g, name)
    .replace(/\{state\}/g, state)
    .replace(/\{unit\}/g, obj?.attributes.unit_of_measurement ?? '');
}

function tapItem(node: HTMLElement, item: GlanceItem) {
  if (item.tap_action) runAction(node, { entity: item.entity, tap_action: item.tap_action });
  else moreInfo(node, item.entity);
}

interface PersistentNotification {
  notification_id: string;
  title?: string;
  message: string;
  created_at: string;
}

function plainText(markdown: string) {
  return markdown
    .replace(/!\[[^\]]*]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .replace(/[*_`#>]+/g, '')
    .trim();
}

/** Alerts and notifications, anchored above the bottom content. */
class SbAttention extends LitElement {
  static properties = {
    hass: { attribute: false },
    items: { attribute: false },
    notifications: { type: Boolean },
    _list: { state: true },
    _expanded: { state: true },
    _panelOpen: { state: true },
  };

  hass?: HomeAssistant;
  items: GlanceItem[] = [];
  notifications = false;
  private _list: PersistentNotification[] = [];
  private _expanded = false;
  private _panelOpen = false;
  private _byId = new Map<string, PersistentNotification>();
  private _unsub?: () => Promise<void>;
  private _subscribing = false;

  disconnectedCallback() {
    super.disconnectedCallback();
    this._unsubscribe();
  }

  protected updated() {
    if (this.notifications && this.hass && !this._unsub && !this._subscribing) this._subscribe();
    if (!this.notifications && this._unsub) this._unsubscribe();
  }

  private async _subscribe() {
    this._subscribing = true;
    try {
      this._unsub = await this.hass!.connection.subscribeMessage<any>((msg) => this._onMessage(msg), {
        type: 'persistent_notification/subscribe',
      });
      if (!this.isConnected) this._unsubscribe();
    } catch (err) {
      console.warn('sidebar-card: could not subscribe to notifications', err);
    } finally {
      this._subscribing = false;
    }
  }

  private _unsubscribe() {
    this._unsub?.().catch(() => undefined);
    this._unsub = undefined;
    this._byId.clear();
    this._list = [];
  }

  // HA re-sends existing ids as added/updated, so key everything by id.
  private _onMessage(msg: any) {
    if (msg.type === 'current') this._byId.clear();
    const changed = (msg.notifications ?? {}) as Record<string, PersistentNotification>;
    if (msg.type === 'removed') Object.keys(changed).forEach((id) => this._byId.delete(id));
    else Object.values(changed).forEach((n) => this._byId.set(n.notification_id, n));
    this._list = [...this._byId.values()].sort((a, b) => b.created_at.localeCompare(a.created_at));
    if (!this._list.length) this._panelOpen = false;
  }

  private _dismiss(id: string) {
    this.hass?.callService('persistent_notification', 'dismiss', { notification_id: id });
  }

  private _dismissAll() {
    this._list.forEach((n) => this._dismiss(n.notification_id));
    this._panelOpen = false;
  }

  private _alerts() {
    const hass = this.hass!;
    return this.items
      .map((item) => {
        const tone = itemTone(hass, item);
        const show = item.show ? evalCondition(hass, item.show, item.entity) : typeof item.tone === 'object' ? tone !== null : isActiveState(hass.states[item.entity]?.state);
        return show && tone ? { item, tone } : null;
      })
      .filter((a): a is { item: GlanceItem; tone: GlanceTone } => !!a)
      .sort((a, b) => TONE_RANK[a.tone] - TONE_RANK[b.tone]);
  }

  private _panel() {
    const lang = this.hass?.language;
    return html`<div class="panel" role="dialog" aria-label=${localize(lang, 'notifications.title')}>
      <header>
        <h2>${localize(lang, 'notifications.title')}</h2>
        <button class="icon-btn" aria-label=${localize(lang, 'notifications.close')} @click=${() => (this._panelOpen = false)}>
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </header>
      <div class="list">
        ${this._list.map(
          (n) => html`<article class="note">
            <div class="note-head">
              <strong>${n.title || localize(lang, 'notifications.title')}</strong>
              <button class="icon-btn small" aria-label=${localize(lang, 'notifications.dismiss')} @click=${() => this._dismiss(n.notification_id)}>
                <ha-icon icon="mdi:close"></ha-icon>
              </button>
            </div>
            <p>${plainText(n.message)}</p>
            <time>${formatRelative(new Date(n.created_at), lang ?? 'en')}</time>
          </article>`,
        )}
      </div>
      <button class="text-btn" @click=${this._dismissAll}>${localize(lang, 'notifications.dismiss_all')}</button>
    </div>`;
  }

  render() {
    if (!this.hass) return nothing;
    const lang = this.hass.language;
    const alerts = this._alerts();
    const shown = this._expanded ? alerts : alerts.slice(0, ALERTS_VISIBLE);
    const hidden = alerts.length - shown.length;
    const notes = this.notifications ? this._list : [];
    this.toggleAttribute('empty', !alerts.length && !notes.length);
    if (!alerts.length && !notes.length) return nothing;

    return html`
      <div class="zone">
        ${shown.map(
          ({ item, tone }) => html`<button class="row ${tone}" @click=${() => tapItem(this, item)}>
            <ha-icon .icon=${item.icon ?? 'mdi:alert-circle-outline'}></ha-icon>
            <span>${itemLabel(this.hass!, item)}</span>
          </button>`,
        )}
        ${hidden > 0 || (this._expanded && alerts.length > ALERTS_VISIBLE)
          ? html`<button class="more" @click=${() => (this._expanded = !this._expanded)}>
              ${hidden > 0 ? localize(lang, 'attention.more', { n: hidden }) : localize(lang, 'attention.less')}
            </button>`
          : nothing}
        ${notes.length
          ? html`<button class="stack ${notes.length > 1 ? 'stacked' : ''}" @click=${() => (this._panelOpen = true)}>
              <ha-icon icon="mdi:bell-badge-outline"></ha-icon>
              <span class="stack-text">
                <strong>${notes.length === 1 ? localize(lang, 'notifications.one') : localize(lang, 'notifications.many', { n: notes.length })}</strong>
                <small>${notes[0].title || plainText(notes[0].message)}</small>
              </span>
            </button>`
          : nothing}
      </div>
      ${this._panelOpen && notes.length ? this._panel() : nothing}
    `;
  }

  static styles = css`
    :host {
      display: block;
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
    .zone {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .row {
      --tone: var(--error-color, #db4437);
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      border-radius: var(--sb-radius);
      background: color-mix(in srgb, var(--tone) 14%, transparent);
      color: var(--sb-text);
      font-size: 15px;
      line-height: 1.3;
      --mdc-icon-size: 20px;
    }
    .row ha-icon {
      color: var(--tone);
      flex: none;
    }
    .row.warning {
      --tone: var(--warning-color, #ffa600);
    }
    .row.info {
      --tone: var(--info-color, #039be5);
    }
    .more {
      align-self: flex-start;
      padding: 4px 14px;
      font-size: 13px;
      color: var(--sb-muted);
    }
    .stack {
      position: relative;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      border-radius: var(--sb-radius);
      background: var(--sb-surface);
      box-shadow: var(--sb-shadow);
      color: var(--sb-text);
      --mdc-icon-size: 22px;
    }
    .stack ha-icon {
      color: var(--sb-accent);
      flex: none;
    }
    /* a second card peeking out underneath when there is more than one */
    .stack.stacked {
      margin-bottom: 6px;
    }
    .stack.stacked::after {
      content: '';
      position: absolute;
      left: 10px;
      right: 10px;
      bottom: -6px;
      height: 10px;
      border-radius: 0 0 var(--sb-radius) var(--sb-radius);
      background: var(--sb-surface);
      opacity: 0.6;
      z-index: -1;
    }
    .stack-text {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .stack-text strong {
      font-weight: 500;
      font-size: 15px;
    }
    .stack-text small {
      color: var(--sb-muted);
      font-size: 13px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    /* Fixed, but contained by the sidebar host (contain: layout), so it
       covers the whole sidebar rather than just the sticky zone. */
    .panel {
      position: fixed;
      inset: 0;
      z-index: 2;
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: calc(16px + var(--sb-pad-top, 0px)) 16px calc(16px + env(safe-area-inset-bottom, 0px));
      box-sizing: border-box;
      background: var(--sb-bg);
      animation: slide-in 220ms ease;
    }
    @keyframes slide-in {
      from {
        opacity: 0;
        transform: translateY(12px);
      }
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 500;
      color: var(--sb-text);
    }
    .icon-btn {
      display: inline-flex;
      padding: 10px;
      border-radius: 50%;
      color: var(--sb-icon);
    }
    .icon-btn.small {
      padding: 6px;
      --mdc-icon-size: 18px;
    }
    .list {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .note {
      padding: 12px 14px;
      border-radius: var(--sb-radius);
      background: var(--sb-surface);
      color: var(--sb-text);
    }
    .note-head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
    }
    .note-head strong {
      font-weight: 500;
      padding-top: 4px;
    }
    .note p {
      margin: 6px 0;
      font-size: 14px;
      line-height: 1.4;
      white-space: pre-line;
      overflow-wrap: anywhere;
    }
    .note time {
      font-size: 12px;
      color: var(--sb-muted);
    }
    .text-btn {
      align-self: center;
      padding: 10px 18px;
      border-radius: 999px;
      background: var(--sb-active-bg);
      color: var(--sb-accent);
      font-weight: 500;
    }
    @media (prefers-reduced-motion: reduce) {
      .panel {
        animation: none;
      }
    }
  `;
}

/** Icon buttons pinned to the bottom of the sidebar. */
class SbGlanceBar extends LitElement {
  static properties = {
    hass: { attribute: false },
    items: { attribute: false },
  };

  hass?: HomeAssistant;
  items: GlanceItem[] = [];

  render() {
    if (!this.hass) return nothing;
    const hass = this.hass;
    const visible = this.items.filter((i) => evalCondition(hass, i.show, i.entity));
    if (!visible.length) return nothing;
    return html`<div class="bar">
      ${visible.map((item) => {
        const active = isActiveState(hass.states[item.entity]?.state);
        const name = item.name ?? entityName(hass, item.entity);
        return html`<button class=${active ? 'active' : ''} title=${name} aria-label=${name} @click=${() => tapItem(this, item)}>
          <ha-icon .icon=${item.icon ?? hass.states[item.entity]?.attributes.icon ?? 'mdi:circle-outline'}></ha-icon>
          ${item.show_state ? html`<small>${formatState(hass, item.entity)}</small>` : nothing}
        </button>`;
      })}
    </div>`;
  }

  static styles = css`
    .bar {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      gap: 4px;
    }
    button {
      all: unset;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      min-width: 48px;
      padding: 10px 8px;
      border-radius: var(--sb-radius);
      color: var(--sb-icon);
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      --mdc-icon-size: 24px;
    }
    button:focus-visible {
      outline: 2px solid var(--sb-accent);
    }
    button.active {
      color: var(--sb-accent);
      background: var(--sb-active-bg);
    }
    small {
      font-size: 11px;
      color: var(--sb-muted);
    }
  `;
}

if (!customElements.get('sidebar-card-attention')) customElements.define('sidebar-card-attention', SbAttention);
if (!customElements.get('sidebar-card-glance')) customElements.define('sidebar-card-glance', SbGlanceBar);
