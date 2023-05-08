import { Globals } from '../../../Globals';
import { bsrPopupCard } from './BSRPopupCard.html';
import { styles } from '../Styles.css';

export class BSRPopupCard extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });

    Globals.formWrapper = bsrPopupCard.querySelector('#bsr-form-wrapper');

    const style = document.createElement('style');
    style.textContent = styles;
    shadowRoot.appendChild(style);
    shadowRoot.appendChild(bsrPopupCard);
  }
}
