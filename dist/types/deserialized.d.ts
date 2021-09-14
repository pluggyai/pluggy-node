import { Account, CreditData } from './account';
import { IdentityResponse } from './identity';
import { Investment, InvestmentTransaction } from './investment';
import { CreateItemOptions, Item } from './item';
import { Transaction } from './transaction';
export declare type DeserializedAccount = Omit<Account, 'creditData'> & {
    creditData: Omit<CreditData, 'balanceCloseDate' | 'balanceDueDate'> & {
        balanceCloseDate?: string;
        balanceDueDate?: string;
    };
};
export declare type DeserializedIdentityResponse = Omit<IdentityResponse, 'birthDate'> & {
    birthDate?: string;
};
export declare type DeserializedInvestmentTransaction = Omit<InvestmentTransaction, 'date' | 'tradeDate'> & {
    date: string;
    tradeDate: string;
};
export declare type DeserializedInvestment = Omit<Investment, 'date' | 'dueDate' | 'issueDate' | 'transactions'> & {
    date?: string;
    dueDate?: string;
    issueDate?: string;
    transactions: DeserializedInvestmentTransaction[];
};
export declare type DeserializedItem = CreateItemOptions & Omit<Item, 'createdAt' | 'lastUpdatedAt'> & {
    createdAt: string;
    lastUpdatedAt?: string;
};
export declare type DeserializedTransaction = Omit<Transaction, 'date'> & {
    date: string;
};
