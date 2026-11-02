import { LitElement, css, html, nothing } from 'lit';
import { cleanConfig, isLegacyJsItem, itemPath, itemTapAction, migrateConfig } from '../config';
import { entityName, fireEvent, loadHaComponents } from '../ha';
import { localize } from '../localize';
import type { GlanceItem, HomeAssistant, Lovelace, MenuItemConfig, PresenceEntry, SidebarConfig, TrendItemConfig } from '../types';
import type { ListEditorAdapter } from './list-editor';
import './list-editor';

type Tab = 'general' | 'menu' | 'status' | 'trends' | 'cards' | 'layout' | 'yaml';
const TABS: { id: Tab; icon: string }[] = [
  { id: 'general', icon: 'mdi:clock-outline' },
  { id: 'menu', icon: 'mdi:menu' },
  { id: 'status', icon: 'mdi:bell-outline' },
  { id: 'trends', icon: 'mdi:chart-line' },
  { id: 'cards', icon: 'mdi:card-outline' },
  { id: 'layout', icon: 'mdi:page-layout-sidebar-left' },
  { id: 'yaml', icon: 'mdi:code-braces' },
];

const bool = (name: string) => ({ name, selector: { boolean: {} } });
const text = (name: string, multiline = false) => ({ name, selector: { text: multiline ? { multiline: true } : {} } });

export class SidebarEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    lovelace: { attribute: false },
    config: { attribute: false },
    _config: { state: true },
    _tab: { state: true },
    _ready: { state: true },
    _saving: { state: true },
    _error: { state: true },
    _dirty: { state: true },
    _confirmDiscard: { state: true },
  };

  hass?: HomeAssistant;
  lovelace?: Lovelace;
  config: SidebarConfig = {};
  private _config: SidebarConfig = {};
  private _tab: Tab = 'general';
  private _ready = false;
  private _saving = false;
  private _error = '';
  private _dirty = false;
  private _confirmDiscard = false;

  private _onKey = (ev: KeyboardEvent) => {
    if (ev.key === 'Escape') this._close();
  };

  connectedCallback() {
    super.connectedCallback();
    this._config = migrateConfig(this.config);
    loadHaComponents().then(() => (this._ready = true));
    window.addEventListener('keydown', this._onKey);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('keydown', this._onKey);
  }

  private get _lang() {
    return this.hass?.language;
  }

  private _t = (key: string, vars?: Record<string, string | number>) => localize(this._lang, key, vars);

  private _label = (schema: { name: string }) => this._t(`field.${schema.name}`);

  private _options(field: string, values: string[]) {
    return values.map((value) => ({ value, label: this._t(`field.${field}.${value}`) }));
  }

  private _update(config: SidebarConfig) {
    this._config = config;
    this._dirty = true;
    this._error = '';
    fireEvent(this, 'sidebar-card-preview', config);
  }

  private _patch(patch: Partial<SidebarConfig>) {
    this._update({ ...this._config, ...patch });
  }

  private _form(data: Record<string, any>, schema: readonly any[], onChange: (value: Record<string, any>) => void) {
    return html`<ha-form
      .hass=${this.hass}
      .data=${data}
      .schema=${schema}
      .computeLabel=${this._label}
      @value-changed=${(ev: CustomEvent) => {
        ev.stopPropagation();
        onChange(ev.detail.value);
      }}
    ></ha-form>`;
  }

  /* ----------------------------- tabs ----------------------------- */

  private _general() {
    const c = this._config;
    const clock = c.clock && c.digitalClock ? 'both' : c.clock ? 'analog' : c.digitalClock ? 'digital' : 'none';
    const presence = (c.presence ?? []).map((p) => (typeof p === 'string' ? p : p.entity));
    const data = {
      title: c.title,
      clock,
      digitalClockWithSeconds: c.digitalClockWithSeconds,
      twelveHourVersion: c.twelveHourVersion,
      period: c.period,
      date: c.date,
      dateFormat: c.dateFormat,
      weatherEntity: c.weatherEntity,
      presence,
      template: c.template,
    };
    const schema = [
      text('title'),
      { name: 'clock', selector: { select: { mode: 'dropdown', options: this._options('clock', ['none', 'digital', 'analog', 'both']) } } },
      {
        type: 'grid',
        name: '',
        schema: [bool('digitalClockWithSeconds'), bool('twelveHourVersion'), ...(c.twelveHourVersion ? [bool('period')] : [])],
      },
      { type: 'grid', name: '', schema: [bool('date'), ...(c.date ? [text('dateFormat')] : [])] },
      { name: 'weatherEntity', selector: { entity: { filter: { domain: 'weather' } } } },
      { name: 'presence', selector: { entity: { multiple: true, filter: { domain: 'person' } } } },
      { name: 'template', selector: { template: {} } },
    ];
    return this._form(data, schema, (v) => {
      // Keep custom names of people that are still selected.
      const old = new Map<string, string | PresenceEntry>((c.presence ?? []).map((p) => (typeof p === 'string' ? [p, p] : [p.entity, p])));
      this._patch({
        title: v.title,
        clock: v.clock === 'analog' || v.clock === 'both',
        digitalClock: v.clock === 'digital' || v.clock === 'both',
        digitalClockWithSeconds: v.digitalClockWithSeconds,
        twelveHourVersion: v.twelveHourVersion,
        period: v.twelveHourVersion ? v.period : undefined,
        date: v.date,
        dateFormat: v.dateFormat,
        weatherEntity: v.weatherEntity,
        presence: (v.presence ?? []).map((id: string) => old.get(id) ?? id),
        template: v.template,
      });
    });
  }

  private _menuAdapter: ListEditorAdapter<MenuItemConfig> = {
    title: (item, i) => item.name || itemPath(item) || `${this._t('editor.new_item')} ${i + 1}`,
    icon: (item) => item.icon,
    readOnly: (item) => (isLegacyJsItem(item) ? this._t('editor.legacy_js') : undefined),
    create: () => ({ name: '', tap_action: { action: 'navigate' } }),
    schema: () => [
      { type: 'grid', name: '', schema: [text('name'), { name: 'icon', selector: { icon: {} } }] },
      { name: 'tap_action', selector: { ui_action: { default_action: 'none' } } },
      { name: 'state', selector: { entity: {} } },
      { name: 'conditional', selector: { template: {} } },
      {
        type: 'expandable',
        name: 'advanced',
        flatten: true,
        title: this._t('field.advanced'),
        schema: [
          { name: 'hold_action', selector: { ui_action: { default_action: 'none' } } },
          { type: 'grid', name: '', schema: [text('background_color'), text('icon_color'), text('text_color')] },
        ],
      },
    ],
    toForm: (item) => ({ ...item, tap_action: itemTapAction(item) }),
    fromForm: (_item, data) => data,
  };

  private _addViews() {
    const ll = this.lovelace;
    if (!ll) return;
    const base = `/${ll.urlPath ?? 'lovelace'}`;
    const menu = [...(this._config.sidebarMenu ?? [])];
    const existing = new Set(menu.map((i) => itemPath(i)?.replace(/\/+$/, '')));
    (ll.config.views ?? []).forEach((view: any, index: number) => {
      if (view.subview) return;
      const path = `${base}/${view.path ?? index}`;
      if (existing.has(path)) return;
      menu.push({ name: view.title ?? view.path ?? String(index), icon: view.icon, tap_action: { action: 'navigate', navigation_path: path } });
    });
    this._patch({ sidebarMenu: menu });
  }

  private _menu() {
    const c = this._config;
    return html`
      ${this._form(
        { menuStyle: c.menuStyle ?? 'list', showLabel: c.showLabel ?? true, updateMenu: c.updateMenu ?? true },
        [
          { name: 'menuStyle', selector: { select: { mode: 'dropdown', options: this._options('menuStyle', ['list', 'wide', 'buttons', 'grid']) } } },
          { type: 'grid', name: '', schema: [bool('showLabel'), bool('updateMenu')] },
        ],
        (v) => this._patch(v),
      )}
      <div class="section-head">
        <h3>${this._t('editor.tab.menu')}</h3>
        <button class="chip" title=${this._t('editor.add_views_hint')} @click=${this._addViews}>
          <ha-icon icon="mdi:view-dashboard-outline"></ha-icon>${this._t('editor.add_views')}
        </button>
      </div>
      <sidebar-card-list-editor
        .hass=${this.hass}
        .items=${c.sidebarMenu ?? []}
        .adapter=${this._menuAdapter}
        .computeLabel=${this._label}
        @items-changed=${(ev: CustomEvent) => this._patch({ sidebarMenu: ev.detail })}
      ></sidebar-card-list-editor>
    `;
  }

  private get _glance() {
    const g = this._config.glanceBar;
    if (!g) return { position: 'bottom', items: [] as GlanceItem[] };
    if (Array.isArray(g)) return { position: 'bottom', items: g };
    return { position: g.position ?? 'bottom', items: g.items ?? [] };
  }

  private _setGlance(position: string, items: GlanceItem[]) {
    this._patch({ glanceBar: position === 'attention' ? { position: 'attention', items } : items });
  }

  private _glanceAdapter: ListEditorAdapter<GlanceItem> = {
    title: (item, i) => item.name || (item.entity && this.hass ? entityName(this.hass, item.entity) : `${this._t('editor.new_item')} ${i + 1}`),
    icon: (item) => item.icon ?? (item.entity ? this.hass?.states[item.entity]?.attributes.icon : undefined),
    create: () => ({ entity: '' }),
    schema: () => {
      const attention = this._glance.position === 'attention';
      return [
        { name: 'entity', selector: { entity: {} } },
        { type: 'grid', name: '', schema: [text('name'), { name: 'icon', selector: { icon: {} } }] },
        ...(attention ? [text('label')] : [bool('show_state')]),
        {
          type: 'grid',
          name: '',
          schema: [
            {
              name: 'show',
              selector: {
                select: {
                  mode: 'dropdown',
                  options: this._options('show', ['active', 'always', 'state', 'state_not', 'numeric_above', 'numeric_below', 'sun_below_horizon', 'sun_above_horizon']),
                },
              },
            },
            text('show_value'),
          ],
        },
        ...(attention
          ? [{ name: 'tone', selector: { select: { mode: 'dropdown', options: this._options('tone', ['alert', 'warning', 'info']) } } }]
          : []),
        { name: 'tap_action', selector: { ui_action: { default_action: 'more-info' } } },
      ];
    },
    toForm: (item) => {
      const show = item.show;
      const cond = !show ? 'active' : typeof show === 'string' ? show : show.condition;
      const value = typeof show === 'object' ? (show.threshold ?? (Array.isArray(show.state) ? show.state.join(', ') : show.state)) : undefined;
      return { ...item, show: cond, show_value: value === undefined ? undefined : String(value), tone: typeof item.tone === 'string' ? item.tone : undefined };
    },
    fromForm: (item, data) => {
      const { show, show_value, tone, ...rest } = data;
      let next: any = { ...rest };
      if (show === 'state' || show === 'state_not') {
        const states = String(show_value ?? '').split(',').map((s) => s.trim()).filter(Boolean);
        next.show = { condition: show, state: states.length > 1 ? states : states[0] ?? 'on' };
      } else if (show === 'numeric_above' || show === 'numeric_below') {
        next.show = { condition: show, threshold: Number(show_value) || 0 };
      } else if (show && show !== 'active') {
        next.show = show;
      }
      // Threshold tones are YAML-only; keep them unless a fixed tone was picked.
      next.tone = tone ?? (typeof item.tone === 'object' ? item.tone : undefined);
      return next;
    },
  };

  private _status() {
    const c = this._config;
    const g = this._glance;
    return html`
      ${this._form(
        { notifications: c.notifications ?? false, glancePosition: g.position },
        [
          bool('notifications'),
          { name: 'glancePosition', selector: { select: { mode: 'dropdown', options: this._options('glancePosition', ['bottom', 'attention']) } } },
        ],
        (v) => {
          this._config = { ...this._config, notifications: v.notifications };
          this._setGlance(v.glancePosition, g.items);
        },
      )}
      <p class="hint">${this._t('editor.glance_hint')}</p>
      <sidebar-card-list-editor
        .hass=${this.hass}
        .items=${g.items}
        .adapter=${this._glanceAdapter}
        .computeLabel=${this._label}
        @items-changed=${(ev: CustomEvent) => this._setGlance(g.position, ev.detail)}
      ></sidebar-card-list-editor>
    `;
  }

  private _trendAdapter: ListEditorAdapter<TrendItemConfig> = {
    title: (item, i) => {
      const first = item.entity ?? (typeof item.entities?.[0] === 'string' ? item.entities[0] : item.entities?.[0]?.entity);
      return item.name || (first && this.hass ? entityName(this.hass, first) : `${this._t('editor.new_item')} ${i + 1}`);
    },
    icon: () => 'mdi:chart-bell-curve-cumulative',
    create: () => ({ entities: [] }),
    schema: () => [
      text('name'),
      { name: 'entities', selector: { entity: { multiple: true, filter: { domain: ['sensor', 'input_number', 'number'] } } } },
      { name: 'bands', selector: { select: { mode: 'dropdown', options: this._options('bands', ['none', 'aqi']) } } },
      { type: 'grid', name: '', schema: [{ name: 'min', selector: { number: { mode: 'box' } } }, { name: 'max', selector: { number: { mode: 'box' } } }] },
    ],
    toForm: (item) => ({
      ...item,
      entities: item.entities?.length ? item.entities.map((e) => (typeof e === 'string' ? e : e.entity)) : item.entity ? [item.entity] : [],
      bands: item.bands === 'aqi' ? 'aqi' : Array.isArray(item.bands) ? undefined : 'none',
    }),
    fromForm: (item, data) => {
      const { entities, bands, entity: _e, ...rest } = data;
      const named = new Map<string, string | { entity: string; name?: string }>((item.entities ?? []).map((e) => (typeof e === 'string' ? [e, e] : [e.entity, e])));
      const ids: string[] = (entities ?? []).slice(0, 3);
      const next: TrendItemConfig = { ...rest };
      if (ids.length === 1 && typeof named.get(ids[0]) !== 'object') next.entity = ids[0];
      else next.entities = ids.map((id) => named.get(id) ?? id);
      next.bands = bands === 'aqi' ? 'aqi' : bands === 'none' ? undefined : item.bands;
      return next;
    },
  };

  private _trends() {
    const t = this._config.trends ?? {};
    return html`
      <p class="hint">${this._t('editor.trends_hint')}</p>
      ${this._form(
        { ranges: (t.ranges ?? ['24h', '7d']).join(', '), autoAdvance: t.autoAdvance ?? 0 },
        [text('ranges'), { name: 'autoAdvance', selector: { number: { min: 0, max: 120, step: 1, mode: 'box', unit_of_measurement: 's' } } }],
        (v) =>
          this._patch({
            trends: {
              ...t,
              ranges: String(v.ranges ?? '').split(',').map((r) => r.trim()).filter(Boolean),
              autoAdvance: Number(v.autoAdvance) || undefined,
            },
          }),
      )}
      <sidebar-card-list-editor
        .hass=${this.hass}
        .items=${t.items ?? []}
        .adapter=${this._trendAdapter}
        .computeLabel=${this._label}
        @items-changed=${(ev: CustomEvent) => this._patch({ trends: { ...t, items: ev.detail } })}
      ></sidebar-card-list-editor>
    `;
  }

  private _cards() {
    const c = this._config;
    return html`
      <p class="hint">${this._t('editor.cards_hint')}</p>
      ${this._form(
        { cards: c.cards ?? [], cardStyle: c.cardStyle },
        [{ name: 'cards', selector: { object: {} } }, text('cardStyle', true)],
        (v) => this._patch({ cards: Array.isArray(v.cards) ? v.cards : v.cards ? [v.cards] : [], cardStyle: v.cardStyle }),
      )}
    `;
  }

  private _layout() {
    const c = this._config;
    const w = c.width;
    const width = typeof w === 'object' && w ? w : { mobile: w ?? 25, tablet: w ?? 25, desktop: w ?? 25 };
    const slider = (name: string) => ({ name, selector: { number: { min: 0, max: 60, step: 1, mode: 'slider', unit_of_measurement: '%' } } });
    const box = (name: string) => ({ name, selector: { number: { min: 200, max: 4000, step: 1, mode: 'box', unit_of_measurement: 'px' } } });
    const data = {
      'width.mobile': width.mobile ?? 25,
      'width.tablet': width.tablet ?? 25,
      'width.desktop': width.desktop ?? 25,
      'breakpoints.mobile': c.breakpoints?.mobile ?? 768,
      'breakpoints.tablet': c.breakpoints?.tablet ?? 1024,
      accentColor: c.accentColor,
      hideTopMenu: c.hideTopMenu,
      showTopMenuOnMobile: c.showTopMenuOnMobile,
      hideHassSidebar: c.hideHassSidebar,
      hideOnPath: (c.hideOnPath ?? []).join('\n'),
      style: c.style,
      debug: c.debug,
    };
    const schema = [
      slider('width.mobile'),
      slider('width.tablet'),
      slider('width.desktop'),
      { type: 'grid', name: '', schema: [box('breakpoints.mobile'), box('breakpoints.tablet')] },
      text('accentColor'),
      { type: 'grid', name: '', schema: [bool('hideTopMenu'), ...(c.hideTopMenu ? [bool('showTopMenuOnMobile')] : []), bool('hideHassSidebar')] },
      text('hideOnPath', true),
      text('style', true),
      bool('debug'),
    ];
    return this._form(data, schema, (v) =>
      this._patch({
        width: { mobile: v['width.mobile'], tablet: v['width.tablet'], desktop: v['width.desktop'] },
        breakpoints: { mobile: v['breakpoints.mobile'], tablet: v['breakpoints.tablet'] },
        accentColor: v.accentColor,
        hideTopMenu: v.hideTopMenu,
        showTopMenuOnMobile: v.hideTopMenu ? v.showTopMenuOnMobile : undefined,
        hideHassSidebar: v.hideHassSidebar,
        hideOnPath: String(v.hideOnPath ?? '').split('\n').map((p) => p.trim()).filter(Boolean),
        style: v.style,
        debug: v.debug,
      }),
    );
  }

  private _yaml() {
    return html`
      <p class="hint">${this._t('editor.yaml_hint')}</p>
      ${this._form({ sidebar: cleanConfig(this._config) }, [{ name: 'sidebar', selector: { object: {} } }], (v) => {
        if (v.sidebar && typeof v.sidebar === 'object' && !Array.isArray(v.sidebar)) this._update(v.sidebar);
      })}
    `;
  }

  /* ----------------------------- actions ----------------------------- */

  private _close(force = false) {
    if (this._dirty && !force) {
      this._confirmDiscard = true;
      return;
    }
    fireEvent(this, 'sidebar-card-closed');
  }

  private async _save() {
    const ll = this.lovelace;
    if (!ll || this._saving) return;
    this._saving = true;
    this._error = '';
    try {
      const base = ll.rawConfig ?? ll.config;
      await ll.saveConfig({ ...base, sidebar: cleanConfig(this._config) });
      this._dirty = false;
      fireEvent(this, 'sidebar-card-closed');
    } catch (err: any) {
      this._error = this._t('editor.save_failed', { error: err?.message ?? String(err) });
    } finally {
      this._saving = false;
    }
  }

  render() {
    if (!this.hass) return nothing;
    const canSave = this.lovelace?.mode === 'storage' && !!this.hass.user?.is_admin;
    const blocker = this.lovelace?.mode !== 'storage' ? this._t('editor.yaml_mode') : !this.hass.user?.is_admin ? this._t('editor.not_admin') : '';
    const body = {
      general: () => this._general(),
      menu: () => this._menu(),
      status: () => this._status(),
      trends: () => this._trends(),
      cards: () => this._cards(),
      layout: () => this._layout(),
      yaml: () => this._yaml(),
    }[this._tab];

    return html`
      <div class="scrim" @click=${() => this._close()}></div>
      <section class="sheet" role="dialog" aria-modal="true" aria-label=${this._t('editor.title')}>
        <header>
          <h2>${this._t('editor.title')}</h2>
          <button class="icon-btn" aria-label=${this._t('editor.cancel')} @click=${() => this._close()}>
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </header>
        <nav class="tabs" role="tablist">
          ${TABS.map(
            (tab) => html`<button role="tab" aria-selected=${tab.id === this._tab} class=${tab.id === this._tab ? 'on' : ''}
              @click=${() => (this._tab = tab.id)}>
              <ha-icon .icon=${tab.icon}></ha-icon><span>${this._t(`editor.tab.${tab.id}`)}</span>
            </button>`,
          )}
        </nav>
        <div class="body">${this._ready ? body() : html`<div class="loading"><ha-icon icon="mdi:loading"></ha-icon></div>`}</div>
        <footer>
          ${this._confirmDiscard
            ? html`<span class="msg">${this._t('editor.discard_title')}</span>
                <button class="btn" @click=${() => (this._confirmDiscard = false)}>${this._t('editor.keep_editing')}</button>
                <button class="btn danger" @click=${() => this._close(true)}>${this._t('editor.discard')}</button>`
            : html`<span class="msg ${this._error ? 'error' : ''}">${this._error || blocker}</span>
                <button class="btn" @click=${() => this._close()}>${this._t('editor.cancel')}</button>
                <button class="btn primary" ?disabled=${!canSave || !this._dirty || this._saving} @click=${this._save}>
                  ${this._saving ? this._t('editor.saving') : this._t('editor.save')}
                </button>`}
        </footer>
      </section>
    `;
  }

  static styles = css`
    :host {
      position: fixed;
      inset: 0;
      z-index: 10;
      display: flex;
      justify-content: flex-end;
      font-family: var(--ha-font-family-body, inherit);
      color: var(--primary-text-color);
    }
    .scrim {
      position: absolute;
      inset: 0;
      background: rgb(0 0 0 / 0.25);
    }
    .sheet {
      position: relative;
      display: flex;
      flex-direction: column;
      width: min(560px, 100%);
      height: 100%;
      background: var(--primary-background-color);
      box-shadow: -12px 0 32px rgb(0 0 0 / 0.25);
      animation: slide 220ms ease;
      padding-top: env(safe-area-inset-top, 0px);
      box-sizing: border-box;
    }
    @keyframes slide {
      from {
        transform: translateX(40px);
        opacity: 0;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .sheet {
        animation: none;
      }
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 12px 4px 24px;
    }
    h2 {
      margin: 0;
      font-size: 22px;
      font-weight: 400;
    }
    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
    }
    button {
      all: unset;
      box-sizing: border-box;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }
    button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    button[disabled] {
      opacity: 0.4;
      pointer-events: none;
    }
    .icon-btn {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      color: var(--secondary-text-color);
    }
    /* Wrap instead of scrolling sideways: hidden tabs are easy to miss on touch screens. */
    .tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      padding: 8px 16px 12px;
      border-bottom: 1px solid var(--divider-color);
    }
    .tabs button {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      flex: none;
      padding: 8px 14px;
      border-radius: 999px;
      font-size: 14px;
      color: var(--secondary-text-color);
      --mdc-icon-size: 18px;
    }
    .tabs button.on {
      background: color-mix(in srgb, var(--primary-color) 14%, transparent);
      color: var(--primary-color);
      font-weight: 500;
    }
    .body {
      flex: 1;
      overflow-y: auto;
      padding: 20px 24px 32px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .section-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-top: 8px;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 999px;
      border: 1px solid var(--divider-color);
      font-size: 13px;
      color: var(--primary-color);
      --mdc-icon-size: 18px;
    }
    .hint {
      margin: 0;
      font-size: 14px;
      color: var(--secondary-text-color);
    }
    .loading {
      display: grid;
      place-items: center;
      padding: 48px;
      color: var(--secondary-text-color);
    }
    .loading ha-icon {
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    footer {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 0px)) 24px;
      border-top: 1px solid var(--divider-color);
    }
    .msg {
      flex: 1;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .msg.error {
      color: var(--error-color);
    }
    .btn {
      padding: 10px 18px;
      border-radius: 999px;
      font-weight: 500;
      color: var(--primary-color);
    }
    .btn.primary {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .btn.danger {
      background: var(--error-color);
      color: #fff;
    }
  `;
}

if (!customElements.get('sidebar-card-editor')) customElements.define('sidebar-card-editor', SidebarEditor);
