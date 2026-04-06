import jwt from 'jsonwebtoken'

export function verifyAdminToken(req) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer '))
    throw new Error('Not authenticated')
  const token = authHeader.split(' ')[1]
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET not defined')
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (decoded.role !== 'admin') throw new Error('Not authorized')
    return decoded
  } catch {
    throw new Error('Invalid or expired token')
  }
}
