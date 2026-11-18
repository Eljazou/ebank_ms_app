import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EbankService } from '../../services/ebank.service';
import { Customer } from '../../models';

@Component({
  selector: 'app-customers',
  imports: [FormsModule],
  templateUrl: './customers.html',
  styleUrl: './customers.css'
})
export class Customers {
  private ebank = inject(EbankService);

  customers = signal<Customer[]>([]);
  search = signal('');
  loading = signal(true);
  error = signal('');
  success = signal('');
  showForm = signal(false);
  saving = signal(false);

  newName = '';
  newEmail = '';

  filtered = computed(() => {
    const q = this.search().toLowerCase().trim();
    return this.customers().filter(c =>
      !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
  });

  constructor() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.ebank.getCustomers().subscribe({
      next: data => { this.customers.set(data); this.loading.set(false); this.error.set(''); },
      error: () => {
        this.error.set('Impossible de charger les clients. customer-service et le gateway sont-ils démarrés ?');
        this.loading.set(false);
      }
    });
  }

  save() {
    if (!this.newName.trim() || !this.newEmail.trim()) return;
    this.saving.set(true);
    this.ebank.saveCustomer({ name: this.newName.trim(), email: this.newEmail.trim() }).subscribe({
      next: c => {
        this.customers.update(list => [...list, c]);
        this.success.set(`Client « ${c.name} » ajouté.`);
        this.newName = '';
        this.newEmail = '';
        this.showForm.set(false);
        this.saving.set(false);
      },
      error: () => {
        this.error.set("L'ajout du client a échoué.");
        this.saving.set(false);
      }
    });
  }

  initial(name: string): string {
    return name.charAt(0).toUpperCase();
  }
}
