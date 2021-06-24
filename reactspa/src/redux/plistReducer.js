/*
 * A pets list redux 'slice' by RTK
 * Include AsyncThunk actions by using default thunk middleware
*/

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../utilities/myAxios';
const COUNT = 10;

const getPetsByPage = createAsyncThunk(
	'plist/getPetsByPage',
	async (pageNum, thunkAPI) => {
		const response = await axiosInstance.get('pets', {
			params:{
				count: COUNT,
				page: pageNum
			}
		});
		return response.data;
	},
);

const updatePetsList = createAsyncThunk(
	'plist/updatePetsList',
	async ({pid, index}, thunkAPI) => {
		const response = await axiosInstance.get(`pets/${pid}`);
		return {owner: response.data.owner, index};
	}
);

const plistSlice = createSlice({
	name: 'plist',
	initialState: {
		authModalOpen: false,
		pets: [],
	},
	reducers: {
		clearPets(state) {
			state.pets = [];
			state.authModalOpen = false;
		},
		setAuthModalOpen(state, action) {
			state.authModalOpen = action.payload;
		}
	},
	extraReducers: {
		[getPetsByPage.fulfilled](state, action) {
			if(action.payload.code && action.payload.code === 10310 ) {
				state.authModalOpen = true;
			} else {
				state.pets= action.payload;
			}
		},
		[updatePetsList.fulfilled](state, action) {
			state.pets[action.payload.index].owner = action.payload.owner;
		}
	}
});

const { actions, reducer } = plistSlice;
export const { clearPets, setAuthModalOpen } = actions;
export { getPetsByPage, updatePetsList };
export default reducer;
