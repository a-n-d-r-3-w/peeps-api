const restify = require('restify')
const HttpStatus = require('http-status-codes')
const shortid = require('shortid')
const server = restify.createServer()

const accounts = []

server.get('/accounts', function (req, res, next) {
  res.send(HttpStatus.OK, { accounts })
  next()
})

server.post('/accounts', function (req, res, next) {
  const accountId = shortid.generate()
  accounts.push(accountId)
  res.send(HttpStatus.CREATED, { accountId })
  next()
})

server.del('/accounts', function (req, res, next) {
  accounts.splice(0)
  res.send(HttpStatus.NO_CONTENT)
  next()
})

server.listen(3000, function () {
  console.info('%s listening at %s', server.name, server.url)
})
