/*
 * assign jwt token expired error a uniq error code (10303)
 * front-end use this code to handle token refresh
 *
 * Note: there're 2 tokens:
 * -"token" normal use to get auth, it's set 'expiresIn' prop
 * -"reftoken" when "token" expired, use this token to refresh a new pair of tokens. It's set 'notBefore' prop
 * "token" can't use to refresh, 'cause refresh need 'notBefore' prop;
 * "reftoken" can't use to as normal token, the only usage is refresh
*/
const jwt = require('../utilities/jwt');
const unless = require('koa-unless');
const { SECRET, PAYLOAD, THEADER } = require('../config').authen;

module.exports = ( {
		secret = SECRET,
		payload = PAYLOAD,
		autHeader = THEADER,
		...opts
	}= {}) => {
		async function authJwt(ctx, next) {
			const aut = ctx.headers.authorization;
			if(!aut) ctx.throw(403, 'No token found.', {code: 10301});
			const arrAut = aut.split(' ');
			if(arrAut[0] !== autHeader) ctx.throw(403, 'Authorization header err!', {code: 10302});

			try {
				const decoded = await jwt.verify(arrAut[1], secret, opts);
				//reftoken don't assign payload, it means you CAN'T use reftoken as normal token
				Object.assign(ctx.request, {[payload]: decoded.nbf? null : decoded});
			}
			catch(err) {
				const code = err.name === 'TokenExpiredError'? 10303 : 10310;
				ctx.throw(err.status || 403, err.message, {code});
			}

			await next();
		}
		authJwt.unless = unless;
		return authJwt;
}
