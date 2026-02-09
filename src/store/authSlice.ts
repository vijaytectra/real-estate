import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
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
      // Return a deep copy to avoid shared references with service layer
      const userCopy = JSON.parse(JSON.stringify(user)) as User;
      localStorage.setItem("propvista_user", JSON.stringify(userCopy));
      return userCopy;
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
      const userCopy = JSON.parse(JSON.stringify(user)) as User;
      localStorage.setItem("propvista_user", JSON.stringify(userCopy));
      return userCopy;
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
    toggleFavorite(state, action: PayloadAction<string>) {
      if (!state.user) return;
      const propertyId = action.payload;
      const index = state.user.favorites.indexOf(propertyId);
      if (index === -1) {
        state.user.favorites = [...state.user.favorites, propertyId];
      } else {
        state.user.favorites = state.user.favorites.filter((id) => id !== propertyId);
      }
      localStorage.setItem("propvista_user", JSON.stringify(state.user));
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
      });
  },
});

export const { logout, clearError, toggleFavorite } = authSlice.actions;
export default authSlice.reducer;
