import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { EbankService } from '../../services/ebank.service';
import { BankAccount, Customer } from '../../models';

@Component({
  selector: 'app-dashboard',
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  private ebank = inject(EbankService);

  customers = signal<Customer[]>([]);
  accounts = signal<BankAccount[]>([]);
  loading = signal(true);
  error = signal('');

  totalBalance = computed(() => this.accounts().reduce((sum, a) => sum + a.balance, 0));
  currentCount = computed(() => this.accounts().filter(a => a.type === 'CURRENT-ACCOUNT').length);
  savingCount = computed(() => this.accounts().filter(a => a.type === 'SAVING-ACCOUNT').length);
  currentPercent = computed(() =>
    this.accounts().length ? Math.round((this.currentCount() / this.accounts().length) * 100) : 0);
  latest = computed(() =>
    [...this.accounts()]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5));

  constructor() {
    forkJoin({ customers: this.ebank.getCustomers(), accounts: this.ebank.getAccounts() }).subscribe({
      next: ({ customers, accounts }) => {
        this.customers.set(customers);
        this.accounts.set(accounts);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de joindre les services. Vérifie que le gateway (9999), customer-service et ebank-service sont démarrés.');
        this.loading.set(false);
      }
    });
  }

  customerName(id: number): string {
    return this.customers().find(c => c.id === id)?.name ?? `Client #${id}`;
  }
}
