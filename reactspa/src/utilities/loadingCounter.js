/*
 * Global variable for global loading
 * The axios's interceptions use method 'dealCount' pass variable -- 
 * at request +1 and at response -1 ( 0 for set to zero ).
 * GlobalLoading inject real deal function (through closure) to use the passed variable.
 *
 * Core concept:
 * 1. The object that has been imported multiple times is actually a same copy;
 * 2. Closure
 *
 * Note:
 * This is used for myAxios's interceptions, and hook can't be used on impure functions.
 * That's the reason why I don't use redux.
*/
class LoadingCounter {
	constructor() {
		this._count = 0;
		this._injection = [];
	}

	dealCount(value) {
		if(value === 0) {
			this._count = 0;
		} else {
			this._count += value;
		}
		this._injection.forEach( t => { t(this._count) } );
	}

	inject(fun) {
		this._injection.push(fun);
		return this._injection.length - 1;
	}

	unInject(id) {
		this._injection[id] = null;
	}
}

const loadingCounter = new LoadingCounter();

export default loadingCounter;
