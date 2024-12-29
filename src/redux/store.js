// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import moviesReducer from './movies/moviesSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    movies: moviesReducer,
  },
});

export default store;