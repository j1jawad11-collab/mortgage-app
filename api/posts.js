import mongoose from 'mongoose'
import dbConnect from './_lib/dbConnect.js'
import { verifyAdminToken } from './_lib/auth.js'

export default async function handler(req, res) {
  const mongoose = await dbConnect()
  const db = mongoose.connection.getClient().db('mortgageDB')
  const posts = db.collection('posts')

  if (req.method === 'GET') {
    const all = await posts.find({}).sort({ createdAt: -1 }).toArray()
    return res.status(200).json(all)
  }

  try {
    verifyAdminToken(req)
  } catch (err) {
    return res.status(401).json({ error: err.message })
  }

  if (req.method === 'POST') {
    const { title, content, excerpt, category, imageUrl } = req.body
    if (!title || !content) return res.status(400).json({ error: 'Title and content required' })
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const result = await posts.insertOne({ title, slug, content, excerpt: excerpt || '', category: category || 'General', imageUrl: imageUrl || '', createdAt: new Date(), updatedAt: new Date() })
    return res.status(201).json({ success: true, insertedId: result.insertedId })
  }

  if (req.method === 'PUT') {
    const { id, title, content, excerpt, category, imageUrl } = req.body
    if (!id) return res.status(400).json({ error: 'Post ID required' })
    const slug = title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : undefined
    const update = { updatedAt: new Date(), ...(title && { title, slug }), ...(content && { content }), ...(excerpt !== undefined && { excerpt }), ...(category && { category }), ...(imageUrl !== undefined && { imageUrl }) }
    await posts.updateOne({ _id: new mongoose.Types.ObjectId(id) }, { $set: update })
    return res.status(200).json({ success: true })
  }

  if (req.method === 'DELETE') {
    const { id } = req.body
    if (!id) return res.status(400).json({ error: 'Post ID required' })
    await posts.deleteOne({ _id: new mongoose.Types.ObjectId(id) })
    return res.status(200).json({ success: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
