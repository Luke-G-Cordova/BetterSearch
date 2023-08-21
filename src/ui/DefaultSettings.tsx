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
interface DSProps {
  DEFAULTS: DefaultSettings;
}
export default function DefaultSettings({ DEFAULTS }: DSProps) {
  const [searchType, setSearchType] = useState(DEFAULTS?.searchType.default);
  const [exactMatch, setExactMatch] = useState(DEFAULTS?.ST0);
  const [regularExp, setRegularExp] = useState(DEFAULTS?.ST1);
  const [looseSearch, setLooseSearch] = useState(DEFAULTS?.ST2);

  // const [coms, setComs] = useState<chrome.commands.Command[]>([]);

  // // get current keyboard shortcuts
  // useEffect(() => {
  //   chrome.commands.getAll((commands) => {
  //     setComs(commands);
  //   });

  //   // only want to set the initial selection color, this hook executes once so doing it here is fine
  //   (document.querySelector('input#selectionColor') as HTMLInputElement).value =
  //     DEFAULTS?.selectionColor.default;
  // }, []);

  return (
    <div className="defaultSettings">
      <div className="settingsArea">
        <div className="searchTypeTabs">
          <div
            className={searchType === 0 ? 'current' : ''}
            onClick={() => setSearchType(0)}
          >
            <span>
              Exact
              <br />
              Match
            </span>
          </div>
          <div
            className={searchType === 1 ? 'current' : ''}
            onClick={() => setSearchType(1)}
          >
            <span>
              Regular
              <br />
              Expression
            </span>
          </div>
          <div
            className={searchType === 2 ? 'current' : ''}
            onClick={() => setSearchType(2)}
          >
            <span>
              Loose
              <br />
              Search
            </span>
          </div>
        </div>
        <div className="searchTypeSettings">
          <div className="searchTypeHeader">
            {searchType === 0
              ? 'Exact Match'
              : searchType === 1
              ? 'Regular Expression'
              : 'Loose Search'}{' '}
            Defaults
          </div>

          <div className="searchTypeDefaults">
            {searchType === 0 ? (
              <>
                <label htmlFor="CaseSensitivity">
                  Case Sensitivity: <Toggle htmlFor="CaseSensitivity" />
                </label>
                <label htmlFor="AutoScroll">
                  Auto Scroll: <Toggle htmlFor="AutoScroll" />
                </label>
                <label htmlFor="MaximumMatches">
                  Maximum Matches: <input type="number" id="MaximumMatches" />
                </label>
                <label htmlFor="SelectionColor">
                  Selection Color: <input type="color" id="SelectionColor" />
                </label>
              </>
            ) : searchType === 1 ? (
              <>
                <label htmlFor="CaseSensitivity">
                  Case Sensitivity: <Toggle htmlFor="CaseSensitivity" />
                </label>
                <label htmlFor="AutoScroll">
                  Auto Scroll: <Toggle htmlFor="AutoScroll" />
                </label>
                <label htmlFor="MaximumMatches">
                  Maximum Matches: <input type="number" id="MaximumMatches" />
                </label>
                <label htmlFor="SelectionColor">
                  Selection Color: <input type="color" id="SelectionColor" />
                </label>
              </>
            ) : searchType === 2 ? (
              <>
                <label htmlFor="PercentMatch">
                  Percent Match:{' '}
                  <input
                    id="PercentMatch"
                    type="range"
                    min="0"
                    max="1"
                    step=".01"
                    defaultValue={0.75}
                  />
                </label>
                <label htmlFor="AutoScroll">
                  Auto Scroll: <Toggle htmlFor="AutoScroll" />
                </label>
                <label htmlFor="MaximumMatches">
                  Maximum Matches: <input type="number" id="MaximumMatches" />
                </label>
                <label htmlFor="SelectionColor">
                  Selection Color: <input type="color" id="SelectionColor" />
                </label>
              </>
            ) : (
              'unavailable search type'
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
