import { useState, useEffect } from 'react';
import * as React from 'react';

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
      <div className="topSection">
        <div className="searchType">
          <div className="searchTypeHeader">Search Type</div>
          <div className="inputWrapper">
            <input
              id="exactMatch"
              type="checkbox"
              onChange={() => setSearchType(0)}
              checked={searchType === 0}
            />
            <label htmlFor="exactMatch">Exact Match</label>
          </div>
          <div className="inputWrapper">
            <input
              id="regularExpression"
              type="checkbox"
              onChange={() => setSearchType(1)}
              checked={searchType === 1}
            />
            <label htmlFor="regularExpression">Regular Expression</label>
          </div>
          <div className="inputWrapper">
            <input
              id="looseSearch"
              type="checkbox"
              onChange={() => setSearchType(2)}
              checked={searchType === 2}
            />
            <label htmlFor="looseSearch">Loose Search</label>
          </div>
        </div>
        <div className="sensitivities">
          <div className="inputWrapper">
            <input type="checkbox" id="case" disabled={searchType === 2} />
            <label htmlFor="case">Case Sensitivity</label>
          </div>

          <div className="inputWrapper">
            <label htmlFor="looseSearchSlider">Loose Search Sensitivity</label>
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

      <div className="generalSettings">
        <div className="inputWrapper">
          <input id="autoScroll" type="checkbox" />
          <label htmlFor="autoScroll">Stop Auto Scroll</label>
        </div>
        <div className="inputWrapper">
          <input
            id="maximumMatches"
            type="number"
            value={maximumMatches}
            min="0"
            onInput={(e) =>
              setMaximumMatches(Number((e.target as HTMLInputElement).value))
            }
          />
          <label htmlFor="maximumMatches">Maximum Matches</label>
        </div>
        <div className="inputWrapper">
          <input
            id="selectionColor"
            type="color"
            value={selectionColor}
            onInput={(e) =>
              setSelectionColor((e.target as HTMLInputElement).value)
            }
          />
          <label htmlFor="selectionColor">Selection Color</label>
        </div>
      </div>
    </div>
  );
}
