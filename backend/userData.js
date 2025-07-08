const http = require('http');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'users.json');

function readData() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/users') {
    const users = readData();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
  } else if (req.method === 'POST' && req.url === '/users') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const users = JSON.parse(body);
      writeData(users);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok' }));
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(8443, () => {
  console.log('User data server running on http://localhost:8443');
}); 