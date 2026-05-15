import { Component, signal } from '@angular/core';

interface Slide {
  src: string | null;
  caption: string;
  icon?: string;
}

@Component({
  selector: 'app-live-notes',
  imports: [],
  templateUrl: './live-notes.html',
  styleUrl: './live-notes.css',
})
export class LiveNotes {
  slides: Slide[] = [
    { src: 'projects/livenotes-preview.png', caption: 'Vista principal' },
    { src: null, caption: 'Notas con categorías', icon: 'fa-solid fa-note-sticky' },
    { src: null, caption: 'Seguimiento financiero', icon: 'fa-solid fa-chart-line' },
    { src: null, caption: 'Hábitos con rachas', icon: 'fa-solid fa-fire' },
    { src: null, caption: 'Calendario', icon: 'fa-solid fa-calendar-days' },
  ];

  current = signal(0);

  prev() {
    this.current.update(i => (i - 1 + this.slides.length) % this.slides.length);
  }

  next() {
    this.current.update(i => (i + 1) % this.slides.length);
  }

  goTo(index: number) {
    this.current.set(index);
  }
}
