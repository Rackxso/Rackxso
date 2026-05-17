import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

interface Particle {
  bx: number; by: number;
  x: number; y: number;
  phaseX: number; phaseY: number;
  freqX: number; freqY: number;
  ampX: number; ampY: number;
  r: number;
  color: string;
}

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements AfterViewInit, OnDestroy {
  @ViewChild('plexusCanvas') private canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('mainEl') private mainRef!: ElementRef<HTMLElement>;

  private animId = 0;
  private resizeHandler?: () => void;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private router: Router,
  ) {}

  navigate(page: string) {
    this.router.navigate([`/${page}`]);
  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.initPlexus(this.canvasRef.nativeElement, this.mainRef.nativeElement);
  }

  ngOnDestroy() {
    if (!isPlatformBrowser(this.platformId)) return;
    cancelAnimationFrame(this.animId);
    if (this.resizeHandler) window.removeEventListener('resize', this.resizeHandler);
  }

  private initPlexus(canvas: HTMLCanvasElement, container: HTMLElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0, H = 0;
    const mouse = { x: -9999, y: -9999 };
    let particles: Particle[] = [];
    let t = 0;
    let isDragging = false;

    const N = 400;
    const MAX_DIST = 120;
    const LIGHT_RADIUS_DOTS = 300;
    const LIGHT_RADIUS_LINES = 170;

    let currentLrD = LIGHT_RADIUS_DOTS;
    let currentLrL = LIGHT_RADIUS_LINES;
    let currentBrightness = 0.6;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      W = canvas.width = rect.width * devicePixelRatio;
      H = canvas.height = rect.height * devicePixelRatio;
    };

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const createParticles = () => {
      particles = [];
      for (let i = 0; i < N; i++) {
        const isRed = Math.random() < 0.06;
        particles.push({
          bx: rand(0, W), by: rand(0, H),
          x: 0, y: 0,
          phaseX: rand(0, Math.PI * 2),
          phaseY: rand(0, Math.PI * 2),
          freqX: rand(0.004, 0.012),
          freqY: rand(0.004, 0.012),
          ampX: rand(10, 35) * devicePixelRatio,
          ampY: rand(10, 35) * devicePixelRatio,
          r: rand(1.2, 2.8) * devicePixelRatio,
          color: isRed ? '#e05555' : (Math.random() < 0.5 ? '#6a9cc8' : '#8ab4d4'),
        });
      }
    };

    const distance = (ax: number, ay: number, bx: number, by: number) => {
      const dx = ax - bx, dy = ay - by;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const draw = () => {
      t++;
      ctx.clearRect(0, 0, W, H);

      const lrDTarget = isDragging ? LIGHT_RADIUS_DOTS + 50 : LIGHT_RADIUS_DOTS;
      const lrLTarget = isDragging ? LIGHT_RADIUS_LINES + 50 : LIGHT_RADIUS_LINES;
      const brightnessTarget = isDragging ? 0.8 : 0.6;
      currentLrD += (lrDTarget - currentLrD) * 0.08;
      currentLrL += (lrLTarget - currentLrL) * 0.08;
      currentBrightness += (brightnessTarget - currentBrightness) * 0.08;

      const mx = mouse.x * devicePixelRatio;
      const my = mouse.y * devicePixelRatio;
      const lrD = currentLrD * devicePixelRatio;
      const lrL = currentLrL * devicePixelRatio;
      const maxD = MAX_DIST * devicePixelRatio;

      for (const p of particles) {
        p.x = p.bx + Math.sin(t * p.freqX + p.phaseX) * p.ampX;
        p.y = p.by + Math.cos(t * p.freqY + p.phaseY) * p.ampY;
      }

      const mouseActive = mouse.x > -100;

      if (mouseActive) {
        for (let i = 0; i < particles.length; i++) {
          const a = particles[i];
          const da = distance(a.x, a.y, mx, my);
          if (da > lrL + maxD) continue;

          for (let j = i + 1; j < particles.length; j++) {
            const b = particles[j];
            const d = distance(a.x, a.y, b.x, b.y);
            if (d > maxD) continue;

            const db = distance(b.x, b.y, mx, my);
            const vis = Math.min(Math.max(0, 1 - da / lrL), Math.max(0, 1 - db / lrL));
            if (vis <= 0) continue;

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(100, 160, 210, ${vis * (1 - d / maxD) * currentBrightness})`;
            ctx.lineWidth = devicePixelRatio * 0.7;
            ctx.stroke();
          }
        }

        for (const p of particles) {
          const d = distance(p.x, p.y, mx, my);
          if (d > lrL) continue;
          const vis = 1 - d / lrL;
          ctx.beginPath();
          ctx.moveTo(mx, my);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = `rgba(150, 200, 240, ${vis * 0.4})`;
          ctx.lineWidth = devicePixelRatio * 0.6;
          ctx.stroke();
        }
      }

      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.globalAlpha = mouseActive
          ? Math.max(0.12, 1 - distance(p.x, p.y, mx, my) / lrD)
          : 0.12;
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      ctx.globalAlpha = 1;

      this.animId = requestAnimationFrame(draw);
    };

    // Desktop (mouse)
    container.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    container.addEventListener('mouseleave', () => {
      mouse.x = -9999;
      mouse.y = -9999;
      isDragging = false;
    });
    container.addEventListener('mousedown', () => { isDragging = true; });
    container.addEventListener('mouseup', () => { isDragging = false; });

    // Mobile (touch) — passive para no bloquear el scroll
    const getRect = () => canvas.getBoundingClientRect();
    container.addEventListener('touchstart', e => {
      const t = e.touches[0];
      const r = getRect();
      mouse.x = t.clientX - r.left;
      mouse.y = t.clientY - r.top;
      isDragging = true;
    }, { passive: true });
    container.addEventListener('touchmove', e => {
      const t = e.touches[0];
      const r = getRect();
      mouse.x = t.clientX - r.left;
      mouse.y = t.clientY - r.top;
    }, { passive: true });
    container.addEventListener('touchend', () => {
      isDragging = false;
      mouse.x = -9999;
      mouse.y = -9999;
    }, { passive: true });
    container.addEventListener('touchcancel', () => {
      isDragging = false;
      mouse.x = -9999;
      mouse.y = -9999;
    }, { passive: true });

    this.resizeHandler = () => {
      cancelAnimationFrame(this.animId);
      resize();
      createParticles();
      draw();
    };
    window.addEventListener('resize', this.resizeHandler);

    resize();
    createParticles();
    draw();
  }
}
