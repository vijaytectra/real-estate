import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Review } from "@/types";
import { reviewService } from "@/services/reviewService";

interface ReviewState {
  reviews: Review[];
  loading: boolean;
  error: string | null;
}

const initialState: ReviewState = {
  reviews: [],
  loading: false,
  error: null,
};

export const fetchPropertyReviews = createAsyncThunk(
  "reviews/fetchByProperty",
  async (propertyId: string, { rejectWithValue }) => {
    try {
      return await reviewService.getByPropertyId(propertyId);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const addReview = createAsyncThunk(
  "reviews/add",
  async (
    data: {
      propertyId: string;
      userId: string;
      userName: string;
      rating: number;
      comment: string;
    },
    { rejectWithValue }
  ) => {
    try {
      return await reviewService.create(data);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    clearReviews(state) {
      state.reviews = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPropertyReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPropertyReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchPropertyReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.reviews = [action.payload, ...state.reviews];
      });
  },
});

export const { clearReviews } = reviewSlice.actions;
export default reviewSlice.reducer;
