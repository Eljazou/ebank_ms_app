import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Customers } from './pages/customers/customers';
import { Accounts } from './pages/accounts/accounts';
import { Chat } from './pages/chat/chat';

export const routes: Routes = [
  { path: '', component: Dashboard, title: 'ebank · Tableau de bord' },
  { path: 'customers', component: Customers, title: 'ebank · Clients' },
  { path: 'accounts', component: Accounts, title: 'ebank · Comptes' },
  { path: 'chat', component: Chat, title: 'ebank · Assistant' },
  { path: '**', redirectTo: '' }
];
