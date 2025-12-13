import { create } from 'zustand';
import { getPostList, getPostDetail } from '../services/communityService';

export const useCommunityStore = create((set, get) => ({
  posts: [],
  postDetail: null,
  totalPages: 1,
  loading: false,

  // 게시글 목록 조회
  fetchPosts: async (teamId, page = 0, size = 10) => {
    set({ loading: true });

    try {
      const data = await getPostList(teamId, page, size);
      set({
        posts: data.content,
        totalPages: data.totalPages,
        loading: false,
      });
    } catch (err) {
      set({ loading: false });
      console.error('게시글 불러오기 실패:', err);
    }
  },

  fetchPostDetail: async (teamId, postId) => {
    set({ loading: true });
    try {
      const detail = await getPostDetail(teamId, postId);
      set({
        postDetail: detail,
        loading: false,
      });
    } catch (err) {
      set({ loading: false });
      console.log('게시글 상세 조회 실패: ', err);
    }
  },
}));
