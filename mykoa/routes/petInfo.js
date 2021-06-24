const db = require('../db');

module.exports = async (ctx) => {
	const pid = parseInt(ctx.params.id);
	const pet = await db.first('pet.id', 'user.username as owner', 'pet.type', 'pet.describe', 'pet.petname', 'pet.age')
		.from('pet')
		.leftJoin('user', {'pet.ownerid': 'user.id'})
		.where({'pet.id': pid});
	ctx.body = pet;
}
