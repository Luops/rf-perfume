import { supabase } from "@/lib/supabase";
import { clearUserDataOnStorage, saveUserDataOnStorage } from "@/lib/utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User } from "@supabase/supabase-js";

export interface AuthState {
  user: User;
  isLogged: boolean
}

const initialState: AuthState = {
  user: {
    app_metadata: { provider: "" },
    aud: "",
    created_at: "",
    id: "",
    user_metadata: {},
  },
  isLogged: false
};

export const fetchLogin = createAsyncThunk(
  "auth/login",
  async (data: { email: string; password: string }) => {
    const response = await supabase.auth.signInWithPassword(data);
    return response.data.user;
  }
);

export const fetchSession = createAsyncThunk("auth/session", async () => {
  const response = await supabase.auth
    .getSession()
    .then((res) => res.data.session?.user);
  return response;
});

export const fetchLogout = createAsyncThunk("auth/logout", async () => {
  await supabase.auth.signOut();
});

export const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchLogin.fulfilled, (state, action) => {
      state.user = action.payload!;
      state.isLogged = true;

      saveUserDataOnStorage(action.payload!)
    });

    builder.addCase(fetchSession.fulfilled, (state, action) => {
      if (action.payload === undefined) {
        state.user = initialState.user;
        state.isLogged = false;
      } else {
        state.user = action.payload!;
        state.isLogged = true;
      }
    });
    builder.addCase(fetchLogout.fulfilled, (state) => {
      state.user = initialState.user;
      state.isLogged = false;

      clearUserDataOnStorage();
    });
  },
});

export default AuthSlice.reducer;
export const {} = AuthSlice.actions;
