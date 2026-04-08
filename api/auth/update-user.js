import bcrypt from 'bcryptjs'
import { verifyAdminToken } from '../_lib/auth.js'
import dbConnect from '../_lib/dbConnect.js'
import { ObjectId } from 'mongodb'

export default async function handler(req, res) {
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' })
  
  let decoded;
  try {
    decoded = verifyAdminToken(req)
  } catch (err) {
    return res.status(401).json({ error: err.message })
  }

  try {
    const { email, password } = req.body

    const mongoose = await dbConnect()
    const db = mongoose.connection.getClient().db('mortgageDB')
    const users = db.collection('users')

    const updateData = {}
    if (email) {
      updateData.email = email
    }
    if (password) {
      updateData.password = await bcrypt.hash(password, 12)
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'Nothing to update' })
    }

    await users.updateOne({ _id: new ObjectId(decoded.id) }, { $set: updateData })

    return res.status(200).json({ success: true, message: 'Settings updated successfully' })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
