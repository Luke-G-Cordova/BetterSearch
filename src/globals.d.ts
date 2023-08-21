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
  name: string;
  type: 'boolean' | 'range' | 'hex' | 'number';
  possible: any[];
  default: any;
  description: string;
  childSettings?: any[];
}

interface SettingGroup {
  autoScroll: Setting;
  maximumMatches: Setting;
  selectionColor: Setting;
}
interface ST0Group extends SettingGroup {
  caseSens: Setting;
}
interface ST1Group extends SettingGroup {
  caseSens: Setting;
}
interface ST2Group extends SettingGroup {
  percentMatch: Setting;
}
interface DefaultSettings {
  searchType: Setting;
  ST0: ST0Group;
  ST1: ST1Group;
  ST2: ST2Group;
}
