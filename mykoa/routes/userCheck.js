const db = require('../db');

module.exports = async (ctx) => {
	const { username } = ctx.request.body;
	const user = await db.first('username').from('user').where({username});
	if(user) ctx.throw(401, 'Username has been registered.', {code: 10101});

	ctx.body = {usercheck: 'OK', username};
}
