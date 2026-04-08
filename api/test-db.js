import dbConnect from './_lib/dbConnect.js'

export default async function handler(req, res) {
  try {
    const mongoose = await dbConnect()
    const db = mongoose.connection.getClient().db('mortgageDB')

    const result = await db.collection('connection_tests').insertOne({
      message: 'MongoDB connected successfully via Mongoose',
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
