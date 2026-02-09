import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Notification } from "@/types";
import { generateId } from "@/lib/utils";

interface NotificationState {
  notifications: Notification[];
  emailToggle: boolean;
  smsToggle: boolean;
}

const initialState: NotificationState = {
  notifications: [
    {
      id: "notif-001",
      title: "Welcome to PropVista!",
      message: "Start exploring premium properties across India.",
      type: "system",
      read: false,
      createdAt: new Date().toISOString(),
    },
  ],
  emailToggle: true,
  smsToggle: false,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification(
      state,
      action: PayloadAction<{ title: string; message: string; type: Notification["type"] }>
    ) {
      state.notifications.unshift({
        ...action.payload,
        id: generateId(),
        read: false,
        createdAt: new Date().toISOString(),
      });
    },
    markAsRead(state, action: PayloadAction<string>) {
      const notif = state.notifications.find((n) => n.id === action.payload);
      if (notif) notif.read = true;
    },
    markAllAsRead(state) {
      state.notifications.forEach((n) => (n.read = true));
    },
    toggleEmail(state) {
      state.emailToggle = !state.emailToggle;
    },
    toggleSms(state) {
      state.smsToggle = !state.smsToggle;
    },
  },
});

export const { addNotification, markAsRead, markAllAsRead, toggleEmail, toggleSms } =
  notificationSlice.actions;
export default notificationSlice.reducer;
