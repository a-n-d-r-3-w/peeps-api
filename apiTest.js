const supertest = require('supertest')
const HttpStatus = require('http-status-codes')

const request = supertest('http://localhost:3000')

// Get all accounts (which is an empty array at this point)
request.get('/accounts').expect(HttpStatus.OK, { accounts: [] }, error => {
  if (error) {
    console.error(error)
    return
  }
  console.info('pass')
})

// Create an account
request.post('/accounts').expect(HttpStatus.CREATED, { accountId: 1 }, error => {
  if (error) {
    console.error(error)
    return
  }
  console.info('pass')
})

// Get all accounts again
request.get('/accounts').expect(HttpStatus.OK, { accounts: [ 1 ] }, error => {
  if (error) {
    console.error(error)
    return
  }
  console.info('pass')
})
