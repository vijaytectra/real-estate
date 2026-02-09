import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Appointment, AppointmentType } from "@/types";
import { appointmentService } from "@/services/appointmentService";

interface AppointmentState {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
}

const initialState: AppointmentState = {
  appointments: [],
  loading: false,
  error: null,
};

export const fetchAllAppointments = createAsyncThunk(
  "appointments/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await appointmentService.getAll();
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const fetchBuyerAppointments = createAsyncThunk(
  "appointments/fetchByBuyer",
  async (buyerId: string, { rejectWithValue }) => {
    try {
      return await appointmentService.getByBuyerId(buyerId);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const fetchSellerAppointments = createAsyncThunk(
  "appointments/fetchBySeller",
  async (sellerId: string, { rejectWithValue }) => {
    try {
      return await appointmentService.getBySellerId(sellerId);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const scheduleAppointment = createAsyncThunk(
  "appointments/schedule",
  async (
    data: {
      propertyId: string;
      propertyName: string;
      buyerId: string;
      buyerName: string;
      buyerEmail: string;
      sellerId: string;
      sellerName: string;
      type: AppointmentType;
      date: string;
      time: string;
      notes?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      return await appointmentService.schedule(data);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const updateAppointmentStatus = createAsyncThunk(
  "appointments/updateStatus",
  async (data: { id: string; status: Appointment["status"] }, { rejectWithValue }) => {
    try {
      const appointment = await appointmentService.updateStatus(data.id, data.status);
      if (!appointment) throw new Error("Appointment not found");
      return appointment;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

const appointmentSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAppointments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchAllAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchBuyerAppointments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBuyerAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchSellerAppointments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSellerAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(scheduleAppointment.fulfilled, (state, action) => {
        state.appointments = [action.payload, ...state.appointments];
      })
      .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
        const index = state.appointments.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
      });
  },
});

export default appointmentSlice.reducer;
