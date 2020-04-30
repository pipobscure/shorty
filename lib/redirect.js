const { URL } = require('url');
const { retrieve } = require('./storage.js');

exports.handleRedirect = async function handleRedirect(request, response) {
  const key = request.pathname.trim().slice(1);

  console.error(`Key: ${key}`);
  try {
    if (!key) throw new Error('no key');
    const data = await retrieve(key);
    response.setHeader('Location', data);
  } catch(err) {
    response.setHeader('Location', request.baseurl);
  } finally {
    response.writeHead(302, 'Redirect');
    response.end();
  }
}