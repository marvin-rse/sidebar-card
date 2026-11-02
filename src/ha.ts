import type { ActionConfig, HomeAssistant, Lovelace } from './types';

// Path into the HA frontend, verified against frontend 20260930.
// home-assistant > home-assistant-main > ha-drawer > partial-panel-resolver
//   > ha-panel-lovelace > hui-root > (div > .header, hui-view-container#view)

export function getHomeAssistant(): (HTMLElement & { hass?: HomeAssistant; provideHass?(el: any): void }) | null {
  return document.querySelector('home-assistant');
}

export function getMain(): HTMLElement | null {
  return getHomeAssistant()?.shadowRoot?.querySelector('home-assistant-main') ?? null;
}

export function getHuiRoot(): (HTMLElement & { lovelace?: Lovelace }) | null {
  const main = getMain()?.shadowRoot;
  const resolver = main?.querySelector('ha-drawer partial-panel-resolver') ?? main?.querySelector('partial-panel-resolver');
  const panel = (resolver?.shadowRoot ?? resolver)?.querySelector('ha-panel-lovelace');
  return (panel?.shadowRoot?.querySelector('hui-root') as any) ?? null;
}

type HassListener = (hass: HomeAssistant) => void;
const listeners = new Set<HassListener>();
let hubRegistered = false;

/**
 * HA pushes every new hass object to elements registered with provideHass and
 * never forgets them, so a single hub is registered and fans the updates out.
 */
export function onHass(listener: HassListener): () => void {
  listeners.add(listener);
  const ha = getHomeAssistant();
  if (!hubRegistered && ha?.provideHass) {
    hubRegistered = true;
    ha.provideHass({
      set hass(hass: HomeAssistant) {
        listeners.forEach((l) => l(hass));
      },
    });
  }
  if (ha?.hass) listener(ha.hass);
  return () => listeners.delete(listener);
}

export function currentHass(): HomeAssistant | undefined {
  return getHomeAssistant()?.hass;
}

export function fireEvent(node: EventTarget, type: string, detail?: unknown) {
  node.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));
}

/** Hands an action to Home Assistant's own handler (confirmation, toasts and all). */
export function runAction(
  node: HTMLElement,
  config: { entity?: string; tap_action?: ActionConfig; hold_action?: ActionConfig },
  action: 'tap' | 'hold' = 'tap',
) {
  fireEvent(node, 'hass-action', { config, action });
}

export function moreInfo(node: HTMLElement, entityId: string) {
  fireEvent(node, 'hass-more-info', { entityId });
}

/** v1 `service-js` menu items: run user supplied JavaScript. */
export function runLegacyJs(code: string, context: unknown) {
  const body = String(code).replace(/^\[\[\[\s*|\s*\]\]\]$/g, '');
  // eslint-disable-next-line no-new-func
  new Function(body).call(context);
}

export type Unsubscribe = () => void;

/** Subscribes to a server-rendered Jinja template. */
export function subscribeTemplate(
  hass: HomeAssistant,
  template: string,
  onResult: (result: unknown) => void,
  onError?: (error: string) => void,
): Unsubscribe {
  let unsub: (() => Promise<void>) | undefined;
  let cancelled = false;
  hass.connection
    .subscribeMessage<any>(
      (msg) => {
        if (msg.error) onError?.(msg.error);
        else if ('result' in msg) onResult(msg.result);
      },
      { type: 'render_template', template, report_errors: true },
    )
    .then((u) => {
      if (cancelled) u().catch(() => undefined);
      else unsub = u;
    })
    .catch((err) => onError?.(err?.message ?? String(err)));
  return () => {
    cancelled = true;
    unsub?.().catch(() => undefined);
  };
}

export function isTruthy(result: unknown): boolean {
  if (typeof result === 'boolean') return result;
  if (typeof result === 'number') return result !== 0;
  return ['true', 'on', 'yes', '1'].includes(String(result ?? '').trim().toLowerCase());
}

const ACTIVE_OFF_STATES = new Set(['off', 'unavailable', 'unknown', 'closed', 'locked', 'idle', 'standby', 'paused', 'not_home', 'false', '']);

export function isActiveState(state: string | undefined): boolean {
  return state !== undefined && !ACTIVE_OFF_STATES.has(state);
}

export function entityName(hass: HomeAssistant, entityId: string): string {
  return hass.states[entityId]?.attributes.friendly_name ?? entityId;
}

export function formatState(hass: HomeAssistant, entityId: string): string {
  const obj = hass.states[entityId];
  if (!obj) return '';
  try {
    if (hass.formatEntityState) return hass.formatEntityState(obj);
  } catch {
    /* fall through */
  }
  const unit = obj.attributes.unit_of_measurement;
  return unit ? `${obj.state} ${unit}` : obj.state;
}

let haComponentsLoaded: Promise<void> | undefined;

/**
 * ha-form and the selectors are lazy-loaded by HA. Loading the editors of two
 * built-in cards pulls them in, including the action and icon pickers.
 */
export function loadHaComponents(): Promise<void> {
  // Never block the editor for long: if HA changes how editors load, the
  // form still renders once whatever is available has been defined.
  const timeout = new Promise<void>((resolve) => window.setTimeout(resolve, 5000));
  haComponentsLoaded ??= Promise.race([timeout, (async () => {
    const helpers = await (window as any).loadCardHelpers?.();
    if (!helpers) return;
    for (const [type, extra] of [
      ['entities', { entities: [] }],
      ['tile', { entity: 'sun.sun' }],
    ] as const) {
      helpers.createCardElement({ type, ...extra });
      const tag = `hui-${type}-card`;
      await customElements.whenDefined(tag);
      await (customElements.get(tag) as any)?.getConfigElement?.();
    }
  })()]).catch((err) => console.warn('sidebar-card: could not load HA editor components', err));
  return haComponentsLoaded;
}
