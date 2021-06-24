import axios from 'axios';
import loadingCounter from './loadingCounter';

/*
 * I use response interceptors to re-send current request when token expired;
 * Backend only send 2 type of status: 200 for OK, 400 for Bad, 
 * and token expired will be processed as "Bad".
 * For interception's convenince, 400 should be deal as "OK" too.
 * Otherwise "error interception" will be hard to deal with "re-send"
*/

const instance = axios.create({ 
	baseURL: '/api/',
	timeout: 10000,
	validateStatus: (status) => status === 200 || status === 400,
});

//An array for stack requests when reftoken is refreshing
let resQueue = [];
let isRefreshing = false;

instance.interceptors.request.use((config) => {
	//can customed option 'ignoreLoading' to avoid globalLoading hint count
	if(!config.ignoreLoading) {
		loadingCounter.dealCount(1);
	}
	if(config.url.match(/^\/new-account/)){
		config.headers['Content-Type'] = 'multipart/form-data';
	} else{
		config.headers['Content-Type'] = 'application/json';
	}
	if(!isRefreshing) {
		config.headers['authorization'] = 'Bearer ' + window.localStorage.getItem('token');
	}
	return config;
}, (err) => {
	return Promise.reject(err);
});

instance.interceptors.response.use( async (res) => {
	//can customed option 'ignoreLoading' to avoid globalLoading hint count
	if(!res.config.ignoreLoading) {
		loadingCounter.dealCount(-1);
	}

	if(res.status === 400 && res.data.code === 10303){
		const currConfig = res.config;
		if(!isRefreshing) {
			isRefreshing = true;
			try {
				//post /api/token-refresh to get new token/reftoken
				const refreshResponse = await instance({
					method: 'post',
					url: 'token-refresh',
					headers: {
						authorization: `Bearer ${window.localStorage.getItem('reftoken')}`,
					},
				});
				const { token, reftoken } = refreshResponse.data;
				window.localStorage.setItem('token', token);
				window.localStorage.setItem('reftoken', reftoken);
				currConfig.headers['authorization'] = 'Bearer ' + window.localStorage.getItem('token');
				//re-send current request && return the response
				return instance(currConfig);
			} catch (err) {
				//network error, should use redux to set status, hint to re-do
			} finally {
				//Now send the intercepted request that occurred during the refresh period -- just pull && run it
				isRefreshing = false;
				resQueue.forEach((wrapper) => wrapper());
				resQueue = [];
			}
		} else {
			const currToken = res.config.headers.authorization.split(' ')[1];
			if(currToken === window.localStorage.getItem('reftoken')) {
				//now refresh token expired too, remove localStorage, jump to /
				window.localStorage.removeItem('token');
				window.localStorage.removeItem('reftoken');
				isRefreshing = false;
				resQueue = [];
				loadingCounter.dealCount(0);
				window.location.href = '/main/index';
				return;
			}
			//This is a request that occurred during the refresh, and it needs to be intercepted and sent after the refresh.
			return new Promise((resolve) => {
				/*
				 * Push this request in the queue as a function wrapper,
				 * so this request will be pending untill the function wrapper be run.
				*/
				resQueue.push(() => {
					resolve(instance(currConfig));
				}); 
			});
		}
	} else {
		//return normal response
		return res;
	}
}, (err) => {
	return Promise.reject(err);
} );

export default instance;
