import { useState, useEffect } from 'react';
import * as React from 'react';
import { default as Toggle } from './Toggle';
import CustomInput from './CustomInput';

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
  const [sti, setSearchType] = useState(DEFAULTS?.searchType.default);
  const [exactMatch, setExactMatch] = useState(DEFAULTS?.ST0);
  const [regularExp, setRegularExp] = useState(DEFAULTS?.ST1);
  const [looseSearch, setLooseSearch] = useState(DEFAULTS?.ST2);
  const searchTypes = [exactMatch, regularExp, looseSearch];
  const searchTypeSetters = [setExactMatch, setRegularExp, setLooseSearch];
  const searchTypeNames = ['Exact Match', 'Regular Expression', 'Loose Search'];

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
            className={sti === 0 ? 'current' : ''}
            onClick={() => setSearchType(0)}
          >
            <span>
              Exact
              <br />
              Match
            </span>
          </div>
          <div
            className={sti === 1 ? 'current' : ''}
            onClick={() => setSearchType(1)}
          >
            <span>
              Regular
              <br />
              Expression
            </span>
          </div>
          <div
            className={sti === 2 ? 'current' : ''}
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
            {searchTypeNames[sti]} Defaults
          </div>

          <div className="searchTypeDefaults">
            {Object.values(searchTypes[sti]).map((val, i) => (
              <label htmlFor={val.name} key={`${sti}${i}`}>
                {val.name}:{' '}
                <CustomInput
                  type={val.type}
                  id={val.name}
                  {...(val.type === 'toggle'
                    ? { defaultChecked: val.default }
                    : { defaultValue: val.default })}
                  onChange={(e) => {
                    searchTypeSetters[sti]((st: any) => {
                      st[Object.keys(st)[i]].default =
                        val.type === 'toggle'
                          ? e.target.checked
                          : e.target.value;
                      return st;
                    });
                  }}
                />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
