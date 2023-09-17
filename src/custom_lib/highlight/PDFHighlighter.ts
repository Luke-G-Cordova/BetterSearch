import * as pdfjsLib from 'pdfjs-dist';
import { TextContent } from 'pdfjs-dist/types/src/display/api';
export async function getText(url: string) {
  //https://github.com/wojtekmaj/react-pdf/issues/321#issuecomment-451291757
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

  // Loading document and page text content
  const loadingTask = pdfjsLib.getDocument({ url: url });
  const pdfDocument = await loadingTask.promise;
  const pageArr = [];
  const pdfTextContent = [];
  for (let i = 0; i < pdfDocument.numPages; i++) {
    pageArr.push(await pdfDocument.getPage(i + 1));
    pdfTextContent.push(await pageArr[i].getTextContent());
  }
  console.log(pdfTextContent);
  // Release page resources.
  pageArr.forEach((page) => page.cleanup());
  return pdfTextContent;
}

/**
 * Highlights every found instances that matches the regexp searchTerm on a page of html.
 * This RegExp MUST have a `g` or global tag.
 * @param searchTerm the RegExp containing a `g` or global tag
 * @param callback the tag to replace text node containing the search term with
 * @param options
 * @returns an object containing the amount of selected matches and an array
 *  containing the nodes of each selection
 */
export const highlightRegExpPDF = (
  searchTerm: RegExp,
  callback: (match: string, id: number) => HTMLElement,
  url: string,
  options: HighlightOptions = {
    excludes: ['script', 'style', 'iframe', 'canvas', 'noscript'],
    limit: 1000,
    root: document.body,
  },
) => {
  if (!searchTerm.global) throw 'regex must have a global modifier //g';
  options = Object.assign(
    {
      limit: 1000,
      root: document.body,
    },
    options,
  );
  options.excludes = ['script', 'style', 'iframe', 'canvas', 'noscript'].concat(
    options.excludes,
  );
  return getText(url).then((textContent) => {
    let test: RegExpExecArray | null;
    let test2: RegExpExecArray | null;
    let tag: HTMLElement;
    let amountOfSelectedMatches = 0;
    const nodeList: Node[][] = [];
    const masterStr = textContent
      .map((page) => page.items.map((item) => item.str).join(''))
      .join('');

    while (
      (test = searchTerm.exec(masterStr)) &&
      test[0] !== '' &&
      nodeList.length < options.limit
    ) {
      // store the index of the last match
      const lastRegIndex = searchTerm.lastIndex;
      amountOfSelectedMatches++;

      // find the node index j in curGroupOfNodes that the first match occurs in
      const { nodeParts, indexOfNodeThatMatchStartsIn: j } = getNodeParts(
        test.index,
        textContent,
      );

      searchTerm.lastIndex = 0;

      // try to find the whole match in the node the match first appears in
      test2 = searchTerm.exec(curGroupOfNodes[j].data);

      // if match is in several nodes, test2 == null
      if (test2 == null) {
        // get the string that starts at the found match
        // and ends at the end of the containing nodes text
        const inThisNode = nodeParts.substring(test.index);

        test2 = makeCustomRegExpExecArray(
          inThisNode,
          curGroupOfNodes[j].data.length - inThisNode.length,
          curGroupOfNodes[j].data,
        );

        const nodeGroup = insertOverSeveralNodes(
          test[0].length,
          test2[0],
          curGroupOfNodes,
          j,
          callback,
        );

        nodeList.push(nodeGroup);
      } else {
        // else if the match occurs in only one node

        // create a tag
        tag = callback(test2[0], -1);

        const { insertedNode, insertedText, newNode } = replacePartOfNode(
          curGroupOfNodes[j],
          tag,
          test2.index,
          test2[0].length,
        );

        // push the inserted node to the last group in nodeList
        nodeList.push([insertedNode]);

        // if the match occurred at the beginning of the node, curGroupOfNodes[j].data === ''
        // this means that we did not create a new node, we just replaced one and don't need to increment j
        if (curGroupOfNodes[j].data === '') {
          // if the match occurs across the rest of the node, newNode.data === ''
          // this means that we need to delete newNode from curGroupOfNodes because we added an empty node
          if (newNode.data === '') {
            // delete newNode from curGroupOfNodes and replace it with insertedNodes text
            curGroupOfNodes.splice(j, 1, insertedText);
          } else {
            // insert insertedNodes text into curGroupOfNodes while keeping newNode
            curGroupOfNodes.splice(j, 1, insertedText, newNode);
          }
        } else {
          if (newNode.data === '') {
            curGroupOfNodes.splice(j + 1, 0, insertedText);
          } else {
            curGroupOfNodes.splice(j + 1, 0, insertedText, newNode);
          }
        }
      }
      // replace the current regex match index with the last matches index
      searchTerm.lastIndex = lastRegIndex;
    }
    searchTerm.lastIndex = 0;
    return { amountOfSelectedMatches };
  });
};

/**
 *
 * @param testIndex the index of the found match in the master string
 * @param textContent the group of nodes who's text forms the master string
 * @returns `NodeParts` interface that stores a nodeParts array or the text from each node
 * in the current group of nodes and the index of the node from which the current match was found in
 */
const getNodeParts = (
  testIndex: number,
  textContent: TextContent[],
): NodeParts => {
  let j = 0;
  let nodeParts = '' + textContent[j].data;

  while (testIndex > nodeParts.length - 1) {
    j++;
    nodeParts = nodeParts + textContent[j].data;
  }
  return { nodeParts, indexOfNodeThatMatchStartsIn: j };
};
