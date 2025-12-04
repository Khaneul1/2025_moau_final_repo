import { create } from 'zustand';
import * as accountService from '../services/accountService';

const useAccountStore = create(set => ({
  accounts: [],
  transaction: [],
  loading: false,
  receipts: [],
  receiptDetail: null,
  error: null,

  fetchAccounts: async teamId => {
    set({ loading: true });
    try {
      const data = await accountService.getAccountInfo(teamId);
      set({ accounts: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
      console.error('계좌 정보 불러오기 실패:', err);
    }
  },

  fetchTransactions: async teamId => {
    set({ loading: true });
    try {
      const data = await accountService.getTransactions(teamId);
      set({ transaction: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
      console.error('거래 내역 불러오기 실패:', err);
    }
  },

  registerAccount: async (teamId, accountNumber, bankName) => {
    set({ loading: true });
    try {
      const data = await accountService.registerAccount(
        teamId,
        accountNumber,
        bankName,
      );
      set({ accounts: [data], loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
      console.error('계좌 등록/수정 실패:', err);
    }
  },
}));

export default useAccountStore;
