import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../utils/axios.js";

const storedUser = JSON.parse(localStorage.getItem("userInfo")) || null;

export const registerUser = createAsyncThunk(
    "user/registerUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/user/", userData);
            const user = response.data.createdUser;
            localStorage.setItem("userInfo", JSON.stringify(user));
            return user;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Registration failed");
        }
    }
);

export const loginUser = createAsyncThunk(
    "user/loginUser",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/user/login", credentials);
            const user = response.data.user;
            localStorage.setItem("userInfo", JSON.stringify(user));
            return user;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Login failed");
        }
    }
);

export const updateUser = createAsyncThunk(
    "user/updateUser",
    async (updateData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put("/user/update-profile", updateData);
            return response.data; 
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Update failed");
        }
    }
);

  

const userSlice = createSlice({
    name: "user",
    initialState: {
        userInfo: storedUser,
        loading: false,
        error: null,
        updateSuccess: false,
    },
    reducers: {
        logoutUser: (state) => {
            state.userInfo = null;
            state.updateSuccess = false;
            state.error = null;
            localStorage.removeItem("userInfo");
        },
        resetUpdateSuccess: (state) => {
            state.updateSuccess = false;
        },
        resetError: (state) => {
            state.error = null; 
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.updateSuccess = false;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                state.updateSuccess = true;
                if (action.payload.user) {
                    state.userInfo = action.payload.user;
                    localStorage.setItem("userInfo", JSON.stringify(state.userInfo));
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.updateSuccess = false;
            })
            
            
    },
});

export const { logoutUser, resetUpdateSuccess,resetError } = userSlice.actions;
export default userSlice.reducer;
