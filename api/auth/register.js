import bcrypt from 'bcryptjs'
import { connectToDatabase } from '../_lib/mongodb.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const client = await connectToDatabase()
    const db = client.db('mortgageDB')
    const users = db.collection('users')
    const count = await users.countDocuments()
    if (count > 0) return res.status(403).json({ error: 'Admin already exists. Use login.' })
    const { email, password, name } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
    const hashed = await bcrypt.hash(password, 12)
    await users.insertOne({ email, name: name || 'Admin', password: hashed, role: 'admin', createdAt: new Date() })
    return res.status(201).json({ success: true, message: 'Admin created. Please log in.' })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
