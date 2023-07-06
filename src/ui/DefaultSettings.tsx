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
  const [defaults, setDefaults] = useState(DEFAULTS);

  const [searchType, setSearchType] = useState(defaults?.searchType.default);
  const [caseSensitiveExact, setCaseSensitiveExact] = useState(
    defaults.ST0CaseSens.default,
  );
  const [caseSensitiveRegex, setCaseSensitiveRegex] = useState(
    defaults.ST1CaseSens.default,
  );
  const [looseSearchPercent, setLooseSearchPercent] = useState(
    defaults.ST2PercentMatch.default,
  );
  const [maximumMatches, setMaximumMatches] = useState(
    defaults?.maximumMatches.default,
  );
  const [selectionColor, setSelectionColor] = useState(
    defaults?.selectionColor.default,
  );
  const [autoScroll, setAutoScroll] = useState(defaults?.autoScroll.default);

  const [coms, setComs] = useState<chrome.commands.Command[]>([]);

  // get current keyboard shortcuts
  useEffect(() => {
    chrome.commands.getAll((commands) => {
      setComs(commands);
    });
  }, []);

  return (
    <div className="defaultSettings">
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
            <Toggle
              htmlFor="emCase"
              label="Case Sensitivity"
              defaultChecked={caseSensitiveExact}
              onChange={(e) => setCaseSensitiveExact(e.target.checked)}
            />
          </div>
          <div
            className="typeSetting rgSettings"
            style={{ display: searchType === 1 ? 'block' : 'none' }}
          >
            <Toggle
              htmlFor="rgCase"
              label="Case Sensitivity"
              defaultChecked={caseSensitiveRegex}
              onChange={(e) => setCaseSensitiveRegex(e.target.checked)}
            />
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
          <Toggle
            htmlFor="autoScroll"
            label="Auto Scroll"
            defaultChecked={autoScroll}
            onChange={(e) => setAutoScroll(e.target.checked)}
          />
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

        <div className="horizontalBreak"></div>

        <div className="keybindings">
          <div className="keybindingsHeader">Keybindings: </div>
          <div className="cmdArea">
            {coms.map((com, i) =>
              com.name !== '_execute_action' ? (
                <div className="command" key={i}>
                  <div className="cmdName">{com.name}: </div>
                  <div className="cmd">
                    <div>Keyboard Shortcut: </div>
                    {com.shortcut}
                  </div>
                  <div className="cmdDesc">
                    <div>Description: </div>
                    {com.description}
                  </div>
                </div>
              ) : (
                ''
              ),
            )}
          </div>
          <a
            href="#"
            onClick={() =>
              chrome.tabs.create({ url: 'chrome://extensions/shortcuts' })
            }
          >
            Change Keyboard Shortcuts
          </a>
        </div>
        <div
          className="saveBtn"
          onClick={() => {
            defaults.searchType.default = searchType;
            defaults.ST0CaseSens.default = caseSensitiveExact;
            defaults.ST1CaseSens.default = caseSensitiveRegex;
            defaults.ST2PercentMatch.default = looseSearchPercent;
            defaults.maximumMatches.default = maximumMatches;
            defaults.autoScroll.default = autoScroll;
            defaults.selectionColor.default = selectionColor;

            chrome.storage.sync.set(defaults);
          }}
        >
          SAVE
        </div>
      </div>
    </div>
  );
}
