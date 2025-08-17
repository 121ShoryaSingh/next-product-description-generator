import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  cleanedImage: string | null;
  aiData: any | null;
}
const initialState: AppState = {
  cleanedImage: null,
  aiData: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setCleanedImage: (state, action: PayloadAction<string | null>) => {
      state.cleanedImage = action.payload;
    },
    setAiData: (state, action: PayloadAction<any>) => {
      state.aiData = action.payload;
    },
    cleanAppState: (state) => {
      state.cleanedImage = null;
      state.aiData = null;
    },
  },
});

export const { setCleanedImage, setAiData, cleanAppState } = appSlice.actions;
export default appSlice.reducer;
