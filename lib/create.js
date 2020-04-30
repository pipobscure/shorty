const { URL } = require('url');
const { promises : fs } = require('fs');
const path = require('path');
const { store } = require('./storage.js');

let template;

exports.handleIndex = async function handleIndex(request, response) {
  const url = new URL(request.url);
  const params = url.searchParams;
  // console.log(params);
  if (params.has('url')) {
    console.log('storing');
    const key = await store(params.get('url'), params.get('key'));
    params.set('key', key);
  }
  template = template || fs.readFile(path.resolve(__dirname, 'template.html'), 'utf-8');
  const html = replace(await template, {
    key: params.get('key') || '',
    link: params.has('key') ? `${ new URL(`/${params.get('key')}`, request.baseurl) }` : '',
    url: params.get('url') || '',
    filled: params.has('key') ? 'filled' : 'unfilled'
  });
  response.writeHead(200, 'OK');
  response.end(html);
  template = undefined;
}

function replace(data, dictionary) {
  for (const key of Object.keys(dictionary)) {
    data = data.split([ '${', key, '}'].join('')).join(dictionary[key]);
  }
  return data;
}
