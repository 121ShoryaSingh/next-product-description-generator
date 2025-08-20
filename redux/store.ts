import { configureStore } from '@reduxjs/toolkit';
import appSlice from './features/app/appSlice';
import sessionSlice from './features/session/sessionSlice';

export const store = configureStore({
  reducer: {
    app: appSlice,
    session: sessionSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ['app.aiData'],
        ignoredActions: ['app/setAiData'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
