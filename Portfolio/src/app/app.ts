import { Component, signal, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Portfolio');

  public openedTabs: string[] = [];
  public activeTab: string = '';
  public sidebarOpen = false;

  @ViewChild('tabsBar') tabsBar!: ElementRef<HTMLElement>;

  public draggedTab: string | null = null;
  private originalTabs: string[] = [];
  private dropSucceeded = false;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(e => {
        const page = (e as NavigationEnd).urlAfterRedirects.replace('/', '');
        if (!page) return;
        if (!this.openedTabs.includes(page)) this.openedTabs.push(page);
        this.activeTab = page;
      });
  }

  public toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  public redirigir(pagina: string) {
    if (!this.openedTabs.includes(pagina)) {
      this.openedTabs.push(pagina);
    }
    this.activeTab = pagina;
    this.sidebarOpen = false;
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

  public onDragStart(tab: string) {
    this.draggedTab = tab;
    this.originalTabs = [...this.openedTabs];
    this.dropSucceeded = false;
  }

  public onDragOver(event: DragEvent, tab: string) {
    event.preventDefault();
    if (!this.draggedTab || tab === this.draggedTab) return;

    const from = this.openedTabs.indexOf(this.draggedTab);
    const to = this.openedTabs.indexOf(tab);
    if (from === to) return;

    // FLIP: capturar posiciones antes de que Angular mueva el DOM
    const els = Array.from(
      this.tabsBar.nativeElement.querySelectorAll<HTMLElement>('.tab')
    );
    const prevPos = new Map<HTMLElement, number>();
    els.forEach(el => prevPos.set(el, el.getBoundingClientRect().left));

    this.openedTabs.splice(from, 1);
    this.openedTabs.splice(to, 0, this.draggedTab);

    // Después de que Angular actualice el DOM, animar desde posición anterior
    requestAnimationFrame(() => {
      this.tabsBar.nativeElement.querySelectorAll<HTMLElement>('.tab').forEach(el => {
        if (el.classList.contains('dragging')) return;
        const prev = prevPos.get(el);
        if (prev === undefined) return;
        const delta = prev - el.getBoundingClientRect().left;
        if (Math.abs(delta) < 1) return;
        el.style.transition = 'none';
        el.style.transform = `translateX(${delta}px)`;
        requestAnimationFrame(() => {
          el.style.transition = 'transform 0.18s ease';
          el.style.transform = '';
        });
      });
    });
  }

  public onDrop(event: DragEvent) {
    event.preventDefault();
    this.dropSucceeded = true;
    this.draggedTab = null;
  }

  public onDragEnd() {
    if (!this.dropSucceeded) {
      this.openedTabs = [...this.originalTabs];
    }
    this.draggedTab = null;
    this.dropSucceeded = false;
  }
}