import { Component, signal, afterNextRender } from '@angular/core';

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  private static readonly E = 'b3NjYXJ1cmVuYXMwNEBnbWFpbC5jb20=';

  protected readonly email = signal('');
  protected copied = false;

  constructor() {
    afterNextRender(() => this.email.set(atob(Contact.E)));
  }

  copyEmail() {
    const addr = this.email();
    if (!addr) return;
    navigator.clipboard.writeText(addr).then(() => {
      this.copied = true;
      setTimeout(() => this.copied = false, 2000);
    });
  }
}
