import { configureStore } from "@reduxjs/toolkit";
import authReducers from "./slices/authSlice";
import patientReducer from "./slices/patientSlice";

const store = configureStore({
  reducer: { authReducers, patientReducer },
});

export default store;
