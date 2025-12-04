import api from '../api/axiosInstance';
const unwrap = res => res?.data?.data ?? res?.data;

const getFilenameFromUri = uri => {
  if (!uri) return `receipt-${Date.now()}.jpg`;
  const parts = uri.split('/');
  const last = parts[parts.length - 1] || `receipt-${Date.now()}.jpg`;
  return last.includes('.') ? last : `${last}.jpg`;
};

const detectMimeType = filename => {
  if (!filename) return 'image/jpeg';
  const lower = filename.toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  return 'image/jpeg';
};

// presigned URL 발급
export const createPresignedUrl = async (teamId, filename) => {
  try {
    const res = await api.post(
      `/teams/${teamId}/accounting/receipts/upload-url`,
      { filename },
    );
    return unwrap(res);
  } catch (err) {
    console.error('Presigned URL 발급 실패:', err);
    throw err;
  }
};

// S3 업로드
export const uploadImageToS3 = async (teamId, fileUri) => {
  if (!fileUri) throw new Error('fileUri is required');

  const filename = getFilenameFromUri(fileUri);
  const mimeType = detectMimeType(filename);

  const { uploadUrl } = await createPresignedUrl(teamId, filename);
  if (!uploadUrl) throw new Error('Presigned URL이 없습니다.');

  const fileResponse = await fetch(fileUri);
  const blob = await fileResponse.blob();

  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': mimeType },
    body: blob,
  });

  if (!uploadRes.ok) throw new Error(`S3 업로드 실패: ${uploadRes.status}`);

  return uploadUrl.split('?')[0]; // 쿼리스트링 제거
};

// 영수증 생성 (ocr 트리거)
export const createReceipt = async (teamId, payload) => {
  try {
    const res = await api.post(`/teams/${teamId}/accounting/receipts`, payload);
    return unwrap(res);
  } catch (err) {
    console.error('영수증 생성 실패:', err);
    throw err;
  }
};

// 영수증 목록 조회
export const getReceipts = async (teamId, status = null) => {
  try {
    const url = status
      ? `/teams/${teamId}/accounting/reviews/receipts?status=${status}`
      : `/teams/${teamId}/accounting/receipts`;
    const res = await api.get(url);
    return unwrap(res);
  } catch (err) {
    console.error('영수증 목록 조회 실패:', err);
    throw err;
  }
};

// 영수증 상세 조회
export const getReceiptDetail = async (teamId, receiptId) => {
  try {
    const res = await api.get(
      `/teams/${teamId}/accounting/receipts/${receiptId}`,
    );
    return unwrap(res);
  } catch (err) {
    console.error('영수증 상세 조회 실패:', err);
    throw err;
  }
};

// 승인 요청
export const requestReview = async (teamId, receiptId, body) => {
  try {
    const res = await api.post(
      `/teams/${teamId}/accounting/receipts/${receiptId}/request-review`,
      body,
    );
    return unwrap(res);
  } catch (err) {
    console.error('영수증 검토 요청 실패:', err);
    throw err;
  }
};

// 관리자 승인
export const approveReceipt = async (teamId, reviewId, body) => {
  try {
    const res = await api.post(
      `/teams/${teamId}/accounting/reviews/receipts/${reviewId}/approve`,
      body,
    );
    return unwrap(res);
  } catch (err) {
    console.error('영수증 승인 실패:', err);
    throw err;
  }
};

// 관리자 거절
export const rejectReceipt = async (teamId, reviewId, reason) => {
  try {
    const res = await api.post(
      `/teams/${teamId}/accounting/reviews/receipts/${reviewId}/reject`,
      { reason },
    );
    return unwrap(res);
  } catch (err) {
    console.error('영수증 거절 실패:', err);
    throw err;
  }
};
