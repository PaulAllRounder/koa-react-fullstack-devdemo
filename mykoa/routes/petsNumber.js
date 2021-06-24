const db = require('../db');

module.exports = async (ctx) => {
	const num = await db.count('* as number').from('pet');
	ctx.body = num[0];
}
