// Payment receipt upload handling for SQLite auth server
import express from 'express'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Ensure uploads directory exists
const uploadsDir = path.resolve(__dirname, '..', '..', 'uploads', 'receipts')
await fs.mkdir(uploadsDir, { recursive: true })

export const uploadRouter = express.Router()

// In-memory store for payment submissions (replace with SQLite table for production)
const submissions = []
let submissionId = 1

// Middleware to parse multipart/form-data for file uploads
uploadRouter.use(express.json({ limit: '10mb' }))

// POST /api/payments/submit - Submit payment with receipt
uploadRouter.post('/submit', async (req, res) => {
  try {
    const { userId, amount, bankName, accountNumber, transactionRef, paymentMethod, receiptBase64 } = req.body

    // Validation
    if (!userId || !amount || !bankName || !accountNumber || !transactionRef || !paymentMethod) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    let receiptPath = null
    let receiptUrl = null

    // Save receipt image if provided
    if (receiptBase64) {
      const base64Data = receiptBase64.replace(/^data:image\/\w+;base64,/, '')
      const buffer = Buffer.from(base64Data, 'base64')
      
      // Validate size (max 5MB)
      if (buffer.length > 5 * 1024 * 1024) {
        return res.status(400).json({ message: 'Receipt image too large (max 5MB)' })
      }

      // Generate unique filename
      const ext = receiptBase64.match(/data:image\/(\w+);/)?.[1] || 'png'
      const filename = `receipt-${userId}-${Date.now()}.${ext}`
      const filepath = path.join(uploadsDir, filename)
      
      await fs.writeFile(filepath, buffer)
      receiptPath = filepath
      receiptUrl = `/uploads/receipts/${filename}`
    }

    // Create submission record
    const submission = {
      id: String(submissionId++),
      user_id: userId,
      amount: parseFloat(amount),
      bank_name: bankName,
      account_number: accountNumber,
      transaction_ref: transactionRef,
      payment_method: paymentMethod,
      receipt_path: receiptPath,
      receipt_url: receiptUrl,
      status: 'pending',
      submitted_at: new Date().toISOString(),
      verified_at: null,
      reviewer_notes: null,
    }

    submissions.push(submission)

    res.status(201).json({
      ...submission,
      receiptUrl: receiptUrl ? `http://localhost:5000${receiptUrl}` : null,
    })
  } catch (err) {
    console.error('Payment submit error:', err)
    res.status(500).json({ message: 'Server error: ' + err.message })
  }
})

// GET /api/payments/submissions/:userId - Get user's submissions
uploadRouter.get('/submissions/:userId', (req, res) => {
  const userSubmissions = submissions.filter(s => s.user_id === req.params.userId)
  res.json(userSubmissions.map(s => ({
    ...s,
    receiptUrl: s.receipt_url ? `http://localhost:5000${s.receipt_url}` : null,
  })))
})

// GET /api/payments/admin/submissions - Get all submissions (admin)
uploadRouter.get('/admin/submissions', (req, res) => {
  // TODO: Add admin auth check
  res.json(submissions.map(s => ({
    ...s,
    receiptUrl: s.receipt_url ? `http://localhost:5000${s.receipt_url}` : null,
  })))
})

// PATCH /api/payments/verify/:submissionId - Verify/reject payment (admin)
uploadRouter.patch('/verify/:submissionId', (req, res) => {
  const { status, reviewerNotes } = req.body
  const submission = submissions.find(s => s.id === req.params.submissionId)
  
  if (!submission) {
    return res.status(404).json({ message: 'Submission not found' })
  }

  submission.status = status // 'verified' or 'rejected'
  submission.reviewer_notes = reviewerNotes || null
  submission.verified_at = new Date().toISOString()

  res.json({
    ...submission,
    receiptUrl: submission.receipt_url ? `http://localhost:5000${submission.receipt_url}` : null,
  })
})

// Static file serving for uploaded receipts
export const receiptStaticPath = uploadsDir
