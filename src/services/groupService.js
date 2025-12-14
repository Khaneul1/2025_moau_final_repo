import api from '../api/axiosInstance';

export const createGroup = async data => {
  try {
    const payload = {
      name: data.name,
      description: data.description || '',
      duesPeriod: data.duesPeriod || 'MONTHLY',
      duesAmount: data.duesAmount !== undefined ? Number(data.duesAmount) : 0,
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
      inviteCode,
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

export const deleteGroup = async teamId => {
  try {
    const response = await api.delete(`/teams/${teamId}`);
    return response.data;
  } catch (error) {
    console.error('그룹 삭제 api 에러', error);
    throw error;
  }
};

// 그룹원 목록 조회
export const getGroupMembers = async teamId => {
  try {
    const response = await api.get(`/teams/${teamId}/members`);
    return response.data;
  } catch (error) {
    console.error('그룹 멤버 조회 에러:', error);
    throw error;
  }
};

export const kickMember = async (teamId, userId) => {
  try {
    const response = await api.delete(`/teams/${teamId}/members/${userId}`);
    return response.data;
  } catch (error) {
    console.error('멤버 퇴출 실패:', error);
    throw error;
  }
};

export const updateMemberRole = async (teamId, userId, role) => {
  try {
    const response = await api.patch(
      `/teams/${teamId}/owner/members/${userId}/role`,
      {
        role,
      },
    );
    return response.data;
  } catch (error) {
    console.error('멤버 권한 변경 실패:', error);
    throw error;
  }
};

export const transferOwner = async (teamId, newOwnerUserId) => {
  try {
    const response = await api.patch(`/teams/${teamId}/owner/transfer`, {
      newOwnerUserId,
    });
    return response.data;
  } catch (error) {
    console.error('팀장 위임 실패:', error);
    throw error;
  }
};

export const leaveTeam = async teamId => {
  try {
    const response = await api.post(`/teams/${teamId}/members/leave`);
    return response.data;
  } catch (error) {
    console.error('팀 탈퇴 실패:', error);
    throw error;
  }
};

export const getJoinRequests = async teamId => {
  try {
    const response = await api.get(`/teams/join-requests/${teamId}`);
    return response.data;
  } catch (error) {
    console.error('가입 요청 목록 조회 실패:', error);
    throw error;
  }
};

export const approveJoinRequest = async (teamId, requestId) => {
  try {
    const response = await api.post(
      `/teams/join-requests/${teamId}/${requestId}/approve`,
    );
    return response.data;
  } catch (error) {
    console.error('가입 승인 실패:', error);
    throw error;
  }
};

export const rejectJoinRequest = async (teamId, requestId) => {
  try {
    const response = await api.post(
      `/teams/join-requests/${teamId}/${requestId}/reject`,
    );
    return response.data;
  } catch (error) {
    console.error('가입 거절 실패:', error);
    throw error;
  }
};
