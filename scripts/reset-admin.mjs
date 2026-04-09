import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'

// Grabs your URI directly from the variable
const uri = process.env.MONGODB_URI

async function reset() {
  if (!uri) {
    console.error('Please provide MONGODB_URI!')
    process.exit(1)
  }

  const client = new MongoClient(uri)
  try {
    await client.connect()
    const db = client.db('mortgageDB')
    const users = db.collection('users')
    
    const user = await users.findOne({ role: 'admin' })
    const newPass = 'DeltaAdmin!2026'
    const hashed = await bcrypt.hash(newPass, 12)

    if (user) {
      await users.updateOne({ _id: user._id }, { $set: { password: hashed } })
      console.log('--- ADMIN FOUND ---')
      console.log('Email:', user.email)
    } else {
      await users.insertOne({ email: 'admin@deltaf.ca', name: 'Admin', password: hashed, role: 'admin', createdAt: new Date() })
      console.log('--- NO ADMIN FOUND (Created new one) ---')
      console.log('Email: admin@deltaf.ca')
    }
    
    console.log('Password successfully reset down to:', newPass)
    console.log('You can now log in and use the new /admin/settings page to change it back!')
  } catch(e) {
    console.log('Error patching admin:', e)
  } finally {
    await client.close()
  }
}

reset()
