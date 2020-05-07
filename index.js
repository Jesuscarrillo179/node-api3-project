const server = require('./server.js');

const Port = 8000

server.listen(Port, () => {
  console.log(`\n* Server Running on http://localhost:${Port} *\n`);
});
