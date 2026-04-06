import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
let cachedClient = null

async function connectToDatabase() {
  if (cachedClient) return cachedClient
  if (!uri) throw new Error('MONGODB_URI is not defined in environment variables.')

  const client = new MongoClient(uri)
  await client.connect()
  cachedClient = client
  return client
}

export default async function handler(req, res) {
  try {
    const client = await connectToDatabase()
    const db = client.db('mortgageDB')

    const result = await db.collection('connection_tests').insertOne({
      message: 'MongoDB connected successfully',
      date: new Date(),
    })

    return res.status(200).json({
      success: true,
      insertedId: result.insertedId,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[test-db] error:', message)

    return res.status(500).json({
      success: false,
      error: message,
    })
  }
}
