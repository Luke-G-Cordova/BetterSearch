export const queryShadowSelector = (elem: HTMLElement, selector: string) => {
  const shadow = elem.shadowRoot;
  if (shadow != null) {
    const childNodes = Array.from(shadow.childNodes);
    const parent = childNodes.find((node) => {
      if (
        node instanceof HTMLElement &&
        node.className.includes('shadowWrapper')
      ) {
        return node;
      }
    });
    if (parent instanceof HTMLElement && parent != null) {
      return parent.querySelector(selector);
    }
  }
  return null;
};
