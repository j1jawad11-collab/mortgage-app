import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
let cachedClient = null

export async function connectToDatabase() {
  if (cachedClient) return cachedClient
  if (!uri) throw new Error('MONGODB_URI is not defined.')
  const client = new MongoClient(uri)
  await client.connect()
  cachedClient = client
  return client
}
