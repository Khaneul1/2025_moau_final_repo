import api from '../api/axiosInstance';

export const createGroup = async data => {
  try {
    const payload = {
      name: data.name,
      description: data.description || '',
      image: data.image || null,
    };

    const response = await api.post('/teams', payload);
    return response.data;
  } catch (error) {
    console.error('createGroup api 에러: ', error);
    throw error;
  }
};

export const joinGroupByCode = async inviteCode => {
  try {
    const response = await api.post('/teams/join-requests', {
      invite_code: inviteCode,
    });
    return response.data;
  } catch (error) {
    console.error('joinGroupByCode api 에러: ', error);
    throw error;
  }
};

// 팀 상세 조회
export const getGroup = async teamId => {
  try {
    const response = await api.get(`/teams/${teamId}`);
    return response.data;
  } catch (error) {
    console.error('그룹 정보 조회 에러:', error);
    throw error;
  }
};

// 팀 전체 목록 조회
export const getUserGroups = async () => {
  try {
    const response = await api.get('/teams');
    return response.data;
  } catch (error) {
    console.error('팀 목록 조회 에러: ', error);
    throw error;
  }
};

export const updateGroup = async (teamId, payload) => {
  try {
    const body = {
      name: payload.name,
      description: payload.description,
      duesPeriod: payload.duesPeriod || 'NONE',
      duesAmount: payload.duesAmount || 0,
    };

    const response = await api.put(`/teams/${teamId}`, body);
    return response.data;
  } catch (error) {
    console.error('그룹 수정 api 에러: ', error);
    throw error;
  }
};
