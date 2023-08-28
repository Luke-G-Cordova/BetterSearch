import React from 'react';

export default function Input() {
  return (
    <>
      <div className="BSInputTopHalf">
        <input
          className="BSMainInputField"
          type="text"
          placeholder="regular expression"
          name="some-key"
        />
        <span className="BSModifierWrapper">
          <div className="BSButton BSModifierCoverButton">V</div>
          <div className="BSModifierDropdown">
            <div className="BSScrollBar">
              <div className="BSButton BSModifierButton">
                <input
                  className="BSModifierInput"
                  id="BS-exact-match"
                  type="checkbox"
                  checked
                />
                <label htmlFor="BS-exact-match">Exact match</label>
              </div>
              <div className="BSButton BSModifierButton">
                <input
                  className="BSModifierInput"
                  id="BS-is-regex"
                  type="checkbox"
                />
                <label htmlFor="BS-is-regex">Regular expression</label>
              </div>
              <div className="BSButton BSModifierButton">
                <input
                  className="BSModifierInput"
                  id="BS-levenshtein"
                  type="checkbox"
                />
                <label htmlFor="BS-levenshtein">Loose search</label>
              </div>
              <div className="BSButton BSModifierButton">
                <input
                  id="BS-levenshtein-slider"
                  type="range"
                  min="0"
                  max="1"
                  step=".01"
                  style={{ maxWidth: '70%' }}
                />
                <span
                  id="BS-levenshtein-slider-value"
                  style={{ float: 'right' }}
                >
                  0.75
                </span>
              </div>
              <div className="BSButton BSModifierButton">
                <input
                  className="BSModifierInput"
                  id="BS-case-sensitive"
                  type="checkbox"
                />
                <label htmlFor="BS-case-sensitive">Case sensitive</label>
              </div>
              <div className="BSButton BSModifierButton">
                <input
                  className="BSModifierInput"
                  id="BS-should-scroll"
                  type="checkbox"
                />
                <label htmlFor="BS-should-scroll">Stop auto scroll</label>
              </div>
              <div className="BSButton BSModifierButton BSMaxMatchLimitWrapper">
                <input
                  className="BSModifierInput BSMaxMatchLimit"
                  id="BS-max-matches"
                  type="number"
                  value="100"
                />
                <div>Maximum matches</div>
              </div>
              <div className="BSButton BSModifierButton BSColorPickerWrapper">
                <input
                  className="BSModifierInput BSColorPicker"
                  id="BS-color-input"
                  type="color"
                  value="#FBFF00"
                />
                <div>
                  Selection color{' '}
                  <span className="BSButton BSColorFacts">
                    <span>#FBFF00</span>{' '}
                    <span className="BSCopyButton BSColorCopyButton">
                      ⛶
                      <div className="BSToolTip BSColorCopyToolTip">Copied</div>
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </span>
      </div>
      <div className="BSInputBottomHalf">
        <span className="BSButton BSActionButton BSPrevButton">⇐</span>
        <span className="BSButton BSActionButton BSNextButton">⇒</span>
        <span className="BSButton BSActionButton BSDeleteButton">-</span>
        <span className="BSButton BSActionButton BSCopyButton">⛶</span>
        <span
          style={{
            flexGrow: '1',
          }}
        ></span>
        <span className="BSFoundMatches BSActionButton">
          <span className="BSMatchNumerator">0</span>/
          <span className="BSMatchDenominator">0</span>
        </span>
      </div>
    </>
  );
}
