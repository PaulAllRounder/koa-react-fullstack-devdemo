/*
 * Only mock, just sendback username & avatar dataUri
*/
const db = require('../db');
const path = require('path');
const fsPromises = require('fs').promises;
const {PAYLOAD} = require('../config').authen;

module.exports = async (ctx) => {
	const id = ctx.request[PAYLOAD].uid;
	const { username, portraitPath } = await db.first('username', 'portraitPath').from('user').where({id});
	const imme = path.parse(String(portraitPath)).ext.slice(1);
	const imgData = portraitPath === null ? null : await fsPromises.readFile('./upload/' + portraitPath);
	ctx.body = {
		username, 
		avatar: imgData === null ? null : `data:image/${imme};base64,${imgData.toString("base64")}`,
	};
}
