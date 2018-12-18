require('dotenv').config()
const restify = require('restify')
const HttpStatus = require('http-status-codes')
const shortid = require('shortid')
const faker = require('faker')
const connectRunClose = require('./connectRunClose')

const server = restify.createServer()

server.use(restify.plugins.bodyParser())

// Enable CORS
server.use(
  function crossOrigin (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'X-Requested-With')
    return next()
  }
)

/*
Data types:

 - An account is an object like this:
   {
     _id: <MongoDB document ID>
     accountId: 'IyNUaA1Ya',
     peeps: <Array of peeps>
   }

 - A peep is an object like this:
   {
     peepId: 'SPAUjEqrS',
     info: <String with newlines: \n>
   }

*/

// Health
server.get('/health', (req, res, next) => {
  res.send(HttpStatus.OK, 'App is okay.')
  next()
})

// Get all accounts
server.get('/accounts', async (req, res, next) => {
  const accounts = await connectRunClose('accounts', accounts => accounts.find({}).toArray())
  res.send(HttpStatus.OK, accounts)
  next()
})

// Get specific account
server.get('/accounts/:accountId', async (req, res, next) => {
  const { accountId } = req.params
  const account = await connectRunClose('accounts', accounts => accounts.findOne({ accountId }))
  if (account === null) {
    res.send(HttpStatus.NOT_FOUND)
    next()
    return
  }
  res.send(HttpStatus.OK, account)
  next()
})

// Create account
server.post('/accounts', async (req, res, next) => {
  const accountId = shortid.generate()
  const result = await connectRunClose('accounts', accounts => accounts.insertOne({ accountId, peeps: [] }))
  if (result.result.ok === 1) {
    res.send(HttpStatus.CREATED, { accountId })
    next()
    return
  }
  res.send(HttpStatus.INTERNAL_SERVER_ERROR)
  next()
})

// Delete all accounts
server.del('/accounts', async (req, res, next) => {
  await connectRunClose('accounts', accounts => accounts.deleteMany({}))
  res.send(HttpStatus.NO_CONTENT)
  next()
})

// Delete specific account
server.del('/accounts/:accountId', async (req, res, next) => {
  const { accountId } = req.params
  await connectRunClose('accounts', accounts => accounts.deleteOne({ accountId }))
  res.send(HttpStatus.NO_CONTENT)
  next()
})

// Get all peeps for an account
server.get('/accounts/:accountId/peeps', async (req, res, next) => {
  const { accountId } = req.params
  const account = await connectRunClose('accounts', accounts => accounts.findOne({ accountId }))
  if (account === null) {
    res.send(HttpStatus.NOT_FOUND)
    next()
    return
  }
  const { peeps } = account
  res.send(HttpStatus.OK, peeps)
  next()
})

// Get specific peep for an account
server.get('/accounts/:accountId/peeps/:peepId', async (req, res, next) => {
  const { accountId, peepId } = req.params
  const account = await connectRunClose('accounts', accounts => accounts.findOne({ accountId }))
  const { peeps } = account
  const index = peeps.findIndex(peep => peep.peepId === peepId)
  res.send(HttpStatus.OK, peeps[index])
  next()
})

// Create a peep for an account
server.post('/accounts/:accountId/peeps', async (req, res, next) => {
  const { accountId } = req.params
  const account = await connectRunClose('accounts', accounts => accounts.findOne({ accountId }))
  const { peeps } = account
  const peepId = shortid.generate()
  const peep = {
    peepId,
    name: faker.name.findName(),
    info: faker.lorem.lines()
  }
  peeps.push(peep)
  await connectRunClose('accounts', accounts => accounts.updateOne(
    { accountId },
    { $set: { peeps } }))
  res.send(HttpStatus.CREATED, peep)
  next()
})

// Delete all peeps for an account
server.del('/accounts/:accountId/peeps', async (req, res, next) => {
  const { accountId } = req.params
  await connectRunClose('accounts', accounts => accounts.updateOne(
    { accountId },
    { $set: { peeps: [] } }))
  res.send(HttpStatus.NO_CONTENT)
  next()
})

// Delete specified peep for an account
server.del('/accounts/:accountId/peeps/:peepId', async (req, res, next) => {
  const { accountId, peepId } = req.params
  const account = await connectRunClose('accounts', accounts => accounts.findOne({ accountId }))
  const { peeps } = account
  const index = peeps.findIndex(peep => peep.peepId === peepId)
  peeps.splice(index, 1)
  await connectRunClose('accounts', accounts => accounts.updateOne(
    { accountId },
    { $set: { peeps } }))
  res.send(HttpStatus.NO_CONTENT)
  next()
})

// Update a peep for an account
server.put('/accounts/:accountId/peeps/:peepId', async (req, res, next) => {
  const { accountId, peepId } = req.params
  const account = await connectRunClose('accounts', accounts => accounts.findOne({ accountId }))
  const { peeps } = account
  const index = peeps.findIndex(peep => peep.peepId === peepId)
  peeps[index] = { ...peeps[index], ...req.body }
  await connectRunClose('accounts', accounts => accounts.updateOne(
    { accountId },
    { $set: { peeps } }))
  res.send(HttpStatus.NO_CONTENT)
  next()
})

let port = process.env.PORT
if (port == null || port === '') {
  port = 8000
}

server.listen(port, function () {
  console.info('%s listening at %s', server.name, server.url)
})
