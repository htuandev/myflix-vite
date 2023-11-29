import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Prettify, IUser } from '@/types';

type State = {
  user: Prettify<IUser> | null;
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
