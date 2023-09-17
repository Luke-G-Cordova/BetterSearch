interface HighlightOptions {
  excludes: string[];
  limit: number;
  root: HTMLElement;
  mods?: string;
}
interface HighlightLevenshteinOptions {
  excludes: string[];
  limit: number;
  root: HTMLElement;
  percentMatch: number;
}

interface ClosestMatch extends Array<string> {
  input: string;
  size: number;
  percent: number;
  changes: number;
  index: number;
  endIndex: number;
  length: number;
}
interface NodeParts {
  nodeParts: string;
  indexOfNodeThatMatchStartsIn: number;
}
