import { CLASS_CUSTOM_EMOJI } from './classes';
import { EmojiButtonOptions } from './types';

import { createElement } from './util';

export function lazyLoadEmoji(
  element: HTMLElement,
  options: EmojiButtonOptions
): void {
  if (!element.dataset.loaded) {
    if (element.dataset.custom) {
      lazyLoadCustomEmoji(element);
    }

    element.dataset.loaded = 'true';
    element.style.opacity = '1';
  }
}

function lazyLoadCustomEmoji(element: HTMLElement): void {
  const img = createElement('img', CLASS_CUSTOM_EMOJI) as HTMLImageElement;

  if (element.dataset.emoji) {
    img.src = element.dataset.emoji;
    element.innerText = '';
    element.appendChild(img);
  }
}
