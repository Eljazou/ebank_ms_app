import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BankAccount, Customer } from '../models';

/**
 * Toutes les requêtes passent par /api.
 * Le proxy d'Angular (proxy.conf.json) les envoie ensuite :
 *  - /api/customers    -> gateway :9999 -> customer-service
 *  - /api/bankaccounts -> gateway :9999 -> ebank-service
 *  - /api/chat         -> ebank-bot :8058
 * Comme le navigateur ne parle qu'à localhost:4200, il n'y a pas de problème de CORS.
 */
@Injectable({ providedIn: 'root' })
export class EbankService {
  private http = inject(HttpClient);
  private api = '/api';

  // ---- Clients ----
  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.api}/customers`);
  }

  getCustomer(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.api}/customers/${id}`);
  }

  saveCustomer(customer: { name: string; email: string }): Observable<Customer> {
    return this.http.post<Customer>(`${this.api}/customers`, customer);
  }

  // ---- Comptes ----
  getAccounts(): Observable<BankAccount[]> {
    return this.http.get<BankAccount[]>(`${this.api}/bankaccounts`);
  }

  getAccount(id: string): Observable<BankAccount> {
    return this.http.get<BankAccount>(`${this.api}/bankaccounts/${id}`);
  }

  saveAccount(account: { balance: number; type: string; customerId: number }): Observable<BankAccount> {
    return this.http.post<BankAccount>(`${this.api}/bankaccounts`, account);
  }

  // ---- Assistant IA ----
  chat(query: string, conversationId: string): Observable<string> {
    const params = new HttpParams().set('query', query).set('conversationId', conversationId);
    return this.http.get(`${this.api}/chat`, { params, responseType: 'text' });
  }
}
