/*
 * Note:
 * 		1.REFEXPIRE must > EXPIRE
 */
module.exports = {
	authen: {
		SECRET: 'mysecret101',
		PAYLOAD: 'jwtPayload',
		THEADER: 'Bearer',
		EXPIRE: 10 * 1,
		REFEXPIRE: 60 * 60 * 2,
	},
	port: {
		HTTPPORT: 5000,
		HTTPSPORT: 5001
	},
};
