import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import botsReducer from './slices/botsSlice';
import tasksReducer from './slices/tasksSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    bots: botsReducer,
    tasks: tasksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
