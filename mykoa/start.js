/*
 * start 2 servers for app -- http && https
 * due to koa-sslify, force http server to https
 * so only https server can work
 */
const app = require('./server');
const http = require('http');
const https = require('https');
const {HTTPPORT, HTTPSPORT} = require('./config').port;
const fs = require('fs');
const options = {
	key: fs.readFileSync('./ssl/server.key'),
	cert: fs.readFileSync('./ssl/server.crt')
}

http.createServer(app.callback()).listen(HTTPPORT, () => {
	console.log(`Koa server listening http on port ${HTTPPORT}!`);
});

https.createServer(options, app.callback()).listen(HTTPSPORT, () => {
	console.log(`Koa server listening https on port ${HTTPSPORT}!`);
});
