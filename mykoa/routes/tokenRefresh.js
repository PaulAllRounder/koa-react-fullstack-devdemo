/*
 * use refresh-token to get new token sets
 * refresh-token has 'nbf(notBefore)' property
 */
const jwt = require('../utilities/jwt');
const { SECRET, EXPIRE, REFEXPIRE } = require('../config').authen;

module.exports = async (ctx) => {
	const refreshToken = ctx.headers.authorization.split(' ')[1];
	const decoded = await jwt.decode(refreshToken);
	if(!decoded.nbf) ctx.throw(403, 'Not refresh token!', {code: 10304});
	//after middleware 'authenticated', refresh-token must be right here; so use it's payload directly instead of query DB 

	const [token, reftoken] = await Promise.all([
		jwt.sign({uid: decoded.uid}, SECRET, {expiresIn: EXPIRE}),
		jwt.sign({uid: decoded.uid}, SECRET, {expiresIn: REFEXPIRE, notBefore: EXPIRE - 10})]);
	ctx.body = {token, reftoken};
}
