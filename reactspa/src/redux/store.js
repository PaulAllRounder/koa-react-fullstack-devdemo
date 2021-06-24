/*
 * Create redux store with RTK configureStore()
*/

import { configureStore } from '@reduxjs/toolkit';
import accountReducer from './accountReducer';
import plistReducer from './plistReducer';

const store = configureStore({
	reducer: {
		account: accountReducer,
		plist: plistReducer,
	}
});

export default store;
