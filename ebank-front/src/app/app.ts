import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BOT_LINKS } from './bots.config';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  links = [
    { path: '/', label: 'Tableau de bord', icon: '◧', exact: true },
    { path: '/customers', label: 'Clients', icon: '◉', exact: false },
    { path: '/accounts', label: 'Comptes', icon: '▤', exact: false },
    { path: '/chat', label: 'Assistant IA', icon: '✦', exact: false }
  ];

  bots = BOT_LINKS;
}
