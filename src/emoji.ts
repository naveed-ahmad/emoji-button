import { TinyEmitter as Emitter } from 'tiny-emitter';

import { EMOJI, HIDE_PREVIEW, SHOW_PREVIEW } from './events';
import { smile } from './icons';
import { save } from './recent';
import { createElement } from './util';

import { CLASS_EMOJI, CLASS_CUSTOM_EMOJI } from './classes';

import { EmojiButtonOptions, EmojiRecord } from './types';

export class Emoji {
  private emojiButton: HTMLElement;

  constructor(
    private emoji: EmojiRecord,
    private showVariants: boolean,
    private showPreview: boolean,
    private events: Emitter,
    private options: EmojiButtonOptions,
    private lazy = true
  ) {}

  render(): HTMLElement {
    this.emojiButton = createElement('button', CLASS_EMOJI);

    let content = this.emoji.emoji;

    if (this.emoji.custom) {
      content = this.lazy
        ? smile
        : `<img class="${CLASS_CUSTOM_EMOJI}" src="${this.emoji.emoji}">`;
    }

    this.emojiButton.innerHTML = content;
    this.emojiButton.tabIndex = -1;

    this.emojiButton.dataset.emoji = this.emoji.emoji;
    this.emojiButton.dataset.short = this.emoji.short;

    if (this.emoji.custom) {
      this.emojiButton.dataset.custom = 'true';
    }
    this.emojiButton.title = this.emoji.name;

    this.emojiButton.addEventListener('focus', () => this.onEmojiHover());
    this.emojiButton.addEventListener('blur', () => this.onEmojiLeave());
    this.emojiButton.addEventListener('click', () => this.onEmojiClick());
    this.emojiButton.addEventListener('mouseover', () => this.onEmojiHover());
    this.emojiButton.addEventListener('mouseout', () => this.onEmojiLeave());

    return this.emojiButton;
  }

  onEmojiClick(): void {
    // TODO move this side effect out of Emoji, make the recent module listen for event
    if (
      (!(this.emoji as EmojiRecord).variations ||
        !this.showVariants ||
        !this.options.showVariants) &&
      this.options.showRecents
    ) {
      save(this.emoji, this.options);
    }

    this.events.emit(EMOJI, {
      emoji: this.emoji,
      showVariants: this.showVariants,
      button: this.emojiButton
    });
  }

  onEmojiHover(): void {
    if (this.showPreview) {
      this.events.emit(SHOW_PREVIEW, this.emoji);
    }
  }

  onEmojiLeave(): void {
    if (this.showPreview) {
      this.events.emit(HIDE_PREVIEW);
    }
  }
}
