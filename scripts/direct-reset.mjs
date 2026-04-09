import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'

// Direct replica set connection bypassing SRV DNS lookup issues
const MONGODB_URI = 'mongodb://j1jawad11_db_user:0xc3WGf4QYqfw4Tj@ac-ubg5zh2-shard-00-00.oi2hddh.mongodb.net:27017,ac-ubg5zh2-shard-00-01.oi2hddh.mongodb.net:27017,ac-ubg5zh2-shard-00-02.oi2hddh.mongodb.net:27017/mortgageDB?ssl=true&replicaSet=atlas-ubg5zh2-shard-0&authSource=admin&retryWrites=true&w=majority&appName=mortgage'

async function check() {
  const client = new MongoClient(MONGODB_URI)
  try {
    await client.connect()
    const db = client.db('mortgageDB')
    const users = db.collection('users')
    
    // Look for the admin user
    const user = await users.findOne({ role: 'admin' })
    const newPass = 'DeltaAdmin!2026'
    
    if (user) {
      console.log('--- ADMIN USER FOUND ---')
      console.log('Email:', user.email)
      
      const hashed = await bcrypt.hash(newPass, 12)
      await users.updateOne({ _id: user._id }, { $set: { password: hashed } })
      console.log('Password successfully reset to:', newPass)
    } else {
      console.log('--- NO ADMIN USER FOUND ---')
      console.log('Registering default admin...')
      
      const hashed = await bcrypt.hash(newPass, 12)
      await users.insertOne({ email: 'admin@deltaf.ca', name: 'Admin', password: hashed, role: 'admin', createdAt: new Date() })
      console.log('Email: admin@deltaf.ca')
      console.log('Password successfully set to:', newPass)
    }
  } catch(e) {
    console.log('Error:', e)
  } finally {
    await client.close()
  }
}

check()
