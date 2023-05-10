export const getBetterSearchInput = () => {
  const BetterSearchInput = document.createElement('div');
  BetterSearchInput.className = 'BSInputWrapper shadowWrapper';
  BetterSearchInput.innerHTML = /*html*/ `
<div class="BSInputTopHalf">
  <input class="BSMainInputField" type="text" placeholder="regular expression" name="some-key"/>
  <span class="BSModifierWrapper">
    <div class="BSButton BSModifierCoverButton">V</div>
    <div class="BSModifierDropdown">
      <div class="BSScrollBar">
        <div class="BSButton BSModifierButton">
          <input class="BSModifierInput" id="BS-exact-match" type="checkbox" checked />
          <label for="BS-exact-match">Exact match</label>
        </div>
        <div class="BSButton BSModifierButton">
          <input class="BSModifierInput" id="BS-is-regex" type="checkbox" />
          <label for="BS-is-regex">Regular expression</label>
        </div>
        <div class="BSButton BSModifierButton">
          <input class="BSModifierInput" id="BS-levenshtein" type="checkbox" />
          <label for="BS-levenshtein">Loose search</label>
        </div>
        <div class="BSButton BSModifierButton">
          <input type="range" min="0" max="1" step=".01" id="BS-levenshtein-slider" />
        </div>
        <div class="BSButton BSModifierButton">
          <input class="BSModifierInput" id="BS-case-sensitive" type="checkbox" />
          <label for="BS-case-sensitive">Case sensitive</label>
        </div>
        <div class="BSButton BSModifierButton">
          <input class="BSModifierInput" id="BS-should-scroll" type="checkbox" />
          <label for="BS-should-scroll">Stop auto scroll</label>
        </div>
        <div class="BSButton BSModifierButton BSMaxMatchLimitWrapper">
          <input class="BSModifierInput BSMaxMatchLimit" id="BS-max-matches" type="number" value="100"/>
          <div>Maximum matches</div>
        </div>
        <div class="BSButton BSModifierButton BSColorPickerWrapper">
          <input class="BSModifierInput BSColorPicker" id="BS-color-input" type="color" value="#FBFF00"/>
            <div>Selection color <span class="BSButton BSColorFacts"><span>#FBFF00</span> <span class="BSCopyButton BSColorCopyButton">⛶<div class="BSToolTip BSColorCopyToolTip">Copied</div></span></div>
        </div>
      </div>
    </div>
  </span>
</div>
<div class="BSInputBottomHalf">
  <span class="BSButton BSActionButton BSPrevButton">⇐</span>
  <span class="BSButton BSActionButton BSNextButton">⇒</span>
  <span class="BSButton BSActionButton BSDeleteButton">-</span>
  <span class="BSButton BSActionButton BSCopyButton">⛶</span>
  <span style="flex-grow:1;"></span>
  <span class="BSFoundMatches BSActionButton">
    <span class="BSMatchNumerator">0</span>
    /
    <span class="BSMatchDenominator">0</span>
  </span>
</div>
`;
  return BetterSearchInput;
};
