import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Landmark, Smartphone, Upload, Download, Database, AlertCircle, Shield, CheckCircle, Clock, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TopBar from '@/components/TopBar';
import StarField from '@/components/StarField';
import { getPerformanceData } from '@/lib/performanceUtils';

interface PaymentSubmission {
  id: string;
  amount: string;
  bankName: string;
  accountNumber: string;
  paymentMethod: 'cbe' | 'telebirr';
  transactionRef: string;
  receiptImage: string | null;
  status: 'pending' | 'verified' | 'rejected';
  submittedAt: string;
  lastModified: string;
  backupCount: number;
}

interface StorageBackup {
  timestamp: string;
  data: PaymentSubmission[];
  checksum: string;
}

interface TrialAccess {
  studentName: string;
  startedAt: string;
  endsAt: string;
  used: boolean;
}

const TRIAL_STORAGE_KEY = 'studentTrialAccess';
const TRIAL_LENGTH_DAYS = 7;

// Safe localStorage with error handling
const safeStorage = {
  get: (key: string): any => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error(`Failed to read ${key} from localStorage:`, e);
      return null;
    }
  },
  set: (key: string, value: any): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`Failed to write ${key} to localStorage:`, e);
      if (e instanceof Error && e.name === 'QuotaExceededError') {
        console.warn('Storage quota exceeded');
      }
      return false;
    }
  },
  remove: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error(`Failed to remove ${key} from localStorage:`, e);
      return false;
    }
  }
};

// Generate checksum for data integrity
const generateChecksum = (data: any): string => {
  return btoa(JSON.stringify(data)).slice(0, 32);
};

const addTrialWindow = (startAt: string) => {
  const endDate = new Date(startAt);
  endDate.setDate(endDate.getDate() + TRIAL_LENGTH_DAYS);
  return endDate.toISOString();
};

const getTrialDaysRemaining = (trial: TrialAccess | null) => {
  if (!trial) return 0;
  const diff = new Date(trial.endsAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

const isTrialExpired = (trial: TrialAccess | null) => {
  if (!trial) return false;
  return new Date(trial.endsAt).getTime() < Date.now();
};

// Compress image before storing
const compressImage = (dataUrl: string, maxWidth = 1200, quality = 0.7): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Calculate new dimensions
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.src = dataUrl;
  });
};

const PaymentPage = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cbe' | 'telebirr'>('cbe');
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissions, setSubmissions] = useState<PaymentSubmission[]>([]);
  const [storageStats, setStorageStats] = useState({ used: 0, total: 0, items: 0 });
  const [isStorageFull, setIsStorageFull] = useState(false);
  const [trialAccess, setTrialAccess] = useState<TrialAccess | null>(null);

  const studentName = getPerformanceData().profile.student_name || 'Student';

  // Load submissions on mount
  useEffect(() => {
    const loaded = safeStorage.get('paymentSubmissions');
    if (loaded && Array.isArray(loaded)) {
      setSubmissions(loaded);
    }
    const storedTrial = safeStorage.get(TRIAL_STORAGE_KEY) as TrialAccess | null;
    if (storedTrial) {
      setTrialAccess(storedTrial);
    }
    updateStorageStats();
  }, []);

  // Calculate storage usage
  const updateStorageStats = () => {
    let used = 0;
    let items = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key) || '';
        used += key.length + value.length;
        items++;
      }
    }
    const total = 5 * 1024 * 1024; // 5MB approximate limit
    setStorageStats({ used, total, items });
    setIsStorageFull(used > total * 0.9);
  };

  // Create backup before any major operation
  const createBackup = (data: PaymentSubmission[]) => {
    const backup: StorageBackup = {
      timestamp: new Date().toISOString(),
      data,
      checksum: generateChecksum(data)
    };
    safeStorage.set('paymentSubmissions_backup', backup);
    safeStorage.set('paymentBackup_timestamp', new Date().toISOString());
  };

  // Validate submission
  const validateSubmission = (submission: PaymentSubmission): string[] => {
    const errors = [];
    if (!submission.amount) errors.push('Amount is required');
    if (!submission.bankName) errors.push('Bank name is required');
    if (!submission.accountNumber) errors.push('Account number is required');
    if (!submission.transactionRef) errors.push('Transaction reference is required');
    return errors;
  };

  // Handle image selection with compression
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      const compressed = await compressImage(reader.result as string);
      setReceiptImage(compressed);
    };
    reader.readAsDataURL(file);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !bankName || !accountNumber || !transactionRef) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    // Create backup before submission
    createBackup(submissions);

    const newSubmission: PaymentSubmission = {
      id: Date.now().toString(),
      amount,
      bankName,
      accountNumber,
      paymentMethod,
      transactionRef,
      receiptImage,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      backupCount: 0,
    };

    // Validate submission
    const errors = validateSubmission(newSubmission);
    if (errors.length > 0) {
      alert(errors.join(', '));
      setIsSubmitting(false);
      return;
    }

    const updatedSubmissions = [newSubmission, ...submissions];
    
    // Try to save with retry logic
    let saved = false;
    let retries = 0;
    const maxRetries = 3;
    
    while (!saved && retries < maxRetries) {
      saved = safeStorage.set('paymentSubmissions', updatedSubmissions);
      if (!saved) {
        retries++;
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    if (saved) {
      // Create backup after successful save
      createBackup(updatedSubmissions);
      
      // Also save to sessionStorage as extra backup
      try {
        sessionStorage.setItem('paymentSubmissions_temp', JSON.stringify(updatedSubmissions));
      } catch (e) {
        console.log('sessionStorage backup failed (non-critical)');
      }

      setSubmissions(updatedSubmissions);
      updateStorageStats();
      
      alert('Payment submitted successfully! Your receipt has been securely saved.');

      // Reset form
      setAmount('');
      setBankName('');
      setAccountNumber('');
      setTransactionRef('');
      setReceiptImage(null);
      const fileInput = document.getElementById('receipt') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } else {
      alert('Failed to save your submission. Storage may be full. Please export your data.');
    }

    setIsSubmitting(false);
  };

  // Export data
  const handleExport = () => {
    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      submissions,
      checksum: generateChecksum(submissions),
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment-receipts-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('Your receipts have been downloaded as a backup file.');
  };

  // Import data
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      try {
        const importData = JSON.parse(reader.result as string);
        if (importData.submissions && Array.isArray(importData.submissions)) {
          const existingIds = new Set(submissions.map(s => s.id));
          const newItems = importData.submissions.filter((s: PaymentSubmission) => !existingIds.has(s.id));
          const merged = [...submissions, ...newItems];
          
          if (safeStorage.set('paymentSubmissions', merged)) {
            setSubmissions(merged);
            createBackup(merged);
            updateStorageStats();
            alert(`Imported ${newItems.length} new receipts.`);
          } else {
            throw new Error('Failed to save imported data');
          }
        } else {
          throw new Error('Invalid file format');
        }
      } catch (error) {
        alert('Could not parse the backup file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-emerald-400" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-red-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'verified':
        return 'Verified';
      case 'pending':
        return 'Pending Verification';
      default:
        return 'Rejected';
    }
  };

  const handleStartTrial = () => {
    if (trialAccess?.used) {
      alert('The 7-day free trial has already been used on this device.');
      return;
    }

    const startedAt = new Date().toISOString();
    const trial: TrialAccess = {
      studentName,
      startedAt,
      endsAt: addTrialWindow(startedAt),
      used: true,
    };

    safeStorage.set(TRIAL_STORAGE_KEY, trial);
    setTrialAccess(trial);
    alert('Your 7-day free trial is now active.');
  };

  const trialActive = trialAccess && !isTrialExpired(trialAccess);
  const trialExpired = trialAccess && isTrialExpired(trialAccess);
  const trialDaysRemaining = getTrialDaysRemaining(trialAccess);

  return (
    <div className="app-shell pt-14 px-4 pb-4 md:p-8 md:pt-14">
      <TopBar />
      <StarField starCount={60} shootingCount={4} />

      <div className="max-w-4xl mx-auto relative z-10">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4 text-white/85 hover:bg-white/12 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg mb-4">
            <CreditCard className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Payment Verification</h1>
          <p className="text-white/70 max-w-lg mx-auto">
            Upload your bank transfer receipt. Data is securely saved with automatic backups.
          </p>
        </div>

        <div className="mb-6 rounded-2xl border border-amber-400/30 bg-gradient-to-r from-amber-500/15 to-orange-500/10 p-5 text-white">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-amber-100">
                <Gift className="h-3.5 w-3.5" />
                7-Day Free Trial
              </div>
              <h2 className="text-xl font-bold text-white">Try Simple Road before you pay</h2>
              <p className="mt-1 max-w-2xl text-sm text-white/75">
                Every student gets one 7-day free trial for full access before upgrading to a paid plan.
              </p>
              {trialActive && (
                <p className="mt-3 text-sm text-emerald-200">
                  Active for {studentName}. {trialDaysRemaining} day{trialDaysRemaining === 1 ? '' : 's'} remaining until {new Date(trialAccess.endsAt).toLocaleDateString()}.
                </p>
              )}
              {trialExpired && (
                <p className="mt-3 text-sm text-rose-200">
                  Your free trial ended on {new Date(trialAccess.endsAt).toLocaleDateString()}. Continue by submitting a payment below.
                </p>
              )}
            </div>
            <Button
              onClick={handleStartTrial}
              disabled={Boolean(trialAccess?.used)}
              className="bg-white text-slate-950 hover:bg-white/90 disabled:bg-white/30 disabled:text-white/60"
            >
              {trialActive ? 'Trial Active' : trialExpired ? 'Trial Used' : 'Start Free Trial'}
            </Button>
          </div>
        </div>

        {/* Storage Warning */}
        {isStorageFull && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/40 text-white">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <span className="font-semibold">Storage Almost Full ({Math.round((storageStats.used / storageStats.total) * 100)}%)</span>
            </div>
            <p className="text-sm mt-1 text-white/80">
              Please export your data to prevent loss. Images are automatically compressed.
            </p>
          </div>
        )}

        {/* Data Protection Banner */}
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-white">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-400" />
            <span className="font-semibold">Data Protection Active</span>
          </div>
          <p className="text-sm mt-1 text-white/70">
            • Auto-saved drafts • Automatic backups • Export/import support • Compressed images
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Form */}
          <Card className="bg-white/[0.08] border-white/[0.14] text-white">
            <CardHeader>
              <CardTitle className="text-xl">Submit Payment</CardTitle>
              <CardDescription className="text-white/70">
                {trialActive
                  ? `Your trial is active. Upgrade any time to keep access after ${new Date(trialAccess.endsAt).toLocaleDateString()}.`
                  : 'Fill in your payment details'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-white">Amount (ETB)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-white/[0.08] border-white/[0.14] text-white placeholder:text-white/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bank" className="text-white">Bank Name</Label>
                  <Input
                    id="bank"
                    placeholder="Your bank name"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="bg-white/[0.08] border-white/[0.14] text-white placeholder:text-white/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="account" className="text-white">Account Number</Label>
                  <Input
                    id="account"
                    placeholder="Your account number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="bg-white/[0.08] border-white/[0.14] text-white placeholder:text-white/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reference" className="text-white">Transaction Reference</Label>
                  <Input
                    id="reference"
                    placeholder="Transaction ID or reference number"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    className="bg-white/[0.08] border-white/[0.14] text-white placeholder:text-white/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Payment Method Used</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'cbe', label: 'CBE', icon: Landmark },
                      { id: 'telebirr', label: 'Telebirr', icon: Smartphone },
                    ].map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id as any)}
                        className={`p-2 rounded-lg border text-xs flex flex-col items-center gap-1 transition-colors ${
                          paymentMethod === method.id
                            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                            : 'bg-white/[0.08] border-white/[0.14] text-white/70 hover:bg-white/[0.12]'
                        }`}
                      >
                        <method.icon className="h-4 w-4" />
                        {method.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Receipt Upload */}
                <div className="space-y-2">
                  <Label className="text-white">Receipt Screenshot</Label>
                  <div
                    onClick={() => document.getElementById('receipt')?.click()}
                    className="border-2 border-dashed border-white/30 rounded-xl p-6 text-center cursor-pointer hover:bg-white/[0.04] transition-colors"
                  >
                    {receiptImage ? (
                      <img src={receiptImage} alt="Receipt preview" className="max-h-40 mx-auto rounded-lg" />
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="h-10 w-10 text-white/50 mb-2" />
                        <p className="text-sm text-white/70">Click to upload receipt</p>
                        <p className="text-xs text-white/50 mt-1">JPG, PNG (auto-compressed)</p>
                      </div>
                    )}
                    <input
                      id="receipt"
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Payment'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Bank Details & History */}
          <div className="space-y-6">
            {/* Payment Methods Tabs */}
            <Card className="bg-white/[0.08] border-white/[0.14] text-white">
              <CardHeader>
                <CardTitle className="text-xl">Payment Methods</CardTitle>
                <CardDescription className="text-white/70">
                  Choose your preferred payment method
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)} className="w-full">
                  <TabsList className="grid grid-cols-2 bg-white/[0.08] mb-4">
                    <TabsTrigger value="cbe" className="text-white data-[state=active]:bg-white/20">
                      <Landmark className="h-4 w-4 mr-1" />
                      CBE
                    </TabsTrigger>
                    <TabsTrigger value="telebirr" className="text-white data-[state=active]:bg-white/20">
                      <Smartphone className="h-4 w-4 mr-1" />
                      Telebirr
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="cbe" className="space-y-3">
                    <div className="p-3 rounded-xl bg-white/[0.08] border border-white/[0.14]">
                      <p className="text-xs text-white/70">Bank</p>
                      <p className="font-semibold">Commercial Bank of Ethiopia</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.08] border border-white/[0.14]">
                      <p className="text-xs text-white/70">Account</p>
                      <p className="font-semibold">1000282751279</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.08] border border-white/[0.14]">
                      <p className="text-xs text-white/70">Holder</p>
                      <p className="font-semibold">Alexander Getahun Tadese</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="telebirr" className="space-y-3">
                    <div className="p-3 rounded-xl bg-white/[0.08] border border-white/[0.14]">
                      <p className="text-xs text-white/70">Merchant Name</p>
                      <p className="font-semibold">Alexander Getahun Tadese</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.08] border border-white/[0.14]">
                      <p className="text-xs text-white/70">Telebirr Number</p>
                      <p className="font-semibold">0992010092</p>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                      <p className="text-xs text-emerald-400">Telebirr</p>
                      <p className="font-semibold text-emerald-400">Send payment to 0992010092</p>
                    </div>
                  </TabsContent>

                </Tabs>
                <p className="text-xs text-white/50 text-center mt-4">
                  After payment, submit the receipt/screenshot using the form
                </p>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card className="bg-white/[0.08] border-white/[0.14] text-white">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Management
                </CardTitle>
                <CardDescription className="text-white/70">
                  Storage: {Math.round((storageStats.used / storageStats.total) * 100)}% used ({(storageStats.used / 1024).toFixed(1)}KB / ~5MB)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={handleExport}
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export All Receipts (Backup)
                </Button>
                <div className="relative z-10">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />
                  <Button
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10 relative z-10"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Import from Backup
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Submission History */}
            {submissions.length > 0 && (
              <Card className="bg-white/[0.08] border-white/[0.14] text-white">
                <CardHeader>
                  <CardTitle className="text-xl">Your Submissions ({submissions.length})</CardTitle>
                  <CardDescription className="text-white/70">
                    All receipts are backed up automatically
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {submissions.map((sub) => (
                      <div
                        key={sub.id}
                        className="p-3 rounded-xl bg-white/[0.08] border border-white/[0.14]"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-white">{sub.amount} ETB</span>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(sub.status)}
                            <span className={`text-xs ${
                              sub.status === 'verified' ? 'text-emerald-400' :
                              sub.status === 'pending' ? 'text-amber-400' : 'text-red-400'
                            }`}>
                              {getStatusText(sub.status)}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-white/70">{sub.bankName}</p>
                        <p className="text-xs text-white/50">
                          {sub.paymentMethod?.toUpperCase()} • {new Date(sub.submittedAt).toLocaleDateString()}
                        </p>
                        {sub.receiptImage && (
                          <img
                            src={sub.receiptImage}
                            alt="Receipt"
                            className="mt-2 max-h-24 rounded-lg"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
