// store/groupStore.js
import { create } from 'zustand';
import groupImg1 from '../assets/groupImg/group1.png';
import groupImg2 from '../assets/groupImg/group2.png';
import groupImg3 from '../assets/groupImg/group3.png';

const initialGroups = [
  {
    id: 1,
    name: '로망',
    description: '창업지원단 소속 창업동아리',
    image: groupImg1,
    ownerId: 101,
    inviteCode: 'ABCDEF',
    createdAt: '2025-12-01T17:16:21.177Z',
    duesPeriod: 'NONE',
    duesAmount: 9007199254740991,
  },
  {
    id: 2,
    name: '구름톤 유니브',
    description: 'Kakao x goorm 연합 동아리',
    image: groupImg2,
    ownerId: 102,
    inviteCode: 'GHIJKL',
    createdAt: '2025-12-01T17:16:21.177Z',
    duesPeriod: 'NONE',
    duesAmount: 9007199254740991,
  },
  {
    id: 3,
    name: '폴라리스',
    description: '창업지원단 소속 개발 창업 동아리',
    image: groupImg3,
    ownerId: 103,
    inviteCode: 'MNOPQR',
    createdAt: '2025-12-01T17:16:21.177Z',
    duesPeriod: 'NONE',
    duesAmount: 9007199254740991,
  },
];

const useGroupStore = create((set, get) => ({
  groups: initialGroups,

  // 그룹 생성
  addGroup: group => set(state => ({ groups: [...state.groups, group] })),

  // 그룹 수정
  updateGroup: (groupId, newData) =>
    set(state => ({
      groups: state.groups.map(g =>
        g.id === groupId ? { ...g, ...newData } : g,
      ),
    })),

  // 그룹 삭제
  removeGroup: groupId =>
    set(state => ({
      groups: state.groups.filter(g => g.id !== groupId),
    })),

  // groupID로 그룹 조회
  getGroupById: groupId => get().groups.find(g => g.groupId === groupId),
}));

export default useGroupStore;
