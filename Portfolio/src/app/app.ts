import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NgFor, NgClass } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgFor, NgClass],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Portfolio');

  public openedTabs: string[] = [];
  public activeTab: string = '';

  constructor(private router: Router) {}

  public redirigir(pagina: string) {
    if (!this.openedTabs.includes(pagina)) {
      this.openedTabs.push(pagina);
    }
    this.activeTab = pagina;
    this.router.navigate([`/${pagina}`]);
  }

  public closeTab(pagina: string, event: MouseEvent) {
    event.stopPropagation();
    const index = this.openedTabs.indexOf(pagina);
    this.openedTabs.splice(index, 1);

    if (this.activeTab === pagina) {
      const newActive = this.openedTabs[index - 1] ?? this.openedTabs[0] ?? null;
      this.activeTab = newActive ?? '';
      if (newActive) this.router.navigate([`/${newActive}`]);
      else this.router.navigate(['/']);
    }
  }
}