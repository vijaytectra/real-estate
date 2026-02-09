import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { User, UserRole } from "@/types";
import { authService } from "@/services/authService";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const stored = localStorage.getItem("propvista_user");
const initialUser = stored ? (JSON.parse(stored) as User) : null;

const initialState: AuthState = {
  user: initialUser,
  isAuthenticated: !!initialUser,
  loading: false,
  error: null,
};

export const loginWithGoogle = createAsyncThunk(
  "auth/loginWithGoogle",
  async (email: string, { rejectWithValue }) => {
    try {
      const user = await authService.loginWithGoogle(email);
      if (!user) throw new Error("User not found. Please register first.");
      localStorage.setItem("propvista_user", JSON.stringify(user));
      return user;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (
    data: { name: string; email: string; role: UserRole; phone: string; registrationPaid?: boolean },
    { rejectWithValue }
  ) => {
    try {
      const user = await authService.register(
        data.name,
        data.email,
        data.role,
        data.phone,
        data.registrationPaid
      );
      localStorage.setItem("propvista_user", JSON.stringify(user));
      return user;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const toggleFavorite = createAsyncThunk(
  "auth/toggleFavorite",
  async (propertyId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      if (!state.auth.user) throw new Error("Not logged in");
      const favorites = await authService.toggleFavorite(state.auth.user.id, propertyId);
      return favorites;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("propvista_user");
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        if (state.user) {
          state.user.favorites = action.payload;
          localStorage.setItem("propvista_user", JSON.stringify(state.user));
        }
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
