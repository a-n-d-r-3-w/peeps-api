const restify = require('restify')
const HttpStatus = require('http-status-codes')
const shortid = require('shortid')
const server = restify.createServer()

server.use(restify.plugins.bodyParser())

let accounts = []
let peeps = []

/*
Data types:

 - An account is simply a string that is the accountId, like this:
   'IyNUaA1Ya'

 - A peep is an object like this:
   {
     peepId: 'SPAUjEqrS'
   }

*/

// Get all accounts
server.get('/accounts', function (req, res, next) {
  res.send(HttpStatus.OK, { accounts })
  next()
})

// Create account
server.post('/accounts', function (req, res, next) {
  const accountId = shortid.generate()
  accounts.push(accountId)
  res.send(HttpStatus.CREATED, { accountId })
  next()
})

// Delete all accounts
server.del('/accounts', function (req, res, next) {
  accounts.splice(0)
  res.send(HttpStatus.NO_CONTENT)
  next()
})

// Delete specified account
server.del('/accounts/:accountId', function (req, res, next) {
  accounts = accounts.filter(accountId => accountId !== req.params.accountId)
  res.send(HttpStatus.NO_CONTENT)
  next()
})

// Get all peeps for an account
server.get('/accounts/:accountId/peeps', function (req, res, next) {
  res.send(HttpStatus.OK, { peeps })
  next()
})

// Create a peep for an account
server.post('/accounts/:accountId/peeps', function (req, res, next) {
  const peepId = shortid.generate()
  peeps.push({ peepId })
  res.send(HttpStatus.CREATED, { peepId })
  next()
})

// Delete all peeps for an account
server.del('/accounts/:accountId/peeps', function (req, res, next) {
  peeps.splice(0)
  res.send(HttpStatus.NO_CONTENT)
  next()
})

// Delete specified peep for an account
server.del('/accounts/:accountId/peeps/:peepId', function (req, res, next) {
  peeps = peeps.filter(peep => peep.peepId !== req.params.peepId)
  res.send(HttpStatus.NO_CONTENT)
  next()
})

// Update a peep for an account
server.put('/accounts/:accountId/peeps/:peepId', function (req, res, next) {
  const index = peeps.findIndex(peep => peep.peepId === req.params.peepId)
  console.info(req.body)
  res.send(HttpStatus.NO_CONTENT)
  next()
})

server.listen(3000, function () {
  console.info('%s listening at %s', server.name, server.url)
})
