import * as pdfjsLib from 'pdfjs-dist';

export const updateTextModel = async (wrapper: HTMLElement, url: string) => {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

  // Loading document and page text content
  const loadingTask = pdfjsLib.getDocument({ url: url });
  const pdfDocument = await loadingTask.promise;
  const pageArr = [];
  const pdfTextContent = [];
  for (let i = 0; i < pdfDocument.numPages; i++) {
    pageArr.push(await pdfDocument.getPage(i + 1));
    const viewport = pageArr[i].getViewport({
      scale: 3.22539,
    });
    console.log(viewport);
    pdfTextContent.push(await pageArr[i].getTextContent());
    pdfjsLib.renderTextLayer({
      textContentSource: pdfTextContent[i],
      container: wrapper,
      viewport: viewport,
      textDivs: [],
      textDivProperties: new WeakMap(),
      textContentItemsStr: [],
      isOffscreenCanvasSupported: true,
    });
  }

  console.log(pdfTextContent);
  // console.log(wrapper);

  pageArr.forEach((page) => page.cleanup());
  return pdfTextContent;
};

export const getText = async (url: string) => {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

  // Loading document and page text content
  const loadingTask = pdfjsLib.getDocument({ url: url });
  const pdfDocument = await loadingTask.promise;
  const pageArr = [];
  const pdfTextContent = [];
  const wrapper = document.createElement('div');
  for (let i = 0; i < pdfDocument.numPages; i++) {
    pageArr.push(await pdfDocument.getPage(i + 1));
    pdfTextContent.push(await pageArr[i].getTextContent());
    pdfjsLib.renderTextLayer({
      textContentSource: pdfTextContent[i],
      container: wrapper,
      viewport: pageArr[0].getViewport(),
      textDivs: [],
    });
  }

  console.log(pdfTextContent);
  console.log(wrapper);

  pageArr.forEach((page) => page.cleanup());
  return pdfTextContent;
};

export const pdfHighlightRegExp = (
  searchTerm: RegExp,
  callback: (match: string, id: number) => HTMLElement,
  options: HighlightOptions = {
    excludes: ['script', 'style', 'iframe', 'canvas', 'noscript'],
    limit: 1000,
    root: document.body,
  },
) => {
  options = Object.assign({ limit: 1000, root: document.body }, options);
};
