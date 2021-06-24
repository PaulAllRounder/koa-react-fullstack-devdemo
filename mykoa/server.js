/*
 * spearate server start away for supertest  
 */
const PATH = require('path');
const Koa = require('koa');
const router = require('koa-router')();
const BodyParser = require('koa-body');
const {historyApiFallback} = require('koa2-connect-history-api-fallback');
const staticSpa = require('koa-static');
const SPA_DIR = PATH.join(__dirname , '../reactspa/build');
const {port: {HTTPSPORT}} = require('./config');
const enforceHttps = require('koa-sslify').default;
const cors = require('koa2-cors');

const errHandler = require('./middleware/errHandler');
const authenticated = require('./middleware/authenticated');

const adoptRoute = require('./routes/adopt');
const myPetsRoute = require('./routes/myPets')
const newAccountRoute = require('./routes/newAccount');
const petInfoRoute = require('./routes/petInfo');
const petsRoute = require('./routes/pets');
const petsNumRoute = require('./routes/petsNumber');
const profileRoute = require('./routes/myProfile');
const signupRoute = require('./routes/signup');
const refreshRoute = require('./routes/tokenRefresh');
const usercheckRoute = require('./routes/userCheck');

const bodyParser = BodyParser();
Object.assign(bodyParser, {unless: require('koa-unless')});

const app = new Koa();
const arrExcept = ['/api/signup', '/api/new-account', '/api/user-check'];

app.use(errHandler);
//redundant method, proxy's set at client, CORS is not required
if(process.env.NODE_ENV === 'development') {
	app.use(cors());
}
//only use force-https when production mode
if(process.env.NODE_ENV === 'production') {
	app.use(enforceHttps({port: HTTPSPORT}));
}
app.use(historyApiFallback({whiteList: ['/api'], verbose: false}));
app.use(bodyParser.unless({path: ['/api/new-account']}));
app.use(authenticated().unless(ctx => {
	const path = ctx.path || '';
	if(path.match(/^\/api\//) && !arrExcept.some(n => n === path)) 
		return false;
	return true;
}));

router.get('/api/pets', petsRoute);
router.get('/api/pets/:id', petInfoRoute);
router.get('/api/my-pets', myPetsRoute);
router.get('/api/pets-num', petsNumRoute);
router.get('/api/profile', profileRoute);
router.put('/api/adoption', adoptRoute);
router.post('/api/signup', signupRoute);
router.post('/api/token-refresh', refreshRoute);
router.post('/api/user-check', usercheckRoute);
router.post('/api/new-account', 
	BodyParser({multipart: true, formidable:{uploadDir: './upload',keepExtensions: true}}), 
	newAccountRoute);

app
	.use(router.routes())
	.use(router.allowedMethods());

app.use(staticSpa(SPA_DIR));

if(process.env.NODE_ENV !== 'test') {
	app.on('error', (err, ctx) => {
		console.error('log err:', err.status, err.message, ctx.request);
		
	});
}

module.exports = app;
