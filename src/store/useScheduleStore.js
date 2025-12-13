import { create } from 'zustand';
import dayjs from 'dayjs';
import {
  getMySchedules,
  getTeamSchedules,
  createTeamSchedule,
  deleteSchedule,
} from '../services/scheduleService';

export const useScheduleStore = create((set, get) => ({
  schedules: [],
  loading: false,

  // 개인 일정 불러오기
  fetchMySchedules: async (year, month) => {
    try {
      set({ loading: true });
      const data = await getMySchedules(year, month);

      const mapped = data.map(item => ({
        id: item.id,
        title: item.title,
        start: dayjs(item.startsAt).format('YYYY-MM-DD'),
        end: dayjs(item.endsAt).format('YYYY-MM-DD'),
        location: item.location,
        startsAt: item.startsAt,
        endsAt: item.endsAt,
        description: item.description,
      }));

      set({ schedules: mapped, loading: false });
    } catch (err) {
      set({ loading: false });
      console.log('개인 일정 조회 실패: ', err);
    }
  },

  // 팀 일정 불러오기
  fetchTeamSchedules: async (teamId, year, month) => {
    try {
      set({ loading: true });
      const data = await getTeamSchedules(teamId, year, month);

      const mapped = data.map(item => ({
        id: item.id,
        title: item.title,
        start: dayjs(item.startsAt).format('YYYY-MM-DD'),
        end: dayjs(item.endsAt).format('YYYY-MM-DD'),
        location: item.location,
        startsAt: item.startsAt,
        endsAt: item.endsAt,
        description: item.description,
      }));

      set({ schedules: mapped, loading: false });
    } catch (err) {
      set({ loading: false });
      console.log('팀 일정 조회 실패: ', err);
    }
  },

  // 팀 일정 추가
  addSchedule: async (teamId, payload) => {
    try {
      set({ loading: true });
      const scheduleId = await createTeamSchedule(teamId, payload);

      set(state => ({
        schedules: [
          ...state.schedules,
          {
            id: scheduleId,
            title: payload.title,
            start: dayjs(payload.startsAt).format('YYYY-MM-DD'),
            end: dayjs(payload.endsAt).format('YYYY-MM-DD'),
            location: payload.location,
            startsAt: payload.startsAt,
            endsAt: payload.endsAt,
            description: payload.description,
          },
        ],
        loading: false,
      }));
    } catch (err) {
      set({ loading: false });
      console.log('팀 일정 추가 실패: ', err);
    }
  },

  // 일정 삭제
  removeSchedule: async scheduleId => {
    try {
      set({ loading: true });
      await deleteSchedule(scheduleId);

      set(state => ({
        schedules: state.schedules.filter(s => s.id !== scheduleId),
        loading: false,
      }));
    } catch (err) {
      set({ loading: false });
      console.log('일정 삭제 실패: ', err);
    }
  },
  clearSchedules: () => set({ schedules: [] }),
}));
