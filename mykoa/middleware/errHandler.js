/*
 * return 400 for err; customed err code > 10000; 500 for server err 
 */
module.exports = async (ctx, next) => {
	try {
		await next();
	} catch(err) {
		ctx.status = 400;
		ctx.body = {
			code: err.code || 500,
			message: err.message,
		};
		ctx.app.emit('error', err, ctx);
	}
}
