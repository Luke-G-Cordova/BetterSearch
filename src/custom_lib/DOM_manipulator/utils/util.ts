import { Globals } from '../../Globals';
import {
  clearHighlight,
  highlightExactMatch,
  highlightRegExp,
  highlightLevenshtein,
} from '../../highlight/Highlighter';

export enum SearchType {
  ExactMatch,
  RegularExpression,
  LooseSearch,
}

/**
 *
 * @param searchTerm term to search for
 * @param searchType the type of search
 * @param options
 * @returns boolean indicating if the highlight was carried out successfully
 */
export function highlightMe(
  searchTerm = '',
  searchType: SearchType,
  key: string,
  options: highlightMeOptions = {
    color: '#FFFF00',
    mods: '',
    limit: 1000,
    percentMatch: 0.75,
  },
  createTag: (match: string, sameMatchID: number, color: string) => HTMLElement,
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
          excludes: ['better-search-popup-wrapper', 'better-search-popup-card'],
          limit: options.limit,
          root: document.body,
          mods: options.mods,
        },
      );
    } else if (searchType === SearchType.RegularExpression) {
      let regExp;
      try {
        regExp = new RegExp(searchTerm, `${options.mods}g`);
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
/**
 * rotates to the next match
 * @param elements the array of elements to rotate through
 * @param cIndex the index of the current element in the array
 * @param options
 * @returns the new index of the current element in the array
 */
export function nextMatch(
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
export function invertColor(hex: string) {
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
