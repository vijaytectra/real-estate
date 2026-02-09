import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { Property, Filters, CreatePropertyDTO, ViewMode } from "@/types";
import { propertyService } from "@/services/propertyService";

interface PropertyState {
  properties: Property[];
  currentProperty: Property | null;
  filters: Filters;
  viewMode: ViewMode;
  loading: boolean;
  detailLoading: boolean;
  error: string | null;
}

const initialState: PropertyState = {
  properties: [],
  currentProperty: null,
  filters: {
    search: "",
    city: "",
    config: "",
    budgetMin: 0,
    budgetMax: 200000000,
    possessionPeriod: "",
    status: "",
  },
  viewMode: "grid",
  loading: false,
  detailLoading: false,
  error: null,
};

export const fetchProperties = createAsyncThunk(
  "properties/fetchAll",
  async (filters: Partial<Filters> | undefined, { rejectWithValue }) => {
    try {
      return await propertyService.getAll(filters);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const fetchPropertyById = createAsyncThunk(
  "properties/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const property = await propertyService.getById(id);
      if (!property) throw new Error("Property not found");
      return property;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const fetchSellerProperties = createAsyncThunk(
  "properties/fetchBySeller",
  async (sellerId: string, { rejectWithValue }) => {
    try {
      return await propertyService.getBySellerId(sellerId);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const addProperty = createAsyncThunk(
  "properties/add",
  async (
    data: { dto: CreatePropertyDTO; sellerId: string; sellerName: string; sellerPhone: string },
    { rejectWithValue }
  ) => {
    try {
      return await propertyService.create(data.dto, data.sellerId, data.sellerName, data.sellerPhone);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const updatePropertyStatus = createAsyncThunk(
  "properties/updateStatus",
  async (data: { id: string; status: Property["status"] }, { rejectWithValue }) => {
    try {
      const property = await propertyService.updateStatus(data.id, data.status);
      if (!property) throw new Error("Property not found");
      return property;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

const propertySlice = createSlice({
  name: "properties",
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<Partial<Filters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters(state) {
      state.filters = initialState.filters;
    },
    setViewMode(state, action: PayloadAction<ViewMode>) {
      state.viewMode = action.payload;
    },
    clearCurrentProperty(state) {
      state.currentProperty = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchPropertyById.pending, (state) => {
        state.detailLoading = true;
      })
      .addCase(fetchPropertyById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentProperty = action.payload;
      })
      .addCase(fetchPropertyById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload as string;
      })
      .addCase(addProperty.fulfilled, (state, action) => {
        state.properties = [action.payload, ...state.properties];
      })
      .addCase(updatePropertyStatus.fulfilled, (state, action) => {
        const index = state.properties.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.properties[index] = action.payload;
        }
        if (state.currentProperty?.id === action.payload.id) {
          state.currentProperty = action.payload;
        }
      });
  },
});

export const { setFilters, resetFilters, setViewMode, clearCurrentProperty } = propertySlice.actions;
export default propertySlice.reducer;
