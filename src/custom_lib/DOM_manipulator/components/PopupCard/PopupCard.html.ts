export const BetterSearchPopupCard = document.createElement('div');
BetterSearchPopupCard.className = 'BSPopupWrapper shadowWrapper';
BetterSearchPopupCard.innerHTML = /*html*/ `
<div id="BS-control-wrapper">
  <span id="BS-input-button" class="BSButton BSControlButton">NEW</span>
  <span id="BS-exit-button" class="BSButton BSControlButton">X</span>
</div>
<BS-break></BS-break>
<div id="BS-form-wrapper"></div>
`;
