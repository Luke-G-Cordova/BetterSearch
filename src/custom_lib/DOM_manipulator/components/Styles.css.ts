export const styles = /*css*/ `
  *{
    font-family: sans-serif;
  }
  /* no select */
  div {
    user-select: none;
  }
  span {
    user-select: none;
  }

  /* custom break */
  BS-break {
    display: block;
    height: 0.5px;
    margin: 0 5% 2% 5%;
    background-color: #3c3f41;
  }

  /* scroll bars */
  .BSScrollBar {
    max-height: inherit;
    overflow-y: scroll;
  }
  .BSScrollBar::-webkit-scrollbar {
    width: 4px;
  }
  .BSScrollBar::-webkit-scrollbar-track {
    background-color: #3c3f41;
  }
  .BSScrollBar::-webkit-scrollbar-thumb {
    background-color: #111113;
    border-radius: 4px;
  }

  /* control wrapper */
  #BS-control-wrapper {
    display: inline-block;
    width: 100%;
  }
  #BS-input-button {
    float: left;
  }
  #BS-exit-button {
    float: right;
  }
  .BSControlButton {
    padding: 5px;
    margin: 3px;
    display: inline-block;
  }

  /* buttons */
  .BSButton {
    color: #6b7074;
    transition: color 500ms ease-out;
  }
  .BSButton:hover {
    color: #acaeb1;
    cursor: pointer;
  }

  /* form wrapper, inputs are children of this wrapper */
  #BS-form-wrapper {
    padding: 5%;
  }

  /* top half of an input */
  .BSInputTopHalf {
    display: flex;
  }
  .BSInputTopHalf > :first-child {
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }
  .BSInputTopHalf > :nth-child(2) {
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
  }

  /* main input, this is where a search term is entered */
  input.BSMainInputField {
    background-color: #111113;
    color: #e8eaed;
    border: 1px solid #6b7074;
    height: 25px;
    width: 200px;
    margin: 0;
    padding-left: 5px;
    box-sizing: border-box;
  }
  input.BSMainInputField::placeholder {
    color: #55595d;
  }

  /* search modifiers */
  .BSModifierWrapper {
    border-top: 1px solid #6b7074;
    border-right: 1px solid #6b7074;
    border-bottom: 1px solid #6b7074;
    height: 25px;
    min-width: 25px;
    box-sizing: border-box;
    position: relative;
  }

  /* the element that when hovered shows the modifier dropdown */
  .BSModifierCoverButton {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 25px;
    height: 25px;
  }
  .BSModifierWrapper:hover .BSModifierDropdown {
    visibility: visible;
    max-height: 200px;
  }

  /* modifier dropdown */
  .BSModifierDropdown {
    visibility: hidden;
    position: absolute;
    max-height: 0px;
    width: 160px;
    overflow: hidden;
    left: -45px;
    top: 23px;
    border: 1px solid #6b7074;
    border-radius: 10px;
    overflow-x: hidden;
    z-index: 1;
    transition: max-height 1s, visibility 1s;
  }

  /* modifier buttons and inputs */
  .BSModifierButton {
    background-color: #202124;
    padding: 5px;
    position: relative;
  }
  .BSModifierButton label:before {
    position: absolute;
    content: '';
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
  }
  .BSModifierButton label:hover {
    cursor: pointer;
  }
  .BSModifierInput {
    float: right;
  }
  .BSModifierButton:hover {
    background-color: #111113;
    padding: 5px;
  }
  .BSMaxMatchLimitWrapper:hover {
    cursor: default;
  }
  .BSMaxMatchLimit {
    width: 50px;
    height: 25px;
    background-color: #202124;
    color: #acaeb1;
    border: 1px solid #6b7074;
    border-radius: 3px;
    box-sizing: border-box;
  }
  .BSColorPicker::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  .BSColorPicker::-webkit-color-swatch {
    border: none;
  }
  .BSColorPicker {
    -webkit-appearance: none;
    border: none;
  }
  .BSColorPickerWrapper:hover {
    cursor: default;
  }
  .BSColorPicker:hover {
    cursor: pointer;
  }

  /* bottom half of an input */
  .BSInputBottomHalf {
    display: flex;
    padding-top: 5px;
  }
  .BSActionButton {
    width: 25px;
    height: 25px;
    display: flex;
    border-radius: 7px;
    justify-content: center;
    align-items: center;
  }

  .BSToolTip {
    background-color: #acaeb1;
    color: #202124 !important;
    position: absolute;
    top: -25px;
    left: -20px;
    padding: 2px;
    border-radius: 3px;
    opacity: 0;
    transition: opacity .2s;
  }
  .BSCopyButton {
    position: relative;
  }
`;
