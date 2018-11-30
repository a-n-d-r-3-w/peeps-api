const restify = require('restify')
const HttpStatus = require('http-status-codes')

const server = restify.createServer()

server.get('/accounts', function (req, res, next) {
  res.send(HttpStatus.OK, { accounts: [] })
  next()
})

server.listen(3000, function () {
  console.info('%s listening at %s', server.name, server.url)
})
