const db = require('../db');
const bcrypt = require('bcrypt');
const path = require('path');
const saltRounds = 10;

module.exports = async (ctx) => {
	const { username, password} = ctx.request.body;
	const selfi = ctx.request.files.portrait;
	const portraitPath = selfi ? path.parse(selfi.path).base : null;

	if(!username) ctx.throw(422, 'Username required.', {code: 12203});
	if(!password) ctx.throw(422, 'Password required.', {code: 12204});

	const user = await db.first('username').from('user').where({username});
	if(user) ctx.throw(401, 'Username has been registered.', {code: 10101});

	const passwordHash = await bcrypt.hash(password, saltRounds);
	await db.insert({username, passwordHash, portraitPath}).into('user');

	ctx.body = {newAccount: 'ok', username};
}
