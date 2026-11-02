import { LitElement, css, html, nothing } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { isLegacyJsItem, itemPath, itemTapAction } from '../config';
import { isActiveState, isTruthy, runAction, runLegacyJs, subscribeTemplate, type Unsubscribe } from '../ha';
import type { HomeAssistant, MenuItemConfig, MenuStyle } from '../types';

const HOLD_MS = 500;

function normalizePath(path: string | undefined) {
  if (!path) return '';
  return path.split(/[?#]/)[0].replace(/\/+$/, '') || '/';
}

class SbMenu extends LitElement {
  static properties = {
    hass: { attribute: false },
    items: { attribute: false },
    menuStyle: {},
    showLabel: { type: Boolean },
    updateMenu: { type: Boolean },
    path: {},
    _conditions: { state: true },
  };

  hass?: HomeAssistant;
  items: MenuItemConfig[] = [];
  menuStyle: MenuStyle = 'list';
  showLabel = true;
  updateMenu = true;
  path = '';
  private _conditions = new Map<string, boolean>();
  private _subs = new Map<string, Unsubscribe>();
  private _holdTimer?: number;
  private _held = false;

  disconnectedCallback() {
    super.disconnectedCallback();
    this._subs.forEach((u) => u());
    this._subs.clear();
  }

  connectedCallback() {
    super.connectedCallback();
    this._syncConditions();
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has('items') || (changed.has('hass') && !changed.get('hass'))) this._syncConditions();
  }

  // One template subscription per distinct `conditional`, rendered by HA itself.
  private _syncConditions() {
    if (!this.hass || !this.isConnected) return;
    const wanted = new Set(this.items.map((i) => i.conditional?.trim()).filter((t): t is string => !!t));
    for (const [tpl, unsub] of this._subs) {
      if (!wanted.has(tpl)) {
        unsub();
        this._subs.delete(tpl);
        this._conditions.delete(tpl);
      }
    }
    for (const tpl of wanted) {
      if (this._subs.has(tpl)) continue;
      this._subs.set(
        tpl,
        subscribeTemplate(
          this.hass,
          tpl,
          (result) => this._setCondition(tpl, isTruthy(result)),
          (error) => {
            console.warn('sidebar-card: conditional template failed:', tpl, error);
            this._setCondition(tpl, true);
          },
        ),
      );
    }
  }

  private _setCondition(tpl: string, value: boolean) {
    if (this._conditions.get(tpl) === value) return;
    this._conditions = new Map(this._conditions).set(tpl, value);
  }

  private _visible(item: MenuItemConfig) {
    const tpl = item.conditional?.trim();
    // Hidden until the first result arrives so items don't flash in and out.
    return !tpl || this._conditions.get(tpl) === true;
  }

  private _isActive(item: MenuItemConfig) {
    if (item.state && isActiveState(this.hass?.states[item.state]?.state)) return true;
    if (!this.updateMenu) return false;
    const target = normalizePath(itemPath(item));
    return !!target && target === normalizePath(this.path);
  }

  private _pointerDown(item: MenuItemConfig) {
    this._held = false;
    window.clearTimeout(this._holdTimer);
    if (!item.hold_action || item.hold_action.action === 'none') return;
    this._holdTimer = window.setTimeout(() => {
      this._held = true;
      this._fire(item, 'hold');
    }, HOLD_MS);
  }

  private _pointerUp() {
    window.clearTimeout(this._holdTimer);
  }

  private _click(item: MenuItemConfig) {
    if (this._held) {
      this._held = false;
      return;
    }
    this._fire(item, 'tap');
  }

  private _fire(item: MenuItemConfig, kind: 'tap' | 'hold') {
    if (kind === 'tap' && isLegacyJsItem(item)) {
      try {
        runLegacyJs(item.service ?? '', this);
      } catch (err) {
        console.error('sidebar-card: service-js failed', err);
      }
      return;
    }
    const tap = itemTapAction(item);
    const action = kind === 'tap' ? tap : item.hold_action;
    if (!action || action.action === 'none') return;
    runAction(this, { entity: action.entity ?? item.entity ?? item.state, tap_action: tap, hold_action: item.hold_action }, kind);
  }

  render() {
    const items = this.items.filter((i) => this._visible(i));
    if (!items.length) return nothing;
    const iconOnly = !this.showLabel && this.menuStyle !== 'list';
    return html`<nav class="menu ${this.menuStyle}">
      ${items.map((item) => {
        const active = this._isActive(item);
        const style = styleMap({
          '--item-bg': item.background_color,
          '--item-icon': item.icon_color,
          '--item-text': item.text_color,
        });
        return html`<button
          class=${classMap({ item: true, active, 'icon-only': iconOnly, colored: !!item.background_color })}
          style=${style}
          aria-current=${active ? 'page' : 'false'}
          title=${iconOnly ? (item.name ?? '') : ''}
          @pointerdown=${() => this._pointerDown(item)}
          @pointerup=${this._pointerUp}
          @pointerleave=${this._pointerUp}
          @pointercancel=${this._pointerUp}
          @contextmenu=${(e: Event) => item.hold_action && e.preventDefault()}
          @click=${() => this._click(item)}
        >
          ${item.icon ? html`<span class="icon"><ha-icon .icon=${item.icon}></ha-icon></span>` : nothing}
          ${iconOnly ? nothing : html`<span class="label">${item.name ?? ''}</span>`}
        </button>`;
      })}
    </nav>`;
  }

  static styles = css`
    :host {
      display: block;
    }
    .menu {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .item {
      all: unset;
      box-sizing: border-box;
      position: relative;
      display: flex;
      align-items: center;
      gap: 14px;
      min-height: 48px;
      padding: 10px 16px;
      border-radius: var(--sb-radius);
      color: var(--item-text, var(--sb-text));
      font-size: 17px;
      font-weight: 400;
      line-height: 1.25;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      user-select: none;
      transition: background-color 180ms ease, color 180ms ease, transform 120ms ease;
    }
    .item:hover {
      background: color-mix(in srgb, var(--sb-text) 6%, transparent);
    }
    .item:active {
      transform: scale(0.98);
    }
    .item:focus-visible {
      outline: 2px solid var(--sb-accent);
      outline-offset: 2px;
    }
    .icon {
      display: inline-flex;
      color: var(--item-icon, var(--sb-icon));
      --mdc-icon-size: 24px;
      transition: color 180ms ease;
    }
    .label {
      flex: 1;
      min-width: 0;
      overflow-wrap: anywhere;
    }
    .item.active {
      background: var(--sb-active-bg);
      color: var(--item-text, var(--sb-active-text));
      font-weight: 500;
    }
    .item.active .icon {
      color: var(--item-icon, var(--sb-active-icon));
    }

    /* list: indicator bar on the active row */
    .list .item.active::before {
      content: '';
      position: absolute;
      left: 4px;
      top: 25%;
      bottom: 25%;
      width: 3px;
      border-radius: 3px;
      background: var(--sb-accent);
    }

    /* wide: filled pills with the icon in a circle */
    .wide {
      gap: 8px;
    }
    .wide .item {
      border-radius: 999px;
      padding: 6px 18px 6px 6px;
      background: var(--item-bg, color-mix(in srgb, var(--sb-text) 5%, transparent));
    }
    .wide .item .icon {
      width: 40px;
      height: 40px;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      background: color-mix(in srgb, var(--sb-bg) 70%, transparent);
    }
    .wide .item:not(:has(.icon)) {
      padding-left: 20px;
    }
    .wide .item.active {
      background: var(--item-bg, var(--sb-active-bg));
      box-shadow: inset 0 0 0 2px var(--sb-accent);
    }

    /* buttons / grid: tiles with the icon above the label */
    .buttons,
    .grid {
      display: grid;
      gap: 8px;
    }
    .buttons {
      grid-template-columns: repeat(auto-fill, minmax(104px, 1fr));
    }
    .grid {
      grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
    }
    /* Narrow tiles: hyphenate by language instead of breaking anywhere. */
    .buttons .label,
    .grid .label {
      flex: none;
      max-width: 100%;
      overflow-wrap: normal;
      hyphens: auto;
      overflow: hidden;
    }
    .buttons .item,
    .grid .item {
      flex-direction: column;
      justify-content: center;
      text-align: center;
      gap: 8px;
      background: var(--item-bg, color-mix(in srgb, var(--sb-text) 5%, transparent));
    }
    .buttons .item {
      aspect-ratio: 1.15;
      font-size: 15px;
      padding: 12px;
    }
    .buttons .item .icon {
      --mdc-icon-size: 30px;
    }
    .grid .item {
      aspect-ratio: 1;
      padding: 8px 4px;
      font-size: 12px;
      gap: 6px;
    }
    .item.icon-only {
      min-height: 0;
    }
    .buttons .item.active,
    .grid .item.active {
      background: var(--item-bg, var(--sb-active-bg));
      box-shadow: inset 0 0 0 2px var(--sb-accent);
    }
    .label:empty {
      display: none;
    }
    @media (prefers-reduced-motion: reduce) {
      .item {
        transition: none;
      }
    }
  `;
}

if (!customElements.get('sidebar-card-menu')) customElements.define('sidebar-card-menu', SbMenu);
