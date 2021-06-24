/*
 * A wraped Fetch inspired by axios
 * Axios is awesome, so I want to reinvent the wheel and wrap the Fetch.
 * I just started and I'll finish it soon.
*/
class InterceptorManager {
	handlers = [];

	use(fulfilled, rejected) {
		this.handlers.push({
			fulfilled, 
			rejected,
		});
		return this.handlers.length - 1;
	}

	eject(id) {
		if(this.handlers[id]) {
			this.handlers[id] = null;
		}
	}
}

class NeatFetch {
	constructor(instanceConfig) {
		this.defaults = instanceConfig;
		this.interceptors = {
			request: new InterceptorManager(), 
			response:  new InterceptorManager(),
		};
	}

	request(url, config={}) {
	}
}

const createInstance = (defaultConfig) => {
	const instance = new NeatFetch(defaultConfig);
	//A wrap function for mock fetch(url, config) interface
	const wrapFunction = (...args) => {
		instance.request.call(wrapFunction, ...args);
	}
	//copy instance properties
	copyProperties(wrapFunction, instance);
	//copy prototype methods
	copyProperties(wrapFunction, NeatFetch.prototype);

	return wrapFunction;
}

const defaults = {
	headers: {
		accept: 'application/json, text/plain, */*',
		method: 'GET',
	}
}

const neatFetch = createInstance(defaults);

neatFetch.create = (instanceConfig) => {
	//Todo: need merge (neatFetch.defaults, instanceConfig)
	return createInstance(instanceConfig);
}

function copyProperties(target, source) {
	const keyException = ['constructor', 'prototype', 'name', 'length'];
  for (let key of Reflect.ownKeys(source)) {
		if(!keyException.includes[key]) {
      let desc = Object.getOwnPropertyDescriptor(source, key);
      Object.defineProperty(target, key, desc);
    }
  }
}
module.exports = {neatFetch, NeatFetch};
