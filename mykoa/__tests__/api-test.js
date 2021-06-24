const app = require('../server');
const request = require('supertest');
const server = app.listen(9900);
const db = require('../db');
const { THEADER } = require('../config').authen;
const testUser = {
	Paul:{username: 'PaulTest1001', password: '1234'},
	Jane:{username: 'JaneTest1001', password: '1234'},
};
let token, reftoken;

afterAll(async () => {
	await server.close();
	await db.delete().from('user')
		.where({username: testUser.Paul.username})
		.orWhere({username: testUser.Jane.username});
	await db.destroy();
});

describe('SPA support', () => {
	test('Successed to get SPA root ("/")', async () => {
		const res = await request(server).get('/');
		expect(res.status).toBe(200);
		expect(res.type).toBe('text/html');
	});
	test('Successed to get other route ("/abc")', async () => {
		const res = await request(server)
			.get('/abc')
			.set('Accept', 'text/html');
		expect(res.status).toBe(200);
		expect(res.type).toBe('text/html');
	});
	test('Failed to get specific file ("/abc/index.html")', async () => {
		const res = await request(server)
			.get('/abc/index.html')
			.set('Accept', 'text/html');
		expect(res.status).toBe(404);
	});
});

describe('Jwt token check', () => {
	test('Failed to get ("/api/pets") when no token', async () => {
		const res = await request(server)
			.get('/api/pets');
		expect(res.status).toBe(400);
		expect(res.body.code).toBe(10301);
	});
	test('Failed to get ("/api/pets") when use wrong token head', async () => {
		const res = await request(server)
			.get('/api/pets')
			.set({authorization: THEADER + 'wrong' + ' randomstr'});
		expect(res.status).toBe(400);
		expect(res.body.code).toBe(10302);
	});
	test('Failed to get ("/api/pets") when use wrong token', async () => {
		const res = await request(server)
			.get('/api/pets')
			.set({authorization: THEADER + ' randomstr'});
		expect(res.status).toBe(400);
		expect(res.body.code).toBe(10310);
	});
});

describe('New account', () => {
	test('account username is required', async () => {
		const res = await request(server)
			.post('/api/new-account')
			.field('uname', 'Paul');
		expect(res.status).toBe(400);
		expect(res.body.code).toBe(12203);
	});
	test('account password is required', async () => {
		const res = await request(server)
			.post('/api/new-account')
			.field('username', 'Paul');
		expect(res.status).toBe(400);
		expect(res.body.code).toBe(12204);
	});
	test('Successed to register a new account: Paul', async () => {
		const res = await request(server)
			.post('/api/new-account')
			.field('username', testUser.Paul.username)
			.field('password', testUser.Paul.password)
			.attach('portrait', './__tests__/res/1001.png');
		expect(res.status).toBe(200);
		expect(res.body.username).toEqual(testUser.Paul.username);
	});

	test('Successed to check username Jane', async () => {
		const res = await request(server)
			.post('/api/user-check')
			.send({username: testUser.Jane.username})
		expect(res.status).toBe(200);
		expect(res.body.usercheck).toBe('OK');
	});
	
	test('Successed to register another new account: Jane', async () => {
		const res = await request(server)
			.post('/api/new-account')
			.field('username', testUser.Jane.username)
			.field('password', testUser.Jane.password);
		expect(res.status).toBe(200);
		expect(res.body.username).toEqual(testUser.Jane.username);
		});

	test('Failed to check username Jane after registered', async () => {
		const res = await request(server)
			.post('/api/user-check')
			.send({username: testUser.Jane.username})
		expect(res.status).toBe(400);
		expect(res.body.code).toBe(10101);
	});

	test('Failed to register account Paul again', async () => {
		const res = await request(server)
			.post('/api/new-account')
			.field('username', testUser.Paul.username)
			.field('password', testUser.Paul.password);
		expect(res.status).toBe(400);
		expect(res.body.code).toBe(10101);
	});
});

describe('Signup & get token, profile', () => {
	test('username is required', async () => {
		const res = await request(server)
			.post('/api/signup')
			.send({password: '1234'});
		expect(res.status).toBe(400);
		expect(res.body.code).toBe(12205);
	});
	test('password is required', async () => {
		const res = await request(server)
			.post('/api/signup')
			.send({username: testUser.Paul.username});
		expect(res.status).toBe(400);
		expect(res.body.code).toBe(12206);
	});
	test('Failed when username is not exist', async () => {
		const res = await request(server)
			.post('/api/signup')
			.send({username: testUser.Paul.username + 'nonExist'})
			.send({password: testUser.Paul.password})
		expect(res.status).toBe(400);
		expect(res.body.code).toBe(10102);
	});
	test('Failed when password is not correct', async () => {
		const res = await request(server)
			.post('/api/signup')
			.send({username: testUser.Paul.username})
			.send({password: testUser.Paul.password + 'wrong'});
		expect(res.status).toBe(400);
		expect(res.body.code).toBe(10102);
	});
	test('Successed to login as Jane & get token', async () => {
		const res = await request(server)
			.post('/api/signup')
			.send({username: testUser.Jane.username})
			.send({password: testUser.Jane.password});
		expect(res.status).toBe(200);
		expect(res.body.avatar).toBe(null);
		token = res.body.token;
	});
	test('Successed to get Jane\'s profile ("/api/profile")', async () => {
		const res = await request(server)
			.get('/api/profile')
			.set({authorization: `${THEADER} ${token}`});
		expect(res.status).toBe(200);
		expect(res.body.avatar).toBeNull();
	});
	test('Successed to login as Paul & get token', async () => {
		const res = await request(server)
			.post('/api/signup')
			.send({username: testUser.Paul.username})
			.send({password: testUser.Paul.password});
		expect(res.status).toBe(200);
		expect(Object.keys(res.body)).toEqual(['token', 'reftoken', 'username', 'avatar']);
		token = res.body.token;
		reftoken = res.body.reftoken;
	});
	test('Successed to get Paul\'s profile ("/api/profile")', async () => {
		const res = await request(server)
			.get('/api/profile')
			.set({authorization: `${THEADER} ${token}`});
		expect(res.status).toBe(200);
		expect(res.body.avatar).toMatch(/^data:image/);
	});
});

describe('Request after get token', () => {
	test('Successed to get pets number ("/api/pets-num")', async () => {
		const res = await request(server)
			.get('/api/pets-num')
			.set({authorization: `${THEADER} ${token}`});
		expect(res.status).toBe(200);
		expect(Object.keys(res.body)).toEqual(['number']);
	});
	test('Successed to get pets summary data ("/api/pets")', async () => {
		const res = await request(server)
			.get('/api/pets')
			.set({authorization: `${THEADER} ${token}`});
		expect(res.status).toBe(200);
		expect(res.body.length).toBe(10);
	});
	test('Successed to get detail data of a pet ("/api/pets/:id")', async () => {
		const res = await request(server)
			.get('/api/pets/30')
			.set({authorization: `${THEADER} ${token}`});
		expect(res.status).toBe(200);
		expect(Object.keys(res.body).length).toBe(6);
	});
	test('Now no adopted pets ("/api/my-pets")', async () => {
		const res = await request(server)
			.get('/api/my-pets')
			.set({authorization: `${THEADER} ${token}`});
		expect(res.status).toBe(200);
		expect(res.body.length).toBe(0);
	});
	test('Failed to adopt a pet when no pid', async () => {
		const res = await request(server)
			.put('/api/adoption')
			.set({authorization: `${THEADER} ${token}`});
		expect(res.status).toBe(400);
		expect(res.body.code).toBe(12201);
	});
	test('Successed to adopt a pet with pid', async () => {
		const res = await request(server)
			.put('/api/adoption')
			.set({authorization: `${THEADER} ${token}`})
			.send({pid: 30});
		expect(res.status).toBe(200);
		expect(res.body).toEqual({pid: 30, result: 1});
	});
	test('Successed to unadopt your own pet', async () => {
		const res = await request(server)
			.put('/api/adoption')
			.set({authorization: `${THEADER} ${token}`})
			.send({pid: 30});
		expect(res.status).toBe(200);
		expect(res.body).toEqual({pid: 30, result: 1});
	});
	test('Failed to adopt a pet who is adopted by other', async () => {
		await db('pet').update({ownerid: 9999}).where({id: 30});
		const res = await request(server)
			.put('/api/adoption')
			.set({authorization: `${THEADER} ${token}`})
			.send({pid: 30});
		expect(res.status).toBe(400);
		expect(res.body.code).toBe(12202);
		await db('pet').update({ownerid: null}).where({id: 30});
	});
});

describe('Token refresh', () => {
	test('Failed to refresh use "token" instead of "reftoken"', async () => {
		const res = await request(server)
			.post('/api/token-refresh')
			.set({authorization: `${THEADER} ${token}`});
		expect(res.status).toBe(400);
		expect(res.body.code).toBe(10304);
		expect(res.body.message).toBe('Not refresh token!');
	});
	test('Successed to refresh use "reftoken"', async () => {
		const res = await request(server)
			.post('/api/token-refresh')
			.set({authorization: `${THEADER} ${reftoken}`});
		expect(res.status).toBe(200);
		expect(Object.keys(res.body)).toEqual(['token', 'reftoken']);
		token = res.body.token;
		reftoken = res.body.reftoken;
	});
	test('Successed to request use new token)', async () => {
		const res = await request(server)
			.get('/api/pets-num')
			.set({authorization: `${THEADER} ${token}`});
		expect(res.status).toBe(200);
		expect(Object.keys(res.body)).toEqual(['number']);
	});
})
