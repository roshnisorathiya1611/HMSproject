import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../../config";
// Login Thunk
export const loginAction = createAsyncThunk(
  "login",
  async ({ email, password }) => {
    console.log(email, password);
    const data = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    return data.json();
  }
);

export const signupAction = createAsyncThunk(
  "signup",
  async ({ name, email, password, gender }) => {
    console.log(email, password);
    const data = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, gender, email, password }),
    });
    return data.json();
  }
);

export const updatePasswordAction = createAsyncThunk(
  "updatepassword",
  async ({ currentPassword, newPassword, token }) => {
    console.log(currentPassword, newPassword, token);
    const data = await fetch(`${BASE_URL}/auth/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return data.json();
  }
);

export const updateDetailsAction = createAsyncThunk(
  "updatedetails",
  async ({ phone, about, street, city, state, zip, token }) => {
    const data = await fetch(`${BASE_URL}/auth/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ phone, about, street, city, state, zip }),
    });
    return data.json();
  }
);

export const fetchDetails = createAsyncThunk(
  "getusersdata",
  async ({ token }) => {
    const data = await fetch(`${BASE_URL}/auth/details`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    return data.json();
  }
);

const authSlice = createSlice({
  name: "auth-slice",
  initialState: {
    user: null,
    authloading: false,
    autherror: null,
    loginsuccess: false,
    signupsuccess: false,
  },
  reducers: {
    logout: (state, action) => {
      state.user = null;
      state.authloading = false;
      state.autherror = false;
      state.loginsuccess = false;
      state.signupsuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginAction.pending, (state, action) => {
      state.authloading = true;
      state.autherror = null;
      state.loginsuccess = false;
    });
    builder.addCase(loginAction.fulfilled, (state, action) => {
      state.authloading = false;

      if (action.payload.success) {
        state.user = action.payload.user;

        state.loginsuccess = true;
      } else {
        state.autherror = action.payload.message;
      }
    });
    builder.addCase(signupAction.pending, (state, action) => {
      state.authloading = true;
      state.autherror = null;
      state.signupsuccess = false;
    });
    builder.addCase(signupAction.fulfilled, (state, action) => {
      state.authloading = false;

      if (action.payload.success == false) {
        state.autherror = action.payload.message;
      } else {
        state.signupsuccess = true;
      }
    });
    builder.addCase(updatePasswordAction.pending, (state, action) => {
      state.authloading = true;
      state.autherror = null;
    });
    builder.addCase(updatePasswordAction.fulfilled, (state, action) => {
      state.authloading = false;
      if (action.payload.success == false) {
        state.autherror = action.payload.message;
      } else {
        state.autherror = "Details Updated";
      }
    });
    builder.addCase(updateDetailsAction.pending, (state, action) => {
      state.authloading = true;
      state.autherror = null;
    });
    builder.addCase(updateDetailsAction.fulfilled, (state, action) => {
      state.authloading = false;
      if (action.payload.success == false) {
        state.autherror = action.payload.message;
      } else {
        state.autherror = "Details Updated";
      }
    });

    builder.addCase(fetchDetails.fulfilled, (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload.user,
      };
    });
  },
});

export default authSlice.reducer;

export const { logout } = authSlice.actions;
