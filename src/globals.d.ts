/**
 * used to send data between background.js
 * and the rest of the application
 */
interface communicationInfo {
  from: string;
  subject: string;
}

interface highlightMeOptions {
  color: string;
  mods: string;
  limit: number;
  percentMatch: number;
}

interface nextMatchOptions {
  direction: number;
  newStyles: any;
  oldStyles: any;
  scrollBehavior: 'smooth' | 'auto';
  scrollable: boolean;
}

interface GlobalObject {
  CUR_INDEX: number;
  ELEM_KEYS: string[];
  CURRENT_INDEXES: number[];
  MY_HIGHLIGHTS: any;
  DEF_REJECTS: string[];
  INPUT_AMT: number;
  popup: HTMLElement | null;
  popupDragger: any;
  getGI: (key: string) => number;
  formWrapper: HTMLElement | null;
}

interface Setting {
  continuous: boolean;
  possible: any[];
  default: any;
  description: string;
  childSettings?: any[];
}

interface DefaultSettings {
  searchType: Setting;
  autoScroll: Setting;
  maximumMatches: Setting;
  selectionColor: Setting;
  ST0CaseSens: Setting;
  ST1CaseSens: Setting;
  ST2PercentMatch: Setting;
}
