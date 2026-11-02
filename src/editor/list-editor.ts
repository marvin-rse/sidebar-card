import { LitElement, css, html, nothing } from 'lit';
import { fireEvent } from '../ha';
import { localize } from '../localize';
import type { HomeAssistant } from '../types';

export interface ListEditorAdapter<T> {
  schema(item: T): readonly Record<string, any>[];
  toForm?(item: T): Record<string, any>;
  fromForm?(item: T, data: Record<string, any>): T;
  title(item: T, index: number): string;
  icon?(item: T): string | undefined;
  /** When set, the item is shown read-only with this note. */
  readOnly?(item: T): string | undefined;
  create(): T;
}

/** Expandable, reorderable list of ha-form rows. Emits `items-changed`. */
class SbListEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    items: { attribute: false },
    adapter: { attribute: false },
    computeLabel: { attribute: false },
    _open: { state: true },
  };

  hass?: HomeAssistant;
  items: any[] = [];
  adapter?: ListEditorAdapter<any>;
  computeLabel?: (schema: any) => string;
  private _open: number | null = null;

  private _emit(items: any[]) {
    fireEvent(this, 'items-changed', items);
  }

  private _move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= this.items.length) return;
    const items = [...this.items];
    [items[index], items[target]] = [items[target], items[index]];
    if (this._open === index) this._open = target;
    else if (this._open === target) this._open = index;
    this._emit(items);
  }

  private _remove(index: number) {
    const items = this.items.filter((_, i) => i !== index);
    if (this._open === index) this._open = null;
    else if (this._open !== null && this._open > index) this._open--;
    this._emit(items);
  }

  private _add() {
    const items = [...this.items, this.adapter!.create()];
    this._open = items.length - 1;
    this._emit(items);
  }

  private _changed(index: number, ev: CustomEvent) {
    ev.stopPropagation();
    const a = this.adapter!;
    const item = this.items[index];
    const next = a.fromForm ? a.fromForm(item, ev.detail.value) : ev.detail.value;
    const items = [...this.items];
    items[index] = next;
    this._emit(items);
  }

  render() {
    const a = this.adapter;
    if (!a || !this.hass) return nothing;
    const lang = this.hass.language;
    return html`
      <div class="list">
        ${this.items.map((item, i) => {
          const open = this._open === i;
          const note = a.readOnly?.(item);
          const icon = a.icon?.(item);
          return html`<div class="row ${open ? 'open' : ''}">
            <div class="row-head">
              <button class="toggle" aria-expanded=${open} @click=${() => (this._open = open ? null : i)}>
                <ha-icon class="chevron" icon="mdi:chevron-right"></ha-icon>
                ${icon ? html`<ha-icon class="item-icon" .icon=${icon}></ha-icon>` : nothing}
                <span class="name">${a.title(item, i)}</span>
              </button>
              <button class="icon-btn" title=${localize(lang, 'editor.move_up')} ?disabled=${i === 0} @click=${() => this._move(i, -1)}>
                <ha-icon icon="mdi:arrow-up"></ha-icon>
              </button>
              <button class="icon-btn" title=${localize(lang, 'editor.move_down')} ?disabled=${i === this.items.length - 1}
                @click=${() => this._move(i, 1)}>
                <ha-icon icon="mdi:arrow-down"></ha-icon>
              </button>
              <button class="icon-btn danger" title=${localize(lang, 'editor.remove')} @click=${() => this._remove(i)}>
                <ha-icon icon="mdi:delete-outline"></ha-icon>
              </button>
            </div>
            ${open
              ? html`<div class="row-body">
                  ${note
                    ? html`<p class="note">${note}</p>`
                    : html`<ha-form
                        .hass=${this.hass}
                        .data=${a.toForm ? a.toForm(item) : item}
                        .schema=${a.schema(item)}
                        .computeLabel=${this.computeLabel}
                        @value-changed=${(ev: CustomEvent) => this._changed(i, ev)}
                      ></ha-form>`}
                </div>`
              : nothing}
          </div>`;
        })}
      </div>
      <button class="add" @click=${this._add}>
        <ha-icon icon="mdi:plus"></ha-icon>${localize(lang, 'editor.add_item')}
      </button>
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
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    button[disabled] {
      opacity: 0.3;
      pointer-events: none;
    }
    .list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .row {
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      background: var(--card-background-color);
      overflow: hidden;
    }
    .row.open {
      border-color: color-mix(in srgb, var(--primary-color) 50%, var(--divider-color));
    }
    .row-head {
      display: flex;
      align-items: center;
      gap: 2px;
      padding: 4px 6px 4px 4px;
    }
    .toggle {
      flex: 1;
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
      border-radius: 8px;
    }
    .chevron {
      --mdc-icon-size: 20px;
      color: var(--secondary-text-color);
      transition: transform 150ms ease;
    }
    .open .chevron {
      transform: rotate(90deg);
    }
    .item-icon {
      --mdc-icon-size: 20px;
      color: var(--primary-color);
    }
    .name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .icon-btn {
      display: grid;
      place-items: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      color: var(--secondary-text-color);
      --mdc-icon-size: 20px;
    }
    .icon-btn:hover {
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
    }
    .icon-btn.danger:hover {
      color: var(--error-color);
    }
    .row-body {
      padding: 4px 14px 16px;
    }
    .note {
      margin: 8px 0 0;
      color: var(--secondary-text-color);
      font-size: 14px;
    }
    .add {
      margin-top: 10px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      border-radius: 999px;
      color: var(--primary-color);
      font-weight: 500;
      --mdc-icon-size: 20px;
    }
    .add:hover {
      background: color-mix(in srgb, var(--primary-color) 10%, transparent);
    }
  `;
}

if (!customElements.get('sidebar-card-list-editor')) customElements.define('sidebar-card-list-editor', SbListEditor);
