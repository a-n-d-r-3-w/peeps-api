const { MongoClient } = require('mongodb')

const DB_URL = 'mongodb://localhost:27017'
const DB_NAME = 'peeps'

const connectRunClose = async (collectionName, fn) => {
  // noinspection JSCheckFunctionSignatures, because WebStorm doesn't know about useNewUrlParser.
  const client = await MongoClient.connect(DB_URL, { useNewUrlParser: true })
  const db = client.db(DB_NAME)
  const collection = db.collection(collectionName)
  const result = await fn(collection)

  if (client) {
    await client.close()
  }

  return result
}

module.exports = connectRunClose
