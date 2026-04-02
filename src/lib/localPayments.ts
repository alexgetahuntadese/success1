// Payment service for local auth server
// Handles receipt uploads and payment submissions

const API_BASE = '/api/payments';

const getStoredToken = () => window.localStorage.getItem('studyAppAuthToken');

export const localPaymentService = {
  // Submit payment with receipt (userId from JWT token)
  async submitPayment(data: {
    amount: string;
    bankName: string;
    accountNumber: string;
    transactionRef: string;
    paymentMethod: 'cbe' | 'telebirr';
    receiptFile: File | null;
  }) {
    // Convert file to base64 if present
    let receiptBase64: string | null = null;
    if (data.receiptFile) {
      receiptBase64 = await fileToBase64(data.receiptFile);
    }

    const response = await fetch(`${API_BASE}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getStoredToken()}`,
      },
      body: JSON.stringify({
        amount: data.amount,
        bankName: data.bankName,
        accountNumber: data.accountNumber,
        transactionRef: data.transactionRef,
        paymentMethod: data.paymentMethod,
        receiptBase64,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit payment');
    }

    return response.json();
  },

  // Get authenticated user's submissions
  async listOwnSubmissions() {
    const response = await fetch(`${API_BASE}/submissions`, {
      headers: {
        'Authorization': `Bearer ${getStoredToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to load submissions');
    }

    return response.json();
  },

  // Admin: Get all submissions
  async listAllSubmissions() {
    const response = await fetch(`${API_BASE}/admin/submissions`, {
      headers: {
        'Authorization': `Bearer ${getStoredToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to load submissions');
    }

    return response.json();
  },

  // Admin: Verify or reject payment
  async verifyPayment(submissionId: string, status: 'verified' | 'rejected', reviewerNotes?: string) {
    const response = await fetch(`${API_BASE}/verify/${submissionId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getStoredToken()}`,
      },
      body: JSON.stringify({ status, reviewerNotes }),
    });

    if (!response.ok) {
      throw new Error('Failed to update payment status');
    }

    return response.json();
  },
  // Get user's payment status (for premium access)
  async getPaymentStatus() {
    const response = await fetch(`${API_BASE}/status`, {
      headers: {
        'Authorization': `Bearer ${getStoredToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get payment status');
    }

    return response.json();
  },
};

// Helper: Convert File to base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Types
export interface PaymentSubmission {
  id: string;
  user_id: string;
  amount: number;
  bank_name: string;
  account_number: string;
  transaction_ref: string;
  payment_method: 'cbe' | 'telebirr';
  status: 'pending' | 'verified' | 'rejected';
  receiptUrl?: string;
  submitted_at: string;
  verified_at?: string;
  reviewer_notes?: string;
}
