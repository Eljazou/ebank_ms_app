export interface Customer {
  id: number;
  name: string;
  email: string;
}

export interface BankAccount {
  id: string;
  createdAt: string;
  balance: number;
  type: 'CURRENT-ACCOUNT' | 'SAVING-ACCOUNT' | string;
  customerId: number;
  customer?: Customer | null;
}

export interface ChatMessage {
  from: 'user' | 'bot';
  text: string;
}
