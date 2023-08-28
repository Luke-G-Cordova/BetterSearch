import React from 'react';
import { useState, useEffect, useRef } from 'react';
import {
  clearHighlight,
  highlightExactMatch,
  highlightRegExp,
  highlightLevenshtein,
} from '../../highlight/Highlighter';
import { Globals } from '../../Globals';

enum SearchType {
  ExactMatch,
  RegularExpression,
  LooseSearch,
}

export default function Input() {
  const [preserveCase, setPreserveCase] = useState(false);
  const [searchType, setSearchType] = useState<SearchType>(
    SearchType.ExactMatch,
  );
  const [pScroll, setPScroll] = useState(true);
  const nextOrPrev = useRef<HTMLElement>();
  const [key, setKey] = useState(
    `regex-key-${Math.random().toString(36).substring(2, 5)}`,
  );
  const searchInput = useRef<HTMLInputElement>();

  /**
   * input that determines the color of selections
   */
  const colorInput = useRef<HTMLInputElement>();

  /**
   * the hex code of the current color for the selection
   */
  const [colorFacts, setColorFacts] = useState();

  /**
   * maximum amount of selections at a time
   */
  const [maxLimit, setMaxLimit] = useState(100);

  /**
   * the input that determines maxLimit
   */
  const [maxMatchLimit, setMaxMatchLimit] = useState();

  /**
   * the button to go to the next match in the selection
   */
  const next = useRef<HTMLElement>();

  /**
   * the button to go to the previous match in the selection
   */
  const prev = useRef<HTMLElement>();

  /**
   * the element that represents the numerator to show which match
   * is currently focused
   */
  const countNum = useRef<HTMLElement>();

  /**
   * the element that represents the denominator to show which match
   * is currently focused
   */
  const countDen = useRef<HTMLElement>();

  /**
   * the element that determines preserveCase
   */
  const [caseSensitive, setCaseSensitive] = useState();

  /**
   * the element that determines preserveRegex
   */
  const [isRegex, setIsRegex] = useState();

  /**
   * the element that determines preserveLevenshtein
   */
  const [levenshtein, setLevenshtein] = useState();

  const [levenshteinSlider, setLevenshteinSlider] = useState();

  const [levenshteinSliderValue, setLevenshteinSliderValue] = useState();

  const [percentMatch, setPercentMatch] = useState(1);

  const [exactMatch, setExactMatch] = useState();

  /**
   * the element that determines preserveScroll
   */
  const [shouldScroll, setShouldScroll] = useState();

  /**
   * the element that deletes this
   */
  const [minus, setMinus] = useState();

  const [inputWrapper, setInputWrapper] = useState();

  const [colorCopyButton, setColorCopyButton] = useState();

  const [colorCopyTooltip, setColorCopyTooltip] = useState();

  /**
   * the element that copies the current selection to the clipboard
   */
  const [copy, setCopy] = useState();

  useEffect(() => {
    searchInput.current.focus();
  }, []);

  /**
   * creates a tag to simulate the highlighting
   * @param match the text to store inside the tag
   * @param sameMatchID the id of the current node within the match
   * @param color a color to highlight with
   * @returns an element to insert into the dom
   */
  function createTag(match: string, sameMatchID: number, color: string) {
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
  }

  /**
   *
   * @param searchTerm term to search for
   * @param searchType the type of search
   * @param options
   * @returns boolean indicating if the highlight was carried out successfully
   */
  function highlightMe(
    searchTerm = '',
    searchType: SearchType,
    options: highlightMeOptions = {
      color: '#FFFF00',
      mods: '',
      limit: 1000,
      percentMatch: 0.75,
    },
  ) {
    clearHighlight(key);
    if (searchTerm !== '' && Globals.DEF_REJECTS.indexOf(searchTerm) === -1) {
      options = Object.assign(
        {
          color: '#FFFF00',
          mods: '',
          limit: 1000,
          percentMatch: 0.75,
        },
        options,
      );
      // if GI is not -1 the key exists already
      let GI = Globals.getGI(key);
      Globals.CUR_INDEX = 0;
      if (GI === -1) {
        Globals.ELEM_KEYS.push(key);
        GI = Globals.getGI(key);
        Globals.CURRENT_INDEXES.push(Globals.CUR_INDEX);
      } else {
        Globals.CURRENT_INDEXES[GI] = Globals.CUR_INDEX;
      }

      if (searchType === SearchType.ExactMatch) {
        Globals.MY_HIGHLIGHTS[GI] = highlightExactMatch(
          searchTerm,
          (match, sameMatchID) => createTag(match, sameMatchID, options.color),
          {
            excludes: [
              'better-search-popup-wrapper',
              'better-search-popup-card',
            ],
            limit: options.limit,
            root: document.body,
            mods: preserveCase ? 'i' : '',
          },
        );
      } else if (searchType === SearchType.RegularExpression) {
        let regExp;
        try {
          regExp = new RegExp(searchTerm, `${preserveCase ? 'i' : ''}g`);
        } catch (e) {
          regExp = null;
        }
        if (regExp != null) {
          Globals.MY_HIGHLIGHTS[GI] = highlightRegExp(
            regExp,
            (match, sameMatchID) => {
              return createTag(match, sameMatchID, options.color);
            },
            {
              excludes: ['BS-popup-card'],
              limit: options.limit,
              root: document.body,
            },
          );
        }
      } else if (searchType === SearchType.LooseSearch) {
        Globals.MY_HIGHLIGHTS[GI] = highlightLevenshtein(
          searchTerm,
          (match, sameMatchID) => createTag(match, sameMatchID, options.color),
          {
            excludes: ['BS-popup-card'],
            limit: options.limit,
            root: document.body,
            percentMatch: options.percentMatch,
          },
        );
      }
      return true;
    }
    return false;
  }
  function handleHighlighting() {
    if (
      highlightMe(searchInput.current.value, searchType, {
        color: colorInput.current.value,
        mods: preserveCase ? 'i' : '',
        limit: maxLimit,
        percentMatch: percentMatch,
      })
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
    <>
      <div className="BSInputTopHalf">
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
                  defaultChecked
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
                  ref={(ref) => (colorInput.current = ref)}
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
        <span
          className="BSButton BSActionButton BSPrevButton"
          ref={(ref) => (prev.current = ref)}
        >
          ⇐
        </span>
        <span
          className="BSButton BSActionButton BSNextButton"
          ref={(ref) => (next.current = ref)}
        >
          ⇒
        </span>
        <span className="BSButton BSActionButton BSDeleteButton">-</span>
        <span className="BSButton BSActionButton BSCopyButton">⛶</span>
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
    </>
  );
}

/**
 * pads zeros for proper hex format
 * @param str
 * @param len
 * @returns
 */
function padZero(str: string, len?: number) {
  len = len || 2;
  const zeros = new Array(len).join('0');
  return (zeros + str).slice(-len);
}
/**
 * inverts a color to get a decently contrasting color
 * @param hex a hex value
 * @returns a hex value
 */
function invertColor(hex: string) {
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1);
  }
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error('Invalid HEX color.');
  }
  const r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
    g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
    b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
  return '#' + padZero(r) + padZero(g) + padZero(b);
}
