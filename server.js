const express = require('express');
const userRouter = require('./users/userRouter')
const postRouter = require('./posts/postRouter')

const server = express();

server.use(express.json())

server.use('/api/users', logger, userRouter)
server.use('/api/posts', logger, postRouter)

server.get('/', logger, (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  const timestamp = new Date().toTimeString()
  console.log(`\n REQUEST: ${req.method} to ${req.url} timestamp: ${timestamp} \n`)
  next()
}

module.exports = server;
