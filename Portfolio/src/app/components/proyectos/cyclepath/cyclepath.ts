import { Component, signal } from '@angular/core';

interface Slide {
  src: string | null;
  caption: string;
  icon?: string;
}

@Component({
  selector: 'app-cyclepath',
  imports: [],
  templateUrl: './cyclepath.html',
  styleUrl: './cyclepath.css',
})
export class Cyclepath {
  slides: Slide[] = [
    { src: null, caption: 'Mapa interactivo de carriles bici', icon: 'fa-solid fa-map' },
    { src: null, caption: 'Búsqueda de ciudades con autocompletado', icon: 'fa-solid fa-magnifying-glass' },
    { src: null, caption: 'Cálculo de rutas con A*', icon: 'fa-solid fa-route' },
    { src: null, caption: 'Clasificación de carriles por tipo', icon: 'fa-solid fa-layer-group' },
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
