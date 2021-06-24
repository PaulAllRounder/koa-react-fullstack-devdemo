/*
 * adopt/unadopt one pet per request for simple
 */
const db = require('../db');
const {PAYLOAD} = require('../config').authen;

module.exports = async (ctx) => {
	const {pid} = ctx.request.body;
	if(!pid) ctx.throw(422, 'Pet id required.', {code: 12201});

	let uid = ctx.request[PAYLOAD].uid;
	const {ownerid} = await db.first('ownerid').where('id', '=', pid).from('pet');
	if(ownerid !== null && ownerid !== uid) ctx.throw(422, 'Only your own pet can be unadopted!', {code: 12202});
	
	uid = ownerid === null? uid : null;
	const result = await db('pet').update({ownerid: uid}).where('id', '=', pid).andWhere({ownerid});
	ctx.body = {pid, result};
}
