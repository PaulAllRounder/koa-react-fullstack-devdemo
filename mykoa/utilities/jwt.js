const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const sign = promisify(jwt.sign);

const verify = (token, secret, options = {}) => new Promise((resolve, reject) => {
	jwt.verify(token, secret, options, (err, decoded) => {
		err ? reject(err) : resolve(decoded);
	});
});

const decode = (token, options = {}) => new Promise((res) => {
	const decoded = jwt.decode(token, options);
	res(decoded);
});

module.exports = {
	sign,
	verify,
	decode,
};
