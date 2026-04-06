import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { connectToDatabase } from '../_lib/mongodb.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
    const client = await connectToDatabase()
    const db = client.db('mortgageDB')
    const user = await db.collection('users').findOne({ email })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' })
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET not defined')
    const token = jwt.sign({ id: user._id.toString(), email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
    return res.status(200).json({ success: true, token, user: { email: user.email, name: user.name, role: user.role } })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
