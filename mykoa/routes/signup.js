/*
 * Generate 2 tokens: 'token' for authen, 'reftoken' for refresh when token expired
 * 'reftoken' set 'notBefore' option, can be only  passed after 'token' expired
 */
const jwt = require('../utilities/jwt');
const bcrypt = require('bcrypt');
const db = require('../db');
const fsPromises = require('fs').promises;
const path = require('path');
const { SECRET, EXPIRE, REFEXPIRE } = require('../config').authen;

const wrongMsg = 'Incorrect username and/or password';

module.exports = async (ctx) => {
	const { username, password} = ctx.request.body;

	if(!username) ctx.throw(422, 'Username required.', {code: 12205});
	if(!password) ctx.throw(422, 'Password required.', {code: 12206});

	const user = await db.first('id', 'passwordHash', 'portraitPath').from('user').where({username});
	if(!user) ctx.throw(401, wrongMsg, {code: 10102});

	if(await bcrypt.compare(password, user.passwordHash)) {
		const fname = user.portraitPath;
		const imme = path.parse(String(fname)).ext.slice(1);
		const [token, reftoken, imgData] = await Promise.all([
			jwt.sign({uid: user.id}, SECRET, {expiresIn: EXPIRE}),
			jwt.sign({uid: user.id}, SECRET, {expiresIn: REFEXPIRE, notBefore: EXPIRE - 10}),
			fname === null ? null : fsPromises.readFile('./upload/' + fname),
		]);
		ctx.body = {
			token, 
			reftoken, 
			username, 
			avatar: imgData=== null ? null : 'data:image/' + imme + ';base64,' + imgData.toString('base64')
		};
	} else {
		ctx.throw(401, wrongMsg, {code: 10102});
	}
}
