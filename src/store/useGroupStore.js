import { create } from 'zustand';
import { getUserGroups } from '../services/groupService';

export const useGroupStore = create(set => ({
  groupList: [],
  loading: false,
  groupImages: {},

  // 전체 그룹 목록 다시 불러오기
  fetchGroups: async () => {
    try {
      set({ loading: true });
      const data = await getUserGroups();
      set({ groupList: data, loading: false });
    } catch (err) {
      set({ loading: false });
      console.log('그룹 목록 조회 실패: ', err);
    }
  },

  addGroup: newGroup =>
    set(state => ({
      groupList: [...state.groupList, newGroup],
    })),

  updateGroupInfo: updatedGroup =>
    set(state => ({
      groupList: state.groupList.map(g =>
        g.id === updatedGroup.id ? updatedGroup : g,
      ),
    })),

  addGroupImage: (teamId, image) =>
    set(state => ({
      groupImages: {
        ...state.groupImages,
        [teamId]: image,
      },
    })),
}));
