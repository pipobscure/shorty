const { createHash } = require('crypto');
const { promises : fs } = require('fs');
const path = require('path');

exports.store = async function store(data, key) {
  key = key || hash(data).slice(0,6);
  const place = path.resolve(location(key));
  const dir = path.dirname(place);
  console.log(`Dir: ${dir}`);
  console.log(`File: ${place}`);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(place, data, 'utf-8');
  return key;
}

exports.retrieve = async function retrieve(key) {
  const place = location(key || hash(data));
  const data = await fs.readFile(path.resolve(place), 'utf-8');
  return data;
}

function hash(data) {
  const hash = createHash('sha1');
  hash.update(data, 'utf-8');
  return hash.digest('hex').toLowerCase();
}

function location(key) {
  key = hash(key);
  const base = key.slice(0,4).split('').join(path.sep);
  const file = key.slice(4,6);
  return `${base}${path.sep}${file}`;
}
