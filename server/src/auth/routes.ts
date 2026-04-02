import express from 'express'
import pool from './db'
import { hashPassword, verifyPassword } from './hash'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.post('/register', async (req, res) => {
  try {
    const { phone, password } = req.body
    if (!phone || !password) return res.status(400).json({ error: 'phone and password required' })

    const client = await pool.connect()
    try {
      const hashed = await hashPassword(password)
      const result = await client.query(
        'INSERT INTO users (phone, password_hash) VALUES ($1, $2) RETURNING id, phone, created_at',
        [phone, hashed]
      )
      const user = result.rows[0]
      return res.status(201).json({ user })
    } finally {
      client.release()
    }
  } catch (err) {
    if ((err as any)?.code === '23505') return res.status(409).json({ error: 'phone already registered' })
    console.error(err)
    return res.status(500).json({ error: 'server error' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body
    if (!phone || !password) return res.status(400).json({ error: 'phone and password required' })

    const client = await pool.connect()
    try {
      const result = await client.query('SELECT id, phone, password_hash FROM users WHERE phone = $1', [phone])
      const user = result.rows[0]
      if (!user) return res.status(401).json({ error: 'invalid credentials' })

      const ok = await verifyPassword(password, user.password_hash)
      if (!ok) return res.status(401).json({ error: 'invalid credentials' })

      const payload = { sub: user.id, phone: user.phone }
      const token = jwt.sign(payload, process.env.JWT_SECRET || 'change-me', { expiresIn: '7d' })

      await client.query('UPDATE users SET last_login = now() WHERE id = $1', [user.id])

      return res.json({ token })
    } finally {
      client.release()
    }
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'server error' })
  }
})

export default router
