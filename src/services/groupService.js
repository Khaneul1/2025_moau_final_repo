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
