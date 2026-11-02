import { resolveConfig } from './config';
import { getHuiRoot, getMain, onHass } from './ha';
import type { SidebarPanel } from './components/sidebar-panel';
import type { HomeAssistant, Lovelace, ResolvedConfig, SidebarConfig } from './types';
import './editor/editor-dialog';

type HuiRoot = HTMLElement & { lovelace?: Lovelace };

function adopt(root: ShadowRoot | null | undefined, sheet: CSSStyleSheet, on: boolean) {
  if (!root) return;
  const has = root.adoptedStyleSheets.includes(sheet);
  if (on && !has) root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
  if (!on && has) root.adoptedStyleSheets = root.adoptedStyleSheets.filter((s) => s !== sheet);
}

/**
 * Keeps the sidebar attached to whichever dashboard is on screen. Layout
 * changes go through adopted stylesheets on hui-root and home-assistant-main,
 * so no HA element is moved or restyled inline and everything can be undone.
 */
export class Mounter {
  private hass?: HomeAssistant;
  private root?: HuiRoot;
  private panel?: SidebarPanel;
  private editor?: HTMLElement & Record<string, any>;
  private lastRaw?: SidebarConfig;
  private resolved?: ResolvedConfig;
  private draft?: SidebarConfig;
  private rootSheet = new CSSStyleSheet();
  private mainSheet = new CSSStyleSheet();
  private rootCss = '';
  private mainCss = '';
  private frame = 0;
  private header?: Element;
  private seen: unknown[] = [];
  private resizeObserver = new ResizeObserver(() => this.schedule());

  start() {
    onHass((hass) => {
      this.hass = hass;
      if (this.panel) this.panel.hass = hass;
      if (this.editor) this.editor.hass = hass;
    });
    const schedule = () => this.schedule();
    window.addEventListener('location-changed', schedule);
    window.addEventListener('popstate', schedule);
    window.addEventListener('resize', schedule);
    // HA swaps hui-root and its lovelace object without telling anyone, so
    // poll once a second as well. The poll only compares references; the
    // layout is measured only when one of them changed, because measuring
    // forces a synchronous reflow that slow wall tablets feel while scrolling.
    window.setInterval(() => this.poll(), 1000);
    this.schedule();
  }

  private snapshot(): unknown[] {
    const root = getHuiRoot() as HuiRoot | null;
    const lovelace = root?.lovelace;
    return [root, lovelace, this.draft ?? lovelace?.config?.sidebar, lovelace?.editMode, window.location.href, window.innerWidth];
  }

  private poll() {
    const next = this.snapshot();
    if (next.length !== this.seen.length || next.some((v, i) => v !== this.seen[i])) this.schedule();
  }

  schedule() {
    if (this.frame) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      this.check();
    });
  }

  private check() {
    this.seen = this.snapshot();
    const root = getHuiRoot() as HuiRoot | null;
    const lovelace = root?.lovelace;
    const raw = this.draft ?? lovelace?.config?.sidebar;
    if (!root?.shadowRoot || !lovelace || !raw || typeof raw !== 'object') {
      this.unmount();
      return;
    }
    if (root !== this.root) {
      this.unmount();
      this.root = root;
      this.resizeObserver.observe(root);
    }

    if (!this.panel) {
      this.panel = document.createElement('sidebar-card') as SidebarPanel;
      this.panel.addEventListener('sidebar-card-edit', () => this.openEditor());
    }
    if (this.panel.parentNode !== root.shadowRoot) root.shadowRoot.appendChild(this.panel);

    if (raw !== this.lastRaw) {
      this.lastRaw = raw;
      this.resolved = resolveConfig(raw);
      this.panel.config = this.resolved;
      if (this.resolved.debug) console.info('sidebar-card: config', this.resolved);
    }
    this.panel.hass = this.hass;
    this.panel.path = window.location.pathname;
    this.panel.editMode = lovelace.editMode && !!this.hass?.user?.is_admin;
    this.layout(root, lovelace, this.resolved!);
  }

  private layout(root: HuiRoot, lovelace: Lovelace, c: ResolvedConfig) {
    const vw = document.body.clientWidth;
    const pct = vw <= c.breakpoints.mobile ? c.width.mobile : vw <= c.breakpoints.tablet ? c.width.tablet : c.width.desktop;
    const params = new URLSearchParams(window.location.search);
    const off = params.has('sidebarOff');
    const hidden = pct === 0 || c.hideOnPath.includes(window.location.pathname);
    const hideHeader = c.hideTopMenu && !off && !lovelace.editMode && !(c.showTopMenuOnMobile && vw <= c.breakpoints.mobile);
    const hideHassSidebar = c.hideHassSidebar && !off;

    const rect = root.getBoundingClientRect();
    const width = hidden ? 0 : Math.round((rect.width * pct) / 100);

    let rootCss = `hui-view-container#view { padding-left: calc(${width}px + var(--view-container-inset-left, 0px)) !important; }`;
    if (hideHeader) {
      rootCss += `.header { display: none !important; }
        hui-view-container#view { padding-top: var(--safe-area-inset-top, 0px) !important; min-height: 100vh; }`;
    }
    if (rootCss !== this.rootCss) {
      this.rootCss = rootCss;
      this.rootSheet.replaceSync(rootCss);
    }
    adopt(root.shadowRoot, this.rootSheet, true);

    const mainCss = hideHassSidebar
      ? `:host { --ha-sidebar-width: 0px !important; --ha-top-app-bar-width: 100% !important; } ha-sidebar { display: none !important; }`
      : '';
    if (mainCss !== this.mainCss) {
      this.mainCss = mainCss;
      this.mainSheet.replaceSync(mainCss);
    }
    adopt(getMain()?.shadowRoot, this.mainSheet, !!mainCss);

    // The sidebar sits below HA's header (which kiosk-mode may hide).
    const header = root.shadowRoot!.querySelector<HTMLElement>('.header');
    // kiosk-mode and HA show or hide the header on their own; its size
    // changing is the signal to move the sidebar.
    if (header !== this.header) {
      if (this.header) this.resizeObserver.unobserve(this.header);
      if (header) this.resizeObserver.observe(header);
      this.header = header ?? undefined;
    }
    const top = header && getComputedStyle(header).display !== 'none' ? Math.max(header.getBoundingClientRect().bottom, 0) : 0;

    const style = this.panel!.style;
    style.display = hidden ? 'none' : '';
    style.position = 'fixed';
    style.zIndex = '3';
    style.left = `${rect.left}px`;
    style.top = `${top}px`;
    style.bottom = '0';
    style.width = `${width}px`;
  }

  private unmount() {
    this.panel?.remove();
    this.editor?.remove();
    this.editor = undefined;
    this.draft = undefined;
    if (this.header) this.resizeObserver.unobserve(this.header);
    this.header = undefined;
    if (this.root) {
      this.resizeObserver.unobserve(this.root);
      adopt(this.root.shadowRoot, this.rootSheet, false);
    }
    adopt(getMain()?.shadowRoot, this.mainSheet, false);
    this.root = undefined;
    this.lastRaw = undefined;
  }

  private openEditor() {
    const root = this.root;
    const lovelace = root?.lovelace;
    if (!root?.shadowRoot || !lovelace || this.editor) return;
    const editor = document.createElement('sidebar-card-editor') as HTMLElement & Record<string, any>;
    editor.hass = this.hass;
    editor.lovelace = lovelace;
    editor.config = lovelace.config.sidebar ?? {};
    editor.addEventListener('sidebar-card-preview', (ev: Event) => {
      this.draft = (ev as CustomEvent).detail;
      this.schedule();
    });
    editor.addEventListener('sidebar-card-closed', () => {
      editor.remove();
      this.editor = undefined;
      this.draft = undefined;
      this.lastRaw = undefined;
      this.schedule();
    });
    this.editor = editor;
    root.shadowRoot.appendChild(editor);
  }
}
