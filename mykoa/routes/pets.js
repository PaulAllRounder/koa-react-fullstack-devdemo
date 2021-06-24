const db = require('../db');

module.exports = async (ctx) => {
	const {count = 10, page = 1} = ctx.query;
	const pets = await db.select('pet.id', 'user.username as owner', 'pet.type', 'pet.age')
		.from('pet')
		.leftJoin('user', {'pet.ownerid': 'user.id'})
		.limit(count)
		.offset((page-1) * count);
	ctx.body = pets;
};
