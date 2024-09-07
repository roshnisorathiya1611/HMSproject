import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../../config";
export const getAllDoctorsAction = createAsyncThunk(
  "getAllDoctors",
  async ({ token }) => {
    const data = await fetch(`${BASE_URL}/patient/all-doctors`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    return data.json();
  }
);

export const getAllDepartmentsAction = createAsyncThunk(
  "getAllDepartments",
  async ({ token }) => {
    const data = await fetch(`${BASE_URL}/patient/all-departments`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    return data.json();
  }
);

export const filterDoctors = createAsyncThunk(
  "getFilteredDoctors",
  async ({ name, departmentId, token }) => {
    const data = await fetch(
      `${BASE_URL}/patient/filter-doctors?name=${name}&departmentId=${departmentId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    return data.json();
  }
);

const patientSlice = createSlice({
  name: "patientslice",
  initialState: {
    doctors: [],
    departments: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder.addCase(getAllDoctorsAction.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllDepartmentsAction.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllDoctorsAction.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.success == false) {
        state.error = action.payload.message;
      } else {
        state.doctors = action.payload.doctors;
      }
    });
    builder.addCase(getAllDepartmentsAction.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.success == false) {
        state.error = action.payload.message;
      } else {
        state.departments = action.payload.departments;
      }
    });
    builder.addCase(filterDoctors.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(filterDoctors.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.success == false) {
        state.error = action.payload.message;
      } else {
        state.doctors = action.payload.doctors;
      }
    });
  },
});

export default patientSlice.reducer;
