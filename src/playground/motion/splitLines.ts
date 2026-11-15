/**
 * Splits text into animated line / word span elements while preserving accessible text.
 * The container will have aria-label equal to the original full text,
 * and the child spans will have aria-hidden="true" so screen readers read the sentence naturally.
 */
export interface SplitResult {
  fullText: string;
  words: string[];
}

export function prepareAccessibleSplit(text: string): SplitResult {
  const words = text.trim().split(/\s+/);
  return {
    fullText: text,
    words,
  };
}

/**
 * Helper to split an existing DOM element's text into word spans for scroll reveals.
 */
export function splitElementWords(element: HTMLElement): HTMLElement[] {
  const originalText = element.textContent?.trim() || '';
  if (!originalText) return [];

  element.setAttribute('aria-label', originalText);

  const words = originalText.split(/\s+/);
  element.innerHTML = '';

  const spanElements: HTMLElement[] = [];

  words.forEach((word, index) => {
    const wordSpan = document.createElement('span');
    wordSpan.className = 'pg-split-word';
    wordSpan.setAttribute('aria-hidden', 'true');
    wordSpan.style.display = 'inline-block';
    wordSpan.textContent = word;

    element.appendChild(wordSpan);
    spanElements.push(wordSpan);

    if (index < words.length - 1) {
      const space = document.createTextNode(' ');
      element.appendChild(space);
    }
  });

  return spanElements;
}

