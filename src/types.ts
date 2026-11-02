export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
  last_changed: string;
  last_updated: string;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  language: string;
  locale?: { language: string; time_format?: string };
  user?: { id: string; name: string; is_admin: boolean };
  connection: {
    subscribeMessage<T = any>(cb: (msg: T) => void, msg: Record<string, any>): Promise<() => Promise<void>>;
  };
  callService(domain: string, service: string, data?: Record<string, any>): Promise<any>;
  formatEntityState?(stateObj: HassEntity, state?: string): string;
  [key: string]: any;
}

export interface Lovelace {
  config: Record<string, any>;
  rawConfig?: Record<string, any>;
  editMode: boolean;
  urlPath: string | null;
  mode: 'generated' | 'yaml' | 'storage';
  saveConfig(config: Record<string, any>): Promise<void>;
}

export interface ActionConfig {
  action: string;
  [key: string]: any;
}

export type MenuStyle = 'list' | 'wide' | 'buttons' | 'grid';

export interface MenuItemConfig {
  name?: string;
  icon?: string;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  /** Entity whose on-state marks the item as active. */
  state?: string;
  /** Jinja template; the item is hidden while it renders falsy. */
  conditional?: string;
  background_color?: string;
  icon_color?: string;
  text_color?: string;
  // Legacy (v1) fields, still read for compatibility.
  action?: string;
  navigation_path?: string;
  url_path?: string;
  entity?: string;
  service?: string;
  service_data?: Record<string, any>;
  [key: string]: any;
}

export type GlanceTone = 'alert' | 'warning' | 'info';

export interface GlanceToneThresholds {
  warn_above?: number;
  alert_above?: number;
  warn_below?: number;
  alert_below?: number;
}

export type GlanceConditionType =
  | 'always'
  | 'state'
  | 'state_not'
  | 'numeric_above'
  | 'numeric_below'
  | 'time_after'
  | 'time_before'
  | 'sun_below_horizon'
  | 'sun_above_horizon';

export interface GlanceCondition {
  condition: GlanceConditionType;
  entity?: string;
  state?: string | string[];
  threshold?: number;
  after?: string;
  before?: string;
}

export interface GlanceItem {
  entity: string;
  icon?: string;
  name?: string;
  label?: string;
  show?: GlanceCondition | GlanceConditionType;
  tone?: GlanceTone | GlanceToneThresholds;
  show_state?: boolean;
  tap_action?: ActionConfig;
}

export type GlancePosition = 'bottom' | 'attention';

export interface TrendBand {
  max: number;
  label: string;
  color: string;
}

export interface TrendItemConfig {
  name?: string;
  entity?: string;
  entities?: (string | { entity: string; name?: string })[];
  bands?: 'aqi' | TrendBand[];
  min?: number;
  max?: number;
}

export interface TrendsConfig {
  ranges?: string[];
  autoAdvance?: number;
  items?: TrendItemConfig[];
}

export interface PresenceEntry {
  entity: string;
  name?: string;
}

export interface WidthConfig {
  mobile: number;
  tablet: number;
  desktop: number;
}

/** The raw `sidebar:` block as stored in the dashboard config. */
export interface SidebarConfig {
  title?: string;
  clock?: boolean;
  digitalClock?: boolean;
  digitalClockWithSeconds?: boolean;
  twelveHourVersion?: boolean;
  period?: boolean;
  date?: boolean;
  dateFormat?: string;
  weather?: boolean;
  weatherEntity?: string;
  presence?: (string | PresenceEntry)[];
  sidebarMenu?: MenuItemConfig[];
  menuStyle?: MenuStyle;
  showLabel?: boolean;
  updateMenu?: boolean;
  template?: string;
  notifications?: boolean;
  glanceBar?: GlanceItem[] | { position?: GlancePosition; items?: GlanceItem[] };
  trends?: TrendsConfig;
  cards?: Record<string, any>[];
  cardStyle?: string;
  bottomCard?: { type: string; cardOptions?: Record<string, any>; cardStyle?: string };
  accentColor?: string;
  width?: number | Partial<WidthConfig>;
  breakpoints?: { mobile?: number; tablet?: number };
  hideTopMenu?: boolean;
  showTopMenuOnMobile?: boolean;
  hideHassSidebar?: boolean;
  hideOnPath?: string[];
  style?: string;
  debug?: boolean;
  [key: string]: any;
}

/** Config after defaults and legacy fields have been resolved. */
export interface ResolvedConfig {
  raw: SidebarConfig;
  title: string;
  clock: 'none' | 'digital' | 'analog' | 'both';
  clockSeconds: boolean;
  hour12: boolean;
  period: boolean;
  date: boolean;
  dateFormat?: string;
  weatherEntity?: string;
  presence: PresenceEntry[];
  menu: MenuItemConfig[];
  menuStyle: MenuStyle;
  showLabel: boolean;
  updateMenu: boolean;
  template?: string;
  notifications: boolean;
  glance: { position: GlancePosition; items: GlanceItem[] };
  trends?: TrendsConfig;
  cards: Record<string, any>[];
  cardStyle?: string;
  accentColor?: string;
  width: WidthConfig;
  breakpoints: { mobile: number; tablet: number };
  hideTopMenu: boolean;
  showTopMenuOnMobile: boolean;
  hideHassSidebar: boolean;
  hideOnPath: string[];
  style?: string;
  debug: boolean;
}
