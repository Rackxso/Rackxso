import { Component, Input } from '@angular/core';
import type { SimpleIcon } from 'simple-icons';

export interface CustomIcon {
  path: string;
  title: string;
  viewBox?: string;
}

@Component({
  selector: 'app-si',
  standalone: true,
  template: `
    @if (icon) {
      <svg
        role="img"
        [attr.viewBox]="iconViewBox"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        [attr.aria-label]="icon.title"
      >
        <path [attr.d]="icon.path" />
      </svg>
    }
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
      }
      svg {
        width: 1em;
        height: 1em;
      }
    `,
  ],
})
export class SimpleIconComponent {
  @Input({ required: true }) icon!: SimpleIcon | CustomIcon;

  get iconViewBox(): string {
    return (this.icon as CustomIcon).viewBox ?? '0 0 24 24';
  }
}
