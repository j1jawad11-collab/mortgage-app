import { verifyAdminToken } from '../_lib/auth.js'

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const decoded = verifyAdminToken(req)
    return res.status(200).json({ success: true, user: decoded })
  } catch (error) {
    return res.status(401).json({ error: error.message })
  }
}
