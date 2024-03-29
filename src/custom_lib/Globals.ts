/* eslint-disable prefer-const */
export const Globals: GlobalObject = {
  CUR_INDEX: 0,
  ELEM_KEYS: [],
  CURRENT_INDEXES: [],
  MY_HIGHLIGHTS: [],
  DEF_REJECTS: ['\\', ''],
  INPUT_AMT: 0,
  popup: null,
  popupDragger: null,

  /**
   * gets the index of key in Globals.ELEM_KEYS
   * @param key the key signifying which index to return
   * @returns the index of the key in ELEM_KEYS. -1 if not found.
   */
  getGI: (key: string) => Globals.ELEM_KEYS.indexOf(key),
  formWrapper: null,
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'better-search-popup-card': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}
