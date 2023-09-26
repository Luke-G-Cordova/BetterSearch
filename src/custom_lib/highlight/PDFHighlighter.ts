import * as pdfjsLib from 'pdfjs-dist';

export const renderPDF = async (
  canvas: HTMLCanvasElement,
  textLayer: HTMLElement,
) => {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;
  const loadingTask = pdfjsLib.getDocument({ url: location.href });
  const pdfDocument = await loadingTask.promise;
  const ctx = canvas.getContext('2d');
  const outputScale = window.devicePixelRatio || 1;
  const page = await pdfDocument.getPage(3);
  const viewport = page.getViewport({ scale: 1 });
  canvas.width = Math.floor(viewport.width * outputScale);
  canvas.height = Math.floor(viewport.height * outputScale);
  canvas.style.width = Math.floor(viewport.width) + 'px';
  canvas.style.height = Math.floor(viewport.height) + 'px';

  textLayer.style.left = canvas.offsetLeft + 'px';
  textLayer.style.top = canvas.offsetTop + 'px';
  textLayer.style.height = canvas.offsetHeight + 'px';
  textLayer.style.width = canvas.offsetWidth + 'px';

  const renderContext = {
    canvasContext: ctx,
    viewport,
  };
  page.render(renderContext);
  const textContent = await page.getTextContent();
  pdfjsLib.renderTextLayer({
    textContentSource: textContent,
    container: textLayer,
    viewport: viewport,
    textDivs: [],
  });
};

export const updateTextModel = async (wrapper: HTMLElement, url: string) => {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

  // Loading document and page text content
  const loadingTask = pdfjsLib.getDocument({ url: url });
  const pdfDocument = await loadingTask.promise;
  for (let i = 0; i < pdfDocument.numPages; i++) {
    const page = await pdfDocument.getPage(i);
    const viewport = page.getViewport({ scale: 1 });
    const textContent = await page.getTextContent();
  }

  // const pageArr = [];
  // const pdfTextContent = [];
  // for (let i = 0; i < pdfDocument.numPages; i++) {
  //   pageArr.push(await pdfDocument.getPage(i + 1));
  //   const viewport = pageArr[i].getViewport({
  //     scale: 3.22539,
  //   });
  //   pdfTextContent.push(await pageArr[i].getTextContent());
  //   pdfjsLib.renderTextLayer({
  //     textContentSource: pdfTextContent[i],
  //     container: wrapper,
  //     viewport: viewport,
  //     textDivs: [],
  //     textDivProperties: new WeakMap(),
  //     textContentItemsStr: [],
  //     isOffscreenCanvasSupported: true,
  //   });
  // }

  // console.log(pdfTextContent);
  // // console.log(wrapper);

  // pageArr.forEach((page) => page.cleanup());
  // return pdfTextContent;
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
