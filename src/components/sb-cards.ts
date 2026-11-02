import { LitElement, css, html } from 'lit';
import type { HomeAssistant } from '../types';

/** Renders Lovelace cards at the bottom of the sidebar. */
class SbCards extends LitElement {
  static properties = {
    hass: { attribute: false },
    cards: { attribute: false },
    cardStyle: {},
  };

  hass?: HomeAssistant;
  cards: Record<string, any>[] = [];
  cardStyle?: string;
  private _elements: HTMLElement[] = [];
  private _builtFor = '';

  protected updated(changed: Map<string, unknown>) {
    const key = JSON.stringify([this.cards, this.cardStyle]);
    if (key !== this._builtFor) {
      this._builtFor = key;
      this._build();
    } else if (changed.has('hass')) {
      this._elements.forEach((el) => ((el as any).hass = this.hass));
    }
  }

  private async _build() {
    const key = this._builtFor;
    const helpers = await (window as any).loadCardHelpers?.();
    if (!helpers || key !== this._builtFor) return;
    const container = this.renderRoot.querySelector('.cards');
    if (!container) return;
    this._elements = this.cards.map((config) => {
      const el = helpers.createCardElement(config) as HTMLElement;
      (el as any).hass = this.hass;
      if (this.cardStyle) this._injectStyle(el, this.cardStyle);
      return el;
    });
    container.replaceChildren(...this._elements);
  }

  // `cardStyle` styles the inside of each card, so it has to go into the
  // card's shadow root once the card has rendered one.
  private _injectStyle(el: HTMLElement, cssText: string, attempt = 0) {
    if (el.shadowRoot) {
      const style = document.createElement('style');
      style.textContent = cssText;
      el.shadowRoot.appendChild(style);
    } else if (attempt < 30) {
      window.setTimeout(() => this._injectStyle(el, cssText, attempt + 1), 100);
    }
  }

  render() {
    return html`<div class="cards"></div>`;
  }

  static styles = css`
    .cards {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  `;
}

if (!customElements.get('sidebar-card-cards')) customElements.define('sidebar-card-cards', SbCards);
