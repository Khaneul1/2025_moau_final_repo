import { create } from 'zustand';
import * as receiptService from '../services/receiptService';

const useReceiptStore = create(set => ({
  receipts: [],
  receiptDetail: null,
  loading: false,
  error: null,

  fetchReceipts: async (teamId, status = null) => {
    set({ loading: true });
    try {
      const data = await receiptService.getReceipts(teamId, status);
      set({ receipts: data.content ?? data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
      console.error('영수증 목록 불러오기 실패:', err);
    }
  },

  fetchReceiptDetail: async (teamId, receiptId) => {
    set({ loading: true });
    try {
      const data = await receiptService.getReceiptDetail(teamId, receiptId);
      set({ receiptDetail: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
      console.error('영수증 상세 불러오기 실패:', err);
    }
  },
  createReceipt: async (teamId, payload) => {
    set({ loading: true });
    try {
      const data = await receiptService.createReceipt(teamId, payload);
      set({ receipts: prev => [...prev, data], loading: false });
      return data;
    } catch (err) {
      set({ error: err.message, loading: false });
      console.error('영수증 생성 실패:', err);
      throw err;
    }
  },
  requestReview: async (teamId, receiptId, body) => {
    set({ loading: true });
    try {
      const data = await receiptService.requestReview(teamId, receiptId, body);
      set({ loading: false });
      return data;
    } catch (err) {
      set({ error: err.message, loading: false });
      console.error('영수증 검토 요청 실패:', err);
      throw err;
    }
  },
  approveReceipt: async (teamId, reviewId, body) => {
    set({ loading: true });
    try {
      const data = await receiptService.approveReceipt(teamId, reviewId, body);
      set({ loading: false });
      return data;
    } catch (err) {
      set({ error: err.message, loading: false });
      console.error('영수증 승인 실패:', err);
      throw err;
    }
  },
  rejectReceipt: async (teamId, reviewId, reason) => {
    set({ loading: true });
    try {
      const data = await receiptService.rejectReceipt(teamId, reviewId, reason);
      set({ loading: false });
      return data;
    } catch (err) {
      set({ error: err.message, loading: false });
      console.error('영수증 거절 실패:', err);
      throw err;
    }
  },
}));

export default useReceiptStore;
