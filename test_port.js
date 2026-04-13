import http from 'http';
const server = http.createServer((req, res) => {
  res.end('Port 5173 is working\n');
});
server.listen(5173, () => {
  console.log('Server listening on port 5173');
  process.exit(0);
});
server.on('error', (err) => {
  console.error('Error binding to 5173:', err);
  process.exit(1);
});
