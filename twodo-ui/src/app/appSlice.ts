import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { login, logout, register } from "./userAPI";

export interface AppState {
  status: "idle" | "loading" | "error";
}

const initialAppState: AppState = {
  status: "idle",
};

interface LoginRequestParams {
  username: string;
  password: string;
}

export const loginThunk = createAsyncThunk(
  "app/login",
  async (params: LoginRequestParams) => {
    return await login(params.username, params.password);
  }
);

export const logoutThunk = createAsyncThunk(
  "app/logout",
  async () => {
    return await logout();
  }
);

export const registerThunk = createAsyncThunk(
  "app/register",
  async (params: LoginRequestParams) => {
    return await register(params.username, params.password);
  }
);

export const appSlice = createSlice({
  name: "app",
  initialState: initialAppState,
  reducers: {
    clean: () => {
      return initialAppState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginThunk.fulfilled, (state) => {
        state.status = "idle";
      })
      .addCase(loginThunk.rejected, (state) => {
        state.status = "error";
      })
      .addCase(registerThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerThunk.fulfilled, (state) => {
        state.status = "idle";
      })
      .addCase(registerThunk.rejected, (state) => {
        state.status = "error";
      });
  },
});

export const { clean } = appSlice.actions;

export default appSlice.reducer;
