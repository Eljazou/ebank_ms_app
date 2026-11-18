import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { EbankService } from '../../services/ebank.service';
import { BankAccount, Customer } from '../../models';

@Component({
  selector: 'app-accounts',
  imports: [CurrencyPipe, DatePipe, FormsModule],
  templateUrl: './accounts.html',
  styleUrl: './accounts.css'
})
export class Accounts {
  private ebank = inject(EbankService);

  accounts = signal<BankAccount[]>([]);
  customers = signal<Customer[]>([]);
  loading = signal(true);
  error = signal('');
  success = signal('');

  // filtres
  customerFilter = signal<number | null>(null);
  typeFilter = signal('');

  // détail d'un compte (chargé via GET /bankaccounts/{id}, qui appelle customer-service par Feign)
  selected = signal<BankAccount | null>(null);
  detailLoading = signal(false);

  // formulaire de création
  showForm = signal(false);
  saving = signal(false);
  form = { customerId: null as number | null, type: 'CURRENT-ACCOUNT', balance: 1000 };

  filtered = computed(() =>
    this.accounts().filter(a =>
      (this.customerFilter() === null || a.customerId === this.customerFilter()) &&
      (!this.typeFilter() || a.type === this.typeFilter())));

  filteredTotal = computed(() => this.filtered().reduce((s, a) => s + a.balance, 0));

  constructor() {
    forkJoin({ accounts: this.ebank.getAccounts(), customers: this.ebank.getCustomers() }).subscribe({
      next: ({ accounts, customers }) => {
        this.accounts.set(accounts);
        this.customers.set(customers);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger les comptes. ebank-service, customer-service et le gateway sont-ils démarrés ?');
        this.loading.set(false);
      }
    });
  }

  customerName(id: number): string {
    return this.customers().find(c => c.id === id)?.name ?? `Client #${id}`;
  }

  open(account: BankAccount) {
    this.detailLoading.set(true);
    this.selected.set(account);
    this.ebank.getAccount(account.id).subscribe({
      next: full => { this.selected.set(full); this.detailLoading.set(false); },
      error: () => this.detailLoading.set(false)
    });
  }

  save() {
    if (this.form.customerId === null || this.form.balance < 0) return;
    this.saving.set(true);
    this.ebank.saveAccount({
      customerId: this.form.customerId,
      type: this.form.type,
      balance: this.form.balance
    }).subscribe({
      next: acc => {
        this.accounts.update(list => [acc, ...list]);
        this.success.set(`Compte créé pour ${this.customerName(acc.customerId)}.`);
        this.showForm.set(false);
        this.saving.set(false);
      },
      error: () => {
        this.error.set('La création du compte a échoué.');
        this.saving.set(false);
      }
    });
  }
}
