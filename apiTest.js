const supertest = require('supertest')
const HttpStatus = require('http-status-codes')

const request = supertest('http://localhost:3000')

request.get('/accounts').expect(HttpStatus.OK, { accounts: [] }, function (error) {
  if (error) {
    console.error(error)
    return
  }
  console.info('pass')
})

request.post('/accounts').expect(HttpStatus.CREATED, { accountId: 1 }, error => {
  if (error) {
    console.error(error)
    return
  }
  console.info('pass')
})
