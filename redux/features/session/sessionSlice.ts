import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface User {
  id: string;
  email: string;
}

interface Session {
  user: User;
  expires: string;
}

interface SessionState {
  data: Session | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  error: string | null;
}

const initialState: SessionState = {
  data: null,
  status: 'loading',
  error: null,
};

// Async Thunk for fetching session

export const fetchSession = createAsyncThunk(
  'session/fetchSession',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('api/session', {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch session');
    }
  }
);

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    clearSession: (state) => {
      state.data = null;
      state.status = 'unauthenticated';
      state.error = null;
    },
    setSession: (state, action: PayloadAction<Session>) => {
      state.data = action.payload;
      state.status = 'authenticated';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSession.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSession.fulfilled, (state, action) => {
        if (action.payload && action.payload.user) {
          state.data = action.payload;
          state.status = 'authenticated';
        } else {
          state.data = null;
          state.status = 'unauthenticated';
        }
      })
      .addCase(fetchSession.rejected, (state, action) => {
        state.data = null;
        state.status = 'unauthenticated';
        state.error = action.payload as string;
      });
  },
});

export const { clearSession, setSession } = sessionSlice.actions;
export default sessionSlice.reducer;
