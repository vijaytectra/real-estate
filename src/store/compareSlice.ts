import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CompareState {
  compareIds: string[];
}

const initialState: CompareState = {
  compareIds: [],
};

const compareSlice = createSlice({
  name: "compare",
  initialState,
  reducers: {
    addToCompare(state, action: PayloadAction<string>) {
      if (state.compareIds.length < 3 && !state.compareIds.includes(action.payload)) {
        state.compareIds.push(action.payload);
      }
    },
    removeFromCompare(state, action: PayloadAction<string>) {
      state.compareIds = state.compareIds.filter((id) => id !== action.payload);
    },
    clearCompare(state) {
      state.compareIds = [];
    },
  },
});

export const { addToCompare, removeFromCompare, clearCompare } = compareSlice.actions;
export default compareSlice.reducer;
