import type { ActionConfig, GlanceItem, MenuItemConfig, PresenceEntry, ResolvedConfig, SidebarConfig } from './types';

const DEFAULT_WIDTH = 25;

function clampWidth(value: unknown, fallback: number): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(Math.max(n, 0), 90);
}

/** Maps a menu item's v1 `action:` fields onto a standard HA action config. */
export function legacyTapAction(item: MenuItemConfig): ActionConfig | undefined {
  switch (item.action) {
    case 'navigate':
      return { action: 'navigate', navigation_path: item.navigation_path };
    case 'url':
      return { action: 'url', url_path: item.url_path };
    case 'more-info':
      return { action: 'more-info', entity: item.entity };
    case 'toggle':
      return { action: 'toggle', entity: item.entity };
    case 'call-service':
    case 'perform-action':
      return { action: 'perform-action', perform_action: item.service, data: item.service_data };
    case 'none':
      return { action: 'none' };
    case undefined:
      return item.entity ? { action: 'toggle', entity: item.entity } : undefined;
    default:
      return undefined;
  }
}

export function itemTapAction(item: MenuItemConfig): ActionConfig | undefined {
  return item.tap_action ?? legacyTapAction(item);
}

/** Path a menu item navigates to, used to highlight the current view. */
export function itemPath(item: MenuItemConfig): string | undefined {
  const action = itemTapAction(item);
  return action?.action === 'navigate' ? action.navigation_path : undefined;
}

export function isLegacyJsItem(item: MenuItemConfig): boolean {
  return !item.tap_action && item.action === 'service-js';
}

function normalizeGlance(raw: SidebarConfig['glanceBar']): ResolvedConfig['glance'] {
  if (!raw) return { position: 'bottom', items: [] };
  if (Array.isArray(raw)) return { position: 'bottom', items: raw.filter((i) => i?.entity) };
  return {
    position: raw.position === 'attention' ? 'attention' : 'bottom',
    items: (raw.items ?? []).filter((i: GlanceItem) => i?.entity),
  };
}

function normalizePresence(raw: SidebarConfig['presence']): PresenceEntry[] {
  return (raw ?? [])
    .map((p) => (typeof p === 'string' ? { entity: p } : p))
    .filter((p): p is PresenceEntry => !!p?.entity);
}

function bottomCards(raw: SidebarConfig): Record<string, any>[] {
  if (Array.isArray(raw.cards)) return raw.cards.filter((c) => c?.type);
  if (raw.bottomCard?.type) return [{ type: raw.bottomCard.type, ...(raw.bottomCard.cardOptions ?? {}) }];
  return [];
}

export function resolveConfig(raw: SidebarConfig): ResolvedConfig {
  const w = raw.width;
  const width =
    typeof w === 'object' && w !== null
      ? {
          mobile: clampWidth(w.mobile, DEFAULT_WIDTH),
          tablet: clampWidth(w.tablet, DEFAULT_WIDTH),
          desktop: clampWidth(w.desktop, DEFAULT_WIDTH),
        }
      : { mobile: clampWidth(w, DEFAULT_WIDTH), tablet: clampWidth(w, DEFAULT_WIDTH), desktop: clampWidth(w, DEFAULT_WIDTH) };

  const analog = !!raw.clock;
  const digital = !!raw.digitalClock;

  return {
    raw,
    title: raw.title ?? '',
    clock: analog && digital ? 'both' : analog ? 'analog' : digital ? 'digital' : 'none',
    clockSeconds: !!raw.digitalClockWithSeconds,
    hour12: !!raw.twelveHourVersion,
    period: !!raw.period,
    date: !!raw.date,
    dateFormat: raw.dateFormat || undefined,
    weatherEntity: raw.weather === false ? undefined : raw.weatherEntity || undefined,
    presence: normalizePresence(raw.presence),
    menu: (raw.sidebarMenu ?? []).filter(Boolean),
    menuStyle: raw.menuStyle ?? 'list',
    showLabel: raw.showLabel ?? true,
    updateMenu: raw.updateMenu ?? true,
    template: raw.template || undefined,
    notifications: !!raw.notifications,
    glance: normalizeGlance(raw.glanceBar),
    trends: raw.trends?.items?.length ? raw.trends : undefined,
    cards: bottomCards(raw),
    cardStyle: raw.cardStyle ?? raw.bottomCard?.cardStyle,
    accentColor: raw.accentColor || undefined,
    width,
    breakpoints: {
      mobile: Number(raw.breakpoints?.mobile) || 768,
      tablet: Number(raw.breakpoints?.tablet) || 1024,
    },
    hideTopMenu: !!raw.hideTopMenu,
    showTopMenuOnMobile: !!raw.showTopMenuOnMobile,
    hideHassSidebar: !!raw.hideHassSidebar,
    hideOnPath: Array.isArray(raw.hideOnPath) ? raw.hideOnPath : [],
    style: raw.style || undefined,
    debug: !!raw.debug,
  };
}

/**
 * Rewrites v1 fields into the current format so the visual editor can show
 * them. Only used when the editor opens; plain YAML keeps working unchanged.
 */
export function migrateConfig(raw: SidebarConfig): SidebarConfig {
  const config: SidebarConfig = structuredClone(raw ?? {});

  if (Array.isArray(config.sidebarMenu)) {
    config.sidebarMenu = config.sidebarMenu.map((item) => {
      if (item.tap_action || isLegacyJsItem(item)) return item;
      const { action: _a, navigation_path: _n, url_path: _u, service: _s, service_data: _d, entity: _e, active: _x, ...rest } = item;
      const tap = legacyTapAction(item);
      return tap ? { ...rest, tap_action: tap } : rest;
    });
  }

  if (config.bottomCard && !config.cards) {
    config.cards = bottomCards(config);
    if (config.bottomCard.cardStyle) config.cardStyle = config.bottomCard.cardStyle;
    delete config.bottomCard;
  }

  return config;
}

/** Drops empty values so the saved YAML stays tidy. */
export function cleanConfig<T>(value: T): T {
  if (Array.isArray(value)) return value.map((v) => cleanConfig(v)) as T;
  if (value && typeof value === 'object') {
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(value)) {
      if (v === undefined || v === null || v === '') continue;
      if (typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length === 0) continue;
      out[k] = cleanConfig(v);
    }
    return out as T;
  }
  return value;
}
