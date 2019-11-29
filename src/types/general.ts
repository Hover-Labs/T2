import { StoreType } from 'conseiljs';
export interface Node {
  displayName: string;
  platform: string;
  network: string;
  tezosUrl: string;
  conseilUrl: string;
  apiKey: string;
}

export interface Path {
  label: string;
  derivation: string;
}

export interface NodeStatus {
  tezos: number;
  conseil: number;
}

export interface Account {
  account_id: string;
  balance: number;
  block_id: string;
  counter: number;
  delegate_setable: boolean;
  delegate_value: string;
  manager: string;
  script: string;
  spendable: boolean;
  transactions: any[];
  activeTab: string;
  status: string;
  operations: any; // todo type
  order: number;
  publicKey: string; // todo identity.publicKey
  privateKey: string;
}

export interface Identity {
  balance: number;
  accounts: Account[];
  publicKeyHash: string;
  publicKey: string;
  privateKey: string;
  operations: any;
  order: number;
  storeType: StoreType;
  activeTab: string;
  status: string;
  transactions: any[]; // todo transaction type
  delegate_value: string;
}