import api from '../api/axiosInstance';

export const getMySchedules = async (year, month) => {
  try {
    const response = await api.get('/schedules/me', {
      params: {
        year,
        month,
      },
    });
    return response.data;
  } catch (error) {
    console.error('내 일정 조회 에러:', error);
    throw error;
  }
};

export const getTeamSchedules = async (teamId, year, month) => {
  try {
    const response = await api.get(`/teams/${teamId}/schedules`, {
      params: {
        year,
        month,
      },
    });
    return response.data;
  } catch (error) {
    console.error('팀 일정 조회 에러:', error);
    throw error;
  }
};

export const createTeamSchedule = async (teamId, payload) => {
  try {
    const body = {
      title: payload.title,
      description: payload.description || '',
      location: payload.location || '',
      startsAt: payload.startsAt,
      endsAt: payload.endsAt,
      isAllDay: payload.isAllDay,
    };

    const response = await api.post(`/teams/${teamId}/schedules`, body);
    return response.data;
  } catch (error) {
    console.error('팀 일정 생성 에러:', error);
    throw error;
  }
};

export const getScheduleDetail = async scheduleId => {
  try {
    const response = await api.get(`/schedules/${scheduleId}`);
    return response.data;
  } catch (error) {
    console.error('일정 상세 조회 에러:', error);
    throw error;
  }
};

export const updateSchedule = async (scheduleId, payload) => {
  try {
    const body = {
      title: payload.title,
      description: payload.description || '',
      location: payload.location || null,
      startsAt: payload.startsAt,
      endsAt: payload.endsAt,
      isAllDay: payload.isAllDay ?? false,
    };

    const response = await api.put(`/schedules/${scheduleId}`, body);
    return response.data;
  } catch (error) {
    console.error('일정 수정 에러:', error);
    throw error;
  }
};

export const deleteSchedule = async scheduleId => {
  try {
    await api.delete(`/schedules/${scheduleId}`);
  } catch (error) {
    console.error('일정 삭제 에러:', error);
    throw error;
  }
};
