# Sidebar Card 2

A global sidebar for Home Assistant dashboards – modern, theme-aware and **configurable right in the dashboard with a visual editor**.

A rewrite of [DBuit/sidebar-card](https://github.com/DBuit/sidebar-card) (Lit 3, no moment.js/card-tools, ~100 KB instead of ~320 KB). Existing `sidebar:` configurations keep working unchanged. Ideas borrowed from the forks by [knstyl](https://github.com/knstyl/sidebar-card) (notifications, people, status bar, trends) and [Phantom3912/Bobsilvio](https://github.com/Phantom3912/sidebar-card) (menu styles, per-item colors).

Tested against Home Assistant 2026.10 (frontend 20260930).

![Overview, light theme](screenshots/overview-light.png)

<sub>All screenshots show demo data.</sub>

## Screenshots

### Light and dark

The sidebar takes its colors and font from the active Home Assistant theme.

![Overview, dark theme with the wide menu style](screenshots/overview-dark.png)

### Menu styles (`menuStyle`)

| `list` | `wide` | `buttons` (with analog clock) | `grid` |
| :---: | :---: | :---: | :---: |
| <img src="screenshots/menu-list.png" width="200" alt="List menu style"> | <img src="screenshots/menu-wide.png" width="200" alt="Wide pill menu style"> | <img src="screenshots/menu-buttons.png" width="200" alt="Button tiles with analog clock"> | <img src="screenshots/menu-grid.png" width="200" alt="Grid menu style"> |

### Notifications and trends

| Notifications (`notifications`) | Trends (`trends`) |
| :---: | :---: |
| <img src="screenshots/notifications.png" width="260" alt="Notification panel"> | <img src="screenshots/trends.png" width="300" alt="Trend chart with two sensors"> |

Alert rows such as "Front door is open" (`glanceBar` with `position: attention`) and the notification stack stay pinned to the bottom of the sidebar while the content above scrolls.

### Visual editor

![Editor, menu tab](screenshots/editor-menu.png)

![Editor, layout tab](screenshots/editor-layout.png)

## Installation

### HACS

1. **HACS → ⋮ → Custom repositories**: add `https://github.com/marvin-rse/sidebar-card` with type **Dashboard**.
2. Search for "Sidebar Card 2" and download it.
3. Check that **Settings → Dashboards → ⋮ → Resources** contains exactly one entry for `sidebar-card.js` (HACS usually adds it for you).
4. Reload the browser or the companion app.

If you used DBuit/sidebar-card through HACS before, remove it first – both repositories are named `sidebar-card`.

### Manual

Copy `sidebar-card.js` from the [latest release](https://github.com/marvin-rse/sidebar-card/releases/latest) to `/config/www/sidebar-card/` and add `/local/sidebar-card/sidebar-card.js` as a resource (type: JavaScript module).

If the old and the new version are loaded at the same time, only one of them builds a sidebar and the browser console shows a hint.

## Editing

Open the dashboard and choose **Edit** (or append `?edit=1` to the URL). A **gear button** appears in the top right corner of the sidebar. It opens the editor with a live preview:

| Tab | Contents |
| --- | --- |
| Header | Title, clock (digital/analog), date, weather, people, message template |
| Menu | Menu style; items with icon, tap/hold action, active entity, condition, colors; "Add views" |
| Status | Home Assistant notifications, status bar or alert rows |
| Trends | Swipeable charts, ranges, auto advance |
| Cards | Any Lovelace cards at the bottom of the sidebar (YAML) |
| Layout | Width per device, breakpoints, accent color, hide HA header/sidebar, custom CSS |
| YAML | The complete configuration |

The editor speaks English and German, following the Home Assistant language. It saves into the dashboard configuration (key `sidebar:`), just like before.

## Configuration (YAML)

```yaml
sidebar:
  digitalClock: true
  date: true
  dateFormat: "dddd, MMMM D"      # optional, moment-style tokens; empty = automatic
  weatherEntity: weather.home
  presence: [person.alex, person.sam]
  template: |
    <li>{% if now().hour < 12 %}Good morning{% else %}Hello{% endif %}</li>
  menuStyle: wide                  # list | wide | buttons | grid
  showLabel: true
  sidebarMenu:
    - name: Home
      icon: mdi:home
      tap_action: { action: navigate, navigation_path: /wall-tablet/home }
    - name: Lights
      icon: mdi:sofa
      state: light.living_room     # highlighted while on
      tap_action: { action: toggle, entity: light.living_room }
      hold_action: { action: more-info, entity: light.living_room }
      conditional: "{{ is_state('input_boolean.guests', 'off') }}"
      background_color: "rgba(255, 200, 140, .9)"
  notifications: true
  glanceBar:
    position: attention            # or a plain list = icons at the bottom
    items:
      - entity: binary_sensor.front_door
        icon: mdi:door-open
        label: "{name} is open"
      - entity: sensor.co2
        label: "CO₂ {state} {unit}"
        tone: { warn_above: 1000, alert_above: 1500 }
  trends:
    ranges: [24h, 7d]
    autoAdvance: 10
    items:
      - name: Temperature
        entities: [sensor.outdoor_temperature, sensor.living_room_temperature]
      - entity: sensor.aqi
        bands: aqi
  cards:
    - type: custom:mushroom-media-player-card
      entity: media_player.living_room
  cardStyle: ":host { width: 100%; }"
  width: { mobile: 0, tablet: 25, desktop: 20 }
  breakpoints: { mobile: 768, tablet: 1024 }
  accentColor: "#ff9800"
  hideTopMenu: false
  hideHassSidebar: false
  hideOnPath: [/wall-tablet/cameras]
  style: |
    :host { --sidebar-background: #10131a; }
```

Actions are Home Assistant's standard actions (`navigate`, `more-info`, `toggle`, `perform-action`, `url`, `assist`, `none`), including `confirmation`.

### Compatibility with v1

- Menu items with `action:`/`navigation_path:`/`service:`/`service_data:` keep working. The editor converts them to `tap_action` when it opens.
- `bottomCard: { type, cardOptions, cardStyle }` is still read. The editor turns it into `cards:` and `cardStyle:`.
- `conditional:` is now rendered by Home Assistant itself (real Jinja instead of the previous pattern matching).
- `service-js` still works but can only be edited in the YAML tab. `this` is now the menu element (with `this.hass`).
- The CSS variables `--sidebar-background`, `--sidebar-text-color`, `--sidebar-icon-color`, `--sidebar-selected-text-color`, `--sidebar-selected-icon-color` and the clock variables (`--face-color` …) still apply.
- `?sidebarOff` in the URL disables `hideTopMenu`/`hideHassSidebar`. In edit mode the HA header always stays visible.
- New default date format: "Monday, November 2" (previously `DD MMMM`).

## Development

```sh
npm install
npm run build      # dist/sidebar-card.js
npm run watch
npm run typecheck
```

## License

MIT. Original sidebar-card by DBuit and contributors.
