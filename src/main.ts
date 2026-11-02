import { SidebarPanel } from './components/sidebar-panel';
import { Mounter } from './mounter';

declare const __VERSION__: string;

console.info(
  `%c SIDEBAR-CARD %c ${__VERSION__} `,
  'color: #fff; background: #03a9f4; font-weight: 700; border-radius: 4px 0 0 4px;',
  'color: #03a9f4; background: #e1f5fe; font-weight: 700; border-radius: 0 4px 4px 0;',
);

// v1 registers the same element name. Whichever loads second fails to define
// it, so only one sidebar is ever built; tell the user if that is us.
if (customElements.get('sidebar-card') !== SidebarPanel) {
  console.error(
    'sidebar-card: another version of sidebar-card is already loaded. Remove the old resource under Settings → Dashboards → Resources.',
  );
} else {
  new Mounter().start();
}
