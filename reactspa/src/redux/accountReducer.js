/*
 * A account redux 'slice' by RTK
 * Include AsyncThunk actions by using default thunk middleware
*/

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../utilities/myAxios';

const signIn = createAsyncThunk(
	'account/signIn',
	async ({username, password, isReload = true}, thunkAPI) => {
		//isReload seperate "refresh" or "jump to main"
		const response = await axiosInstance.post('signup', { username, password });
		const {token, reftoken} = response.data;
		window.localStorage.setItem('token', token);
		window.localStorage.setItem('reftoken', reftoken);
		response.data.isReload = isReload;
		return response.data;
	},
);

//If no logOut but just close tab, next time will auto signIn
const autoSignIn = createAsyncThunk(
	'account/autoSignIn',
	async (caret, thunkAPI) => {
		const response = await axiosInstance.get('profile');
		return response.data;
	},
);

const accountSlice = createSlice({
	name: 'account',
	initialState: {
		username: null,
		avatar: null,
	},
	reducers: {
		signOut(state) {
			state.username = null;
			state.avatar = null;
			window.localStorage.removeItem('token');
			window.localStorage.removeItem('reftoken');
			window.location.href = '/main/index';
		},
		normalLogin(state, action) {
			state.username = action.payload.username;
			state.avatar = action.payload.avatar;
		}
	},
	extraReducers: {
		[signIn.fulfilled](state, action) {
			state.username = action.payload.username;
			state.avatar = action.payload.avatar;
			if(action.payload.isReload) {
				window.location.reload();
			}
		},
		[autoSignIn.fulfilled](state, action) {
			const {username, avatar} = action.payload;
			if(username && username !== null) {
				state.username = username;
				state.avatar = avatar;
			}
		}
	}
});

const { actions, reducer } = accountSlice;
export const { normalLogin, signOut } = actions;
export { signIn, autoSignIn };
export default reducer;
