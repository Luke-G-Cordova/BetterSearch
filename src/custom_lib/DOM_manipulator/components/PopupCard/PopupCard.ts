import { Globals } from '../../../Globals';
import { BetterSearchPopupCard } from './PopupCard.html';
import { styles } from '../Styles.css';

export class PopupCard extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });

    Globals.formWrapper =
      BetterSearchPopupCard.querySelector('#BS-form-wrapper');

    const style = document.createElement('style');
    style.textContent = styles;
    shadowRoot.appendChild(style);
    shadowRoot.appendChild(BetterSearchPopupCard);
  }
}
