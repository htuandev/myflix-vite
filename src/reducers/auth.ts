import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Prettify } from '@/types';
import { User } from '@/types/user';

type State = {
  user: Prettify<User> | null;
};

const initialState: State = {
  user: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<State['user']>) {
      state.user = action.payload;
    }
  }
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
