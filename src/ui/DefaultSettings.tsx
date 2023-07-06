import { useState, useEffect } from 'react';
import * as React from 'react';
import { default as Toggle } from './Toggle';

/**
 * exact match
 * regular expression
 * loose search
 * loose search percent match
 * case sensitive
 * stop auto scroll
 * maximum matches
 * selection color
 */
export default function DefaultSettings() {
  const [searchType, setSearchType] = useState(0);
  const [looseSearchPercent, setLooseSearchPercent] = useState(0.75);
  const [maximumMatches, setMaximumMatches] = useState(100);
  const [selectionColor, setSelectionColor] = useState('#fbff00');
  return (
    <div className="defaultSettings">
      <div className="defaultSettingsHeader">Default Settings:</div>
      <div className="settingsArea">
        <div className="searchTypes">
          <form>
            <div className={searchType === 0 ? 'current' : ''}>
              <input
                id="emType"
                type="checkbox"
                onChange={() => setSearchType(0)}
                checked={searchType === 0}
              />
              <label htmlFor="emType">Exact Match</label>
            </div>

            <div className={searchType === 1 ? 'current' : ''}>
              <input
                id="rgType"
                type="checkbox"
                onChange={() => setSearchType(1)}
                checked={searchType === 1}
              />
              <label htmlFor="rgType">Regex</label>
            </div>

            <div className={searchType === 2 ? 'current' : ''}>
              <input
                id="lType"
                type="checkbox"
                onChange={() => setSearchType(2)}
                checked={searchType === 2}
              />
              <label htmlFor="lType">Loose</label>
            </div>
          </form>
        </div>

        <div className="searchTypeSettings">
          <div
            className="typeSetting emSettings"
            style={{ display: searchType === 0 ? 'block' : 'none' }}
          >
            <Toggle htmlFor="Case Sensitivity" />
          </div>
          <div
            className="typeSetting rgSettings"
            style={{ display: searchType === 1 ? 'block' : 'none' }}
          >
            <Toggle htmlFor="Case Sensitivity" />
          </div>
          <div
            className="typeSetting lSettings"
            style={{ display: searchType === 2 ? 'block' : 'none' }}
          >
            <div className="inputWrapper">
              <label htmlFor="looseSearchSlider">
                Loose Search Sensitivity
              </label>
              <input
                id="looseSearchSlider"
                type="range"
                min="0"
                max="1"
                step=".01"
                disabled={searchType !== 2}
                value={looseSearchPercent}
                onInput={(e) => {
                  setLooseSearchPercent(
                    Number((e.target as HTMLInputElement).value),
                  );
                }}
              />
            </div>
            <span>{looseSearchPercent}</span>
          </div>
        </div>

        <div className="horizontalBreak"></div>

        <div className="generalSettings">
          <Toggle htmlFor="Auto Scroll" />
          <div className="inputWrapper">
            <label htmlFor="maximumMatches">Maximum Matches</label>
            <input
              id="maximumMatches"
              type="number"
              value={maximumMatches}
              min="0"
              onInput={(e) =>
                setMaximumMatches(Number((e.target as HTMLInputElement).value))
              }
            />
          </div>
          <div className="inputWrapper">
            <label htmlFor="selectionColor">Selection Color</label>
            <input
              id="selectionColor"
              type="color"
              value={selectionColor}
              onInput={(e) =>
                setSelectionColor((e.target as HTMLInputElement).value)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
