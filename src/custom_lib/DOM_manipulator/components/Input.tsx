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
  const [preserveCase, setPreserveCase] = useState(true);
  const [searchType, setSearchType] = useState<SearchType>(
    SearchType.ExactMatch,
  );
  const [pScroll, setPScroll] = useState(true);
  const nextOrPrev = useRef<HTMLElement>();
  const [key, setKey] = useState(
    `regex-key-${Math.random().toString(36).substring(2, 5)}`,
  );
  const searchInput = useRef<HTMLInputElement>();
  const [currentColor, setCurrentColor] = useState('#FFFF00');
  const [maxLimit, setMaxLimit] = useState(100);
  const next = useRef<HTMLElement>();
  const prev = useRef<HTMLElement>();
  const countNum = useRef<HTMLElement>();
  const countDen = useRef<HTMLElement>();

  const [percentMatch, setPercentMatch] = useState(0.75);

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
        color: currentColor,
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
                  defaultChecked={false}
                />
                <label htmlFor="BS-case-sensitive">Case sensitive</label>
              </div>
              <div className="BSButton BSModifierButton">
                <input
                  className="BSModifierInput"
                  id="BS-should-scroll"
                  type="checkbox"
                  defaultChecked
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
          ref={(ref) => (prev.current = ref)}
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
          ref={(ref) => (next.current = ref)}
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

/**
 * rotates to the next match
 * @param elements the array of elements to rotate through
 * @param cIndex the index of the current element in the array
 * @param options
 * @returns the new index of the current element in the array
 */
function nextMatch(
  elements: [HTMLElement[]],
  cIndex: number,
  options: nextMatchOptions = {
    direction: 1,
    newStyles: {},
    oldStyles: {},
    scrollBehavior: 'smooth',
    scrollable: true,
  },
) {
  const regCurrent = /(^|\s)current(\s|$)/;
  const current = ' current';

  //loop through the old current selection of elements and apply the old styles
  for (const i in elements[cIndex]) {
    if (regCurrent.test(elements[cIndex][i].className)) {
      elements[cIndex][i].className = elements[cIndex][i].className.replace(
        regCurrent,
        '',
      );
      if (options.oldStyles) {
        Object.assign(elements[cIndex][i].style, options.oldStyles);
      }
    }
  }

  //edge detection, wrap if we hit an edge
  if (!elements[cIndex + options.direction]) {
    if (options.direction > 0) {
      cIndex = 0;
    } else {
      cIndex = elements.length - 1;
    }
  } else {
    cIndex += options.direction;
  }
  // loop through the new current selection of elements and apply the new styles
  for (const i in elements[cIndex]) {
    if (!regCurrent.test(elements[cIndex][i].className)) {
      elements[cIndex][i].className += current;
      if (options.newStyles) {
        Object.assign(elements[cIndex][i].style, options.newStyles);
      }
      // scroll to the new current selection so that it is in view
      if (options.scrollable && options.scrollBehavior != null) {
        goto(elements[cIndex][i], options.scrollBehavior);
      }
    }
  }
  return cIndex;
}
/**
 * scrolls to the desired element
 * @param elem a dom element that should be scrolled to view
 * @param scrollBehavior an optional options object
 */
function goto(elem: HTMLElement, scrollBehavior: 'smooth' | 'auto') {
  // scObj is either null or an Object that looks like
  // {
  //      element: dom element - the closest ancestor of elem that can scroll in some direction ,
  //      bScroll: boolean - true if there is only one word for the overflow css style of
  //                  element and it is not 'hidden', 'visible', or '',
  //      xScroll: boolean - true if the overflow-x css style of element is not
  //                  'hidden', 'visible', or '',
  //      yScroll: boolean - true if the overflow-y css style of element is not
  //                  'hidden', 'visible', or ''
  // }
  const scObj = getScrollable(elem);

  const bodyCoords = document.body.getBoundingClientRect();
  const elemCoords = scObj
    ? scObj.element.getBoundingClientRect()
    : elem.getBoundingClientRect();

  // scElem is for if scObj is not null and stores scObj.element
  let scElem;

  // scCoords = elem.getBoundingClientRect() if elemCoords isn't already
  let scCoords = elem.getBoundingClientRect();

  // scElemH = height of scElem
  let scElemH;
  // scElemW = width of scElem
  let scElemW;

  // if there is an ancestor to elem that is scrollable
  // and is not the body, then set relevant variables
  if (scObj) {
    scElem = scObj.element;
    scCoords = elem.getBoundingClientRect();

    scElemH = window.getComputedStyle(scElem, null).getPropertyValue('height');
    scElemH =
      scElemH === ''
        ? scElemH
        : Number(scElemH.substring(0, scElemH.length - 2));

    scElemW = window.getComputedStyle(scElem, null).getPropertyValue('width');
    scElemW =
      scElemW === ''
        ? scElemW
        : Number(scElemW.substring(0, scElemW.length - 2));
  }

  // if the element that should be in view
  // is out of view, scroll to the element
  // TODO: this statement does not account for if
  // TODO: the body can scroll on the x axis yet
  if (elemCoords.top < 0 || elemCoords.bottom > window.innerHeight) {
    window.scroll({
      top: elemCoords.top - bodyCoords.top - window.innerHeight / 2.5,
      behavior: scrollBehavior,
    });
  }

  if (typeof scElemH === 'string' || typeof scElemW === 'string') {
    return;
  }

  // if the element is not in view of its scrollable parent element
  // scroll the parent element so that it is in view.
  // Keep in mind this statement checks if both axises are scrollable
  // according to the scObj.bScroll first and if they are not it then
  // scrolls individually.
  if (scElemH != null && scElemW != null && scElem != null) {
    if (
      !!scObj &&
      !!scObj.bScroll &&
      (scCoords.top < 0 ||
        scCoords.bottom > scElemH + elemCoords.top ||
        scCoords.left < 0 ||
        scCoords.right > scElemW + elemCoords.left)
    ) {
      scElem.scroll({
        top: scCoords.top - elemCoords.top + scElem.scrollTop - scElemH / 2,
        left: scCoords.left - elemCoords.left + scElem.scrollLeft - scElemW / 2,
        behavior: scrollBehavior,
      });
    } else {
      if (
        !!scObj &&
        !!scObj.yBool &&
        (scCoords.top < 0 || scCoords.bottom > scElemH + elemCoords.top)
      ) {
        scElem.scroll({
          top: scCoords.top - elemCoords.top + scElem.scrollTop - scElemH / 2,
          behavior: scrollBehavior,
        });
      }
      if (
        !!scObj &&
        !!scObj.xBool &&
        (scCoords.left < 0 || scCoords.right > scElemW + elemCoords.left)
      ) {
        scElem.scroll({
          left:
            scCoords.left - elemCoords.left + scElem.scrollLeft - scElemW / 2,
          behavior: scrollBehavior,
        });
      }
    }
  }
}

/**
 * @param elem a dom element that could be the child of a scrollable element
 * @returns
 *
 *       elem: HTMLElement - the closest ancestor of elem that can scroll
 *                   in some direction
 *
 *       bScroll: boolean - true if there is only one word for the overflow css style of
 *                   element and it is not 'hidden', 'visible', or '',
 *
 *       xScroll: boolean - true if the overflow-x css style of element is not
 *                   'hidden', 'visible', or '',
 *
 *       yScroll: boolean - true if the overflow-y css style of element is not
 *                   'hidden', 'visible', or ''
 */
function getScrollable(elem: HTMLElement) {
  const noScroll = ['hidden', 'visible', ''];
  while (elem !== document.body) {
    const [xScroll, yScroll] = window
      .getComputedStyle(elem, null)
      .getPropertyValue('overflow')
      .split(' ');
    const bScroll = !!xScroll && noScroll.indexOf(xScroll) === -1 && !yScroll;
    const xBool = !!xScroll && noScroll.indexOf(xScroll) === -1;
    const yBool = !!yScroll && noScroll.indexOf(yScroll) === -1;
    if (xBool || yBool) {
      return {
        element: elem,
        bScroll,
        xBool,
        yBool,
      };
    }
    if (elem.parentElement == null) {
      return null;
    }
    elem = elem.parentElement;
  }
  return null;
}
