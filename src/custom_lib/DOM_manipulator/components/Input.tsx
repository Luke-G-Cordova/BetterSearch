import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Globals } from '../../Globals';
import { highlightMe, nextMatch, invertColor, SearchType } from '../utils/util';
import { clearHighlight } from '../../highlight/Highlighter';

interface InputProps {
  ariaKey: string;
  nonDraggableRefElement: (ref: HTMLElement) => void;
  defaults: DefaultSettings;
}
export default function Input({
  ariaKey,
  nonDraggableRefElement,
  defaults,
}: InputProps) {
  const [searchType, setSearchType] = useState<SearchType>(
    defaults.searchType.default,
  );
  const [preserveCase, setPreserveCase] = useState<boolean>(
    getGroup(defaults).caseSens,
  );
  const [pScroll, setPScroll] = useState<boolean>(
    getGroup(defaults).autoScroll,
  );
  const [maxLimit, setMaxLimit] = useState<number>(
    getGroup(defaults).maximumMatches,
  );
  const [currentColor, setCurrentColor] = useState<string>(
    getGroup(defaults).selectionColor,
  );
  const [percentMatch, setPercentMatch] = useState(
    getGroup(defaults).percentMatch,
  );

  const nextOrPrev = useRef<HTMLElement>();
  const [key, setKey] = useState(
    `regex-key-${Math.random().toString(36).substring(2, 5)}`,
  );
  const searchInput = useRef<HTMLInputElement>();
  const next = useRef<HTMLElement>();
  const prev = useRef<HTMLElement>();
  const countNum = useRef<HTMLElement>();
  const countDen = useRef<HTMLElement>();

  useEffect(() => {
    searchInput.current.focus();
  }, []);

  function handleHighlighting() {
    if (
      highlightMe(
        searchInput.current.value,
        searchType,
        key,
        {
          color: currentColor,
          mods: preserveCase ? 'i' : '',
          limit: maxLimit,
          percentMatch: percentMatch,
        },
        (match, sameMatchID, color) => {
          const highlightMeElem = document.createElement('highlight-me');
          highlightMeElem.className = `chrome-BS-highlight-me ${key}`;
          if (Globals.CUR_INDEX === 0) {
            highlightMeElem.className += ' current';
          }
          highlightMeElem.style.backgroundColor = color;
          highlightMeElem.style.color = invertColor(color);
          // highlightMeElem.id = `${CUR_INDEX}|${key}|${multiNodeMatchId}`;
          Globals.CUR_INDEX =
            sameMatchID > -1 ? Globals.CUR_INDEX : Globals.CUR_INDEX + 1;
          highlightMeElem.textContent = match;
          return highlightMeElem;
        },
      )
    ) {
      next.current.click();
      prev.current.click();
      nextOrPrev.current = next.current;
    } else {
      countNum.current.innerHTML = '0';
      countDen.current.innerHTML = '0';
    }
  }
  return (
    <div aria-label={ariaKey} className="BSInputWrapper shadowWrapper">
      <div className="BSInputTopHalf" ref={nonDraggableRefElement}>
        <input
          className="BSMainInputField"
          type="text"
          placeholder="regular expression"
          name="some-key"
          ref={(si) => (searchInput.current = si)}
          onInput={() => {
            handleHighlighting();
            searchInput.current.focus();
          }}
          onFocus={() => {
            document.onkeydown = (e) => {
              if (e.key.toLocaleLowerCase() === 'enter' && e.shiftKey) {
                e.preventDefault();
                prev.current.click();
              } else if (e.key.toLocaleLowerCase() === 'enter') {
                e.preventDefault();
                next.current.click();
              }
            };
          }}
          onBlur={() => {
            if (document.onkeydown != null) {
              document.onkeydown = null;
            }
          }}
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
                  checked={searchType === SearchType.ExactMatch}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSearchType(SearchType.ExactMatch);
                    }
                    handleHighlighting();
                    searchInput.current.focus();
                  }}
                />
                <label htmlFor="BS-exact-match">Exact match</label>
              </div>
              <div className="BSButton BSModifierButton">
                <input
                  className="BSModifierInput"
                  id="BS-is-regex"
                  type="checkbox"
                  checked={searchType === SearchType.RegularExpression}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSearchType(SearchType.RegularExpression);
                    }
                    handleHighlighting();
                    searchInput.current.focus();
                  }}
                />
                <label htmlFor="BS-is-regex">Regular expression</label>
              </div>
              <div className="BSButton BSModifierButton">
                <input
                  className="BSModifierInput"
                  id="BS-levenshtein"
                  type="checkbox"
                  checked={searchType === SearchType.LooseSearch}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSearchType(SearchType.LooseSearch);
                    }
                    handleHighlighting();
                    searchInput.current.focus();
                  }}
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
                  defaultValue={percentMatch}
                  style={{ maxWidth: '70%' }}
                  onInput={(e) => {
                    e.preventDefault();
                    setPercentMatch(
                      Number((e.target as HTMLInputElement).value),
                    );
                  }}
                />
                <span
                  id="BS-levenshtein-slider-value"
                  style={{ float: 'right' }}
                >
                  {percentMatch}
                </span>
              </div>
              <div className="BSButton BSModifierButton">
                <input
                  className="BSModifierInput"
                  id="BS-case-sensitive"
                  type="checkbox"
                  onChange={(e) => setPreserveCase(!e.target.checked)}
                  defaultChecked={preserveCase}
                />
                <label htmlFor="BS-case-sensitive">Case sensitive</label>
              </div>
              <div className="BSButton BSModifierButton">
                <input
                  className="BSModifierInput"
                  id="BS-should-scroll"
                  type="checkbox"
                  defaultChecked={pScroll}
                  onChange={(e) => setPScroll(e.target.checked)}
                />
                <label htmlFor="BS-should-scroll">Auto scroll</label>
              </div>
              <div className="BSButton BSModifierButton BSMaxMatchLimitWrapper">
                <input
                  className="BSModifierInput BSMaxMatchLimit"
                  id="BS-max-matches"
                  type="number"
                  defaultValue={maxLimit}
                  onChange={(e) => setMaxLimit(Number(e.target.value))}
                />
                <div>Maximum matches</div>
              </div>
              <div className="BSButton BSModifierButton BSColorPickerWrapper">
                <input
                  className="BSModifierInput BSColorPicker"
                  id="BS-color-input"
                  type="color"
                  defaultValue={currentColor}
                  onChange={(e) => setCurrentColor(e.target.value)}
                />
                <div>
                  Selection color{' '}
                  <span
                    className="BSButton BSColorFacts"
                    onClick={() => {
                      navigator.clipboard.writeText(currentColor);
                    }}
                  >
                    <span>{currentColor}</span>
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
        <span
          className="BSButton BSActionButton BSPrevButton"
          ref={(ref) => {
            prev.current = ref;
            nonDraggableRefElement(ref);
          }}
          onClick={(e) => {
            e.preventDefault();
            nextOrPrev.current = prev.current;
            const GI = Globals.getGI(key);
            if (Globals.MY_HIGHLIGHTS[GI]) {
              Globals.CURRENT_INDEXES[GI] = nextMatch(
                Globals.MY_HIGHLIGHTS[GI].elements,
                Globals.CURRENT_INDEXES[GI],
                {
                  direction: -1,
                  newStyles: {
                    backgroundColor: 'orange',
                  },
                  oldStyles: {
                    backgroundColor: currentColor,
                  },
                  scrollBehavior: 'smooth',
                  scrollable: pScroll,
                },
              );
              countNum.current.innerHTML = `${Globals.CURRENT_INDEXES[GI] + 1}`;
              countDen.current.innerHTML =
                Globals.MY_HIGHLIGHTS[GI].elements.length;
            }
            searchInput.current.focus();
          }}
        >
          ⇐
        </span>
        <span
          className="BSButton BSActionButton BSNextButton"
          ref={(ref) => {
            next.current = ref;
            nonDraggableRefElement(ref);
          }}
          onClick={(e) => {
            e.preventDefault();
            nextOrPrev.current = next.current;
            const GI = Globals.getGI(key);
            if (Globals.MY_HIGHLIGHTS[GI]) {
              Globals.CURRENT_INDEXES[GI] = nextMatch(
                Globals.MY_HIGHLIGHTS[GI].elements,
                Globals.CURRENT_INDEXES[GI],
                {
                  direction: 1,
                  newStyles: {
                    backgroundColor: 'orange',
                  },
                  oldStyles: {
                    backgroundColor: currentColor,
                  },
                  scrollBehavior: 'smooth',
                  scrollable: pScroll,
                },
              );
              countNum.current.innerHTML = `${Globals.CURRENT_INDEXES[GI] + 1}`;
              countDen.current.innerHTML =
                Globals.MY_HIGHLIGHTS[GI].elements.length;
            }
            searchInput.current.focus();
          }}
        >
          ⇒
        </span>
        <span
          className="BSButton BSActionButton BSDeleteButton"
          ref={nonDraggableRefElement}
          onClick={() => clearHighlight(key)}
        >
          -
        </span>
        <span
          className="BSButton BSActionButton BSCopyButton"
          ref={nonDraggableRefElement}
          onClick={() => {
            const GI = Globals.getGI(key);
            if (Globals.MY_HIGHLIGHTS[GI]) {
              let selection = '';
              Globals.MY_HIGHLIGHTS[GI].elements.forEach((elem: any) => {
                for (let i = 0; i < elem.length; i++) {
                  selection += elem[i].innerText;
                }
                selection += '\n';
              });
              navigator.clipboard.writeText(selection);
            }
            searchInput.current.focus();
          }}
        >
          ⛶
        </span>
        <span
          style={{
            flexGrow: '1',
          }}
        ></span>
        <span className="BSFoundMatches BSActionButton">
          <span
            className="BSMatchNumerator"
            ref={(ref) => (countNum.current = ref)}
          >
            0
          </span>
          /
          <span
            className="BSMatchDenominator"
            ref={(ref) => (countDen.current = ref)}
          >
            0
          </span>
        </span>
      </div>
    </div>
  );
}

function getGroup(defaults: DefaultSettings) {
  const retGroup = {
    autoScroll: true,
    maximumMatches: 100,
    selectionColor: '#FBFF00',
    caseSens: false,
    percentMatch: 0.75,
  };
  switch (defaults.searchType.default) {
    case SearchType.ExactMatch:
      retGroup.autoScroll = defaults.ST0.autoScroll.default;
      retGroup.maximumMatches = defaults.ST0.maximumMatches.default;
      retGroup.selectionColor = defaults.ST0.selectionColor.default;
      retGroup.caseSens = defaults.ST0.caseSens.default;
      return retGroup;
    case SearchType.RegularExpression:
      retGroup.autoScroll = defaults.ST1.autoScroll.default;
      retGroup.maximumMatches = defaults.ST1.maximumMatches.default;
      retGroup.selectionColor = defaults.ST1.selectionColor.default;
      retGroup.caseSens = defaults.ST1.caseSens.default;
      return retGroup;
    case SearchType.LooseSearch:
      retGroup.autoScroll = defaults.ST2.autoScroll.default;
      retGroup.maximumMatches = defaults.ST2.maximumMatches.default;
      retGroup.selectionColor = defaults.ST2.selectionColor.default;
      retGroup.percentMatch = defaults.ST2.percentMatch.default;
      return retGroup;
  }
}
