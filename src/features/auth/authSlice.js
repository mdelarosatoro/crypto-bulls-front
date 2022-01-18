import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        userId: "",
        email: "",
        name: "",
        lastName: "",
        portfolio: [],
    },
    reducers: {
        login: (state, action) => {
            const userInfo = action.payload;
            console.log(userInfo);

            state.userId = userInfo.userId;
            state.email = userInfo.email;
            state.name = userInfo.name;
            state.lastName = userInfo.lastName;
            state.portfolio = userInfo.portfolio;
        },
        logout: (state, action) => {
            state.userId = '';
            state.email = '';
            state.name = '';
            state.lastName = '';
            state.portfolio = [];
        },
        updatePortfolio: (state, action) => {
            state.portfolio = action.payload;
        }
    }
})

export const { login, logout, updatePortfolio } = authSlice.actions;

export default authSlice.reducer;