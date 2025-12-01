import { logout } from '@react-native-seoul/kakao-login';
import { create } from 'zustand';

const useAuthStore = create(set => ({
  token: null,
  userName: '',
  useRole: 'USER',

  login: ({ token, name, role = 'USER' }) =>
    set({ token, userName: name, userRole: role }),

  logout: () => set({ token: null, userName: '', userRole: 'USER' }),
}));

export default useAuthStore;
