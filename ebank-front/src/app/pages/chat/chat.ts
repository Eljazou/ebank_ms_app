import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EbankService } from '../../services/ebank.service';
import { ChatMessage } from '../../models';

@Component({
  selector: 'app-chat',
  imports: [FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class Chat {
  private ebank = inject(EbankService);
  private scroller = viewChild<ElementRef<HTMLDivElement>>('scroller');

  // un identifiant par onglet : le bot garde une mémoire par conversation
  private conversationId = 'web-' + Math.random().toString(36).slice(2, 10);

  messages = signal<ChatMessage[]>([
    { from: 'bot', text: "Bonjour ! Je suis l'assistant ebank. Posez-moi une question sur les clients ou les comptes." }
  ]);
  question = '';
  thinking = signal(false);

  suggestions = [
    'Donne-moi la liste des clients',
    'Quels sont les comptes du client 1 ?',
    'Quel est le solde total des comptes de Hassan ?',
    'Crée un client nommé Sara, email sara@gmail.com'
  ];

  send(text = this.question) {
    const query = text.trim();
    if (!query || this.thinking()) return;

    this.messages.update(m => [...m, { from: 'user', text: query }]);
    this.question = '';
    this.thinking.set(true);
    this.scrollDown();

    this.ebank.chat(query, this.conversationId).subscribe({
      next: answer => this.reply(answer),
      error: () => this.reply("Je n'arrive pas à joindre ebank-bot (port 8058). Vérifie qu'il est démarré.")
    });
  }

  private reply(text: string) {
    this.messages.update(m => [...m, { from: 'bot', text }]);
    this.thinking.set(false);
    this.scrollDown();
  }

  private scrollDown() {
    setTimeout(() => {
      const el = this.scroller()?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }
}
