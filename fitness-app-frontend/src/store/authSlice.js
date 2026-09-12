import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState : {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    userId: localStorage.getItem('userId') || null
  },
  reducers: {
    setCredentials: (state, action) => {
      const user = action.payload.user;
      const token = action.payload.token;
      let userId = user?.sub || user?.id || null;

      if (!userId && token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          userId = payload.sub || payload.id || null;
        } catch {
          // ignore token parse error
        }
      }

      state.user = user;
      state.token = token;
      state.userId = userId;

      if (token) localStorage.setItem('token', token);
      if (user) localStorage.setItem('user', JSON.stringify(user));
      if (userId) localStorage.setItem('userId', userId);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.userId = null;
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;