import { MongoClient } from 'mongodb'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const uri = process.env.MONGODB_URI

// Cache the MongoDB client across warm serverless invocations
let cachedClient: MongoClient | null = null

async function connectToDatabase(): Promise<MongoClient> {
  if (cachedClient) {
    return cachedClient
  }

  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables.')
  }

  const client = new MongoClient(uri)
  await client.connect()
  cachedClient = client

  return client
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[test-db] error:', message)

    return res.status(500).json({
      success: false,
      error: message,
    })
  }
}
