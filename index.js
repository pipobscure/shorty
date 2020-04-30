
const SERVER = 'http://localhost:8080'; //'https://pip.fyi';

const { URL } = require('url');
const { createServer } = require('http');
const { handleIndex } = require('./lib/create.js');
const { handleRedirect } = require('./lib/redirect.js');

const server = createServer(async (request, response)=>{
  try {
    const url = new URL(request.url,`${SERVER}/`);
    request.url = `${url}`;
    request.baseurl = `${ new URL('/', `${SERVER}`) }`;
    request.protocol = url.protocol;
    request.host = url.host;
    request.hostname = url.hostname;
    request.pathname = url.pathname;
    const path = url.pathname.trim().slice(1);
    if (/^[a-f0-9]{6}$/.test(path)) return await handleRedirect(request, response);
    if (!path) return await handleIndex(request, response);
    response.writeHead(404, 'Not Found');
    response.end();
  } catch(err) {
    console.error(err);
    response.writeHead(500, 'Internal Server Error');
    response.end(err.stack || err.message);
  }
});

server.listen(8080);
