import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import propertyReducer from "./propertySlice";
import appointmentReducer from "./appointmentSlice";
import notificationReducer from "./notificationSlice";
import reviewReducer from "./reviewSlice";
import compareReducer from "./compareSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    properties: propertyReducer,
    appointments: appointmentReducer,
    notifications: notificationReducer,
    reviews: reviewReducer,
    compare: compareReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
