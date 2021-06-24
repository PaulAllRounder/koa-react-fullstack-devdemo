const db = require('../db');
const {PAYLOAD} = require('../config').authen;

module.exports = async (ctx) => {
	const userId = ctx.request[PAYLOAD].uid;
	const pets = await db.select('*').from('pet').where('ownerid', '=', userId);
	ctx.body = pets;
}
