import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, CreditCard, CheckCircle, Clock, ArrowLeft, Image as ImageIcon, X, Download, Database, AlertCircle, Shield, Smartphone, Landmark, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import TopBar from '@/components/TopBar';
import StarField from '@/components/StarField';

interface PaymentSubmission {
  id: string;
  amount: string;
  bankName: string;
  accountNumber: string;
  paymentMethod: 'cbe' | 'telebirr' | 'awash' | 'mpesa';
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
        localStorage.removeItem('paymentBackup_old');
        try {
          localStorage.setItem(key, JSON.stringify(value));
          return true;
        } catch (e2) {
          console.error('Still failed after cleanup:', e2);
        }
      }
      return false;
    }
  },
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`Failed to remove ${key} from localStorage:`, e);
    }
  }
};

// Generate simple checksum for data integrity
const generateChecksum = (data: any): string => {
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
};

// Compress image before storage
const compressImage = (dataUrl: string, maxWidth: number = 1200, quality: number = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      const compressed = canvas.toDataURL('image/jpeg', quality);
      resolve(compressed);
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
};

// Validate submission data
const validateSubmission = (sub: PaymentSubmission): string[] => {
  const errors: string[] = [];
  if (!sub.amount || isNaN(Number(sub.amount)) || Number(sub.amount) <= 0) {
    errors.push('Invalid amount');
  }
  if (!sub.bankName || sub.bankName.trim().length < 2) {
    errors.push('Invalid bank name');
  }
  if (!sub.accountNumber || sub.accountNumber.trim().length < 5) {
    errors.push('Invalid account number');
  }
  if (!sub.transactionRef || sub.transactionRef.trim().length < 3) {
    errors.push('Invalid transaction reference');
  }
  return errors;
};

const PaymentPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const autoSaveInterval = useRef<NodeJS.Timeout | null>(null);
  
  const [amount, setAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cbe' | 'telebirr' | 'awash' | 'mpesa'>('cbe');
  const [storageStats, setStorageStats] = useState({ used: 0, total: 0, items: 0 });
  const [isStorageFull, setIsStorageFull] = useState(false);

  // Load submissions with validation and recovery
  const loadSubmissions = useCallback((): PaymentSubmission[] => {
    try {
      const data = safeStorage.get('paymentSubmissions');
      if (!data || !Array.isArray(data)) {
        const backup = safeStorage.get('paymentSubmissions_backup');
        if (backup && Array.isArray(backup)) {
          // Show toast after component mounts
          setTimeout(() => {
            toast({
              title: "Data Recovered",
              description: "Restored from backup successfully.",
            });
          }, 100);
          return backup;
        }
        return [];
      }
      return data;
    } catch (e) {
      console.error('Error loading submissions:', e);
      return [];
    }
  }, [toast]);

  const [submissions, setSubmissions] = useState<PaymentSubmission[]>([]);

  // Load submissions on mount
  useEffect(() => {
    const loaded = loadSubmissions();
    setSubmissions(loaded);
  }, [loadSubmissions]);

  // Calculate storage usage
  const updateStorageStats = useCallback(() => {
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
    const total = 5 * 1024 * 1024;
    setStorageStats({ used, total, items });
    setIsStorageFull(used > total * 0.9);
  }, []);

  useEffect(() => {
    updateStorageStats();
  }, [submissions, updateStorageStats]);

  // Auto-save form data as draft
  useEffect(() => {
    const saveDraft = () => {
      const draft = { amount, bankName, accountNumber, transactionRef };
      safeStorage.set('paymentDraft', draft);
    };

    autoSaveInterval.current = setInterval(saveDraft, 30000);
    return () => {
      if (autoSaveInterval.current) {
        clearInterval(autoSaveInterval.current);
      }
    };
  }, [amount, bankName, accountNumber, transactionRef]);

  // Load draft on mount
  useEffect(() => {
    const draft = safeStorage.get('paymentDraft');
    if (draft) {
      setAmount(draft.amount || '');
      setBankName(draft.bankName || '');
      setAccountNumber(draft.accountNumber || '');
      setTransactionRef(draft.transactionRef || '');
      setPaymentMethod(draft.paymentMethod || 'cbe');
    }
  }, []);

  // Create backup before any major operation
  const createBackup = useCallback((data: PaymentSubmission[]) => {
    const backup: StorageBackup = {
      timestamp: new Date().toISOString(),
      data,
      checksum: generateChecksum(data)
    };
    safeStorage.set('paymentSubmissions_backup', backup);
    safeStorage.set('paymentBackup_timestamp', new Date().toISOString());
  }, []);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 5MB.",
        variant: "destructive",
      });
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const originalData = reader.result as string;
        
        toast({
          title: "Processing...",
          description: "Compressing receipt image...",
        });
        
        const compressed = await compressImage(originalData, 1200, 0.7);
        
        const originalSize = originalData.length;
        const compressedSize = compressed.length;
        
        if (compressedSize < originalSize * 0.9) {
          setReceiptImage(compressed);
          toast({
            title: "Image optimized",
            description: `Reduced from ${(originalSize / 1024).toFixed(1)}KB to ${(compressedSize / 1024).toFixed(1)}KB`,
          });
        } else {
          setReceiptImage(originalData);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: "Image processing failed",
        description: "Please try a smaller image.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveImage = () => {
    setReceiptImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !bankName || !accountNumber || !transactionRef) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
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
      toast({
        title: "Validation Error",
        description: errors.join(', '),
        variant: "destructive",
      });
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
      
      toast({
        title: "Payment Submitted Successfully",
        description: "Your receipt has been securely saved and is pending verification.",
      });

      // Clear draft
      safeStorage.remove('paymentDraft');

      // Reset form
      setAmount('');
      setBankName('');
      setAccountNumber('');
      setTransactionRef('');
      setReceiptImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } else {
      toast({
        title: "Save Failed",
        description: "Unable to save your submission. Storage may be full. Please export your data.",
        variant: "destructive",
      });
    }

    setIsSubmitting(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-emerald-400" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-400" />;
      default:
        return <X className="h-5 w-5 text-red-400" />;
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
    
    toast({
      title: "Data Exported",
      description: "Your receipts have been downloaded as a backup file.",
    });
  };

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
            toast({
              title: "Import Successful",
              description: `Imported ${newItems.length} new receipts.`,
            });
          } else {
            throw new Error('Failed to save imported data');
          }
        } else {
          throw new Error('Invalid file format');
        }
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Could not parse the backup file.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

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
          {/* Submission Form */}
          <Card className="bg-white/[0.08] border-white/[0.14] text-white">
            <CardHeader>
              <CardTitle className="text-xl">Submit Payment Receipt</CardTitle>
              <CardDescription className="text-white/70">
                Fill in your payment details and upload the receipt
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-white">Amount Paid (ETB)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="e.g., 500"
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
                    placeholder="e.g., Commercial Bank of Ethiopia"
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
                    placeholder="Your bank account number"
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
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'cbe', label: 'CBE', icon: Landmark },
                      { id: 'telebirr', label: 'Telebirr', icon: Smartphone },
                      { id: 'awash', label: 'Awash', icon: Landmark },
                      { id: 'mpesa', label: 'M-Pesa', icon: Wallet },
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

                <div className="space-y-2">
                  <Label className="text-white">Receipt Screenshot</Label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/[0.2] rounded-xl p-6 text-center cursor-pointer hover:border-white/[0.4] hover:bg-white/[0.04] transition-colors"
                  >
                    {receiptImage ? (
                      <div className="relative">
                        <img
                          src={receiptImage}
                          alt="Receipt preview"
                          className="max-h-48 mx-auto rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage();
                          }}
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <ImageIcon className="h-10 w-10 text-white/50 mb-2" />
                        <p className="text-sm text-white/70">Click to upload receipt</p>
                        <p className="text-xs text-white/50 mt-1">JPG, PNG (auto-compressed)</p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
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
                  {isSubmitting ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Submit Payment
                    </>
                  )}
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
                  <TabsList className="grid grid-cols-4 bg-white/[0.08] mb-4">
                    <TabsTrigger value="cbe" className="text-white data-[state=active]:bg-white/20">
                      <Landmark className="h-4 w-4 mr-1" />
                      CBE
                    </TabsTrigger>
                    <TabsTrigger value="telebirr" className="text-white data-[state=active]:bg-white/20">
                      <Smartphone className="h-4 w-4 mr-1" />
                      Telebirr
                    </TabsTrigger>
                    <TabsTrigger value="awash" className="text-white data-[state=active]:bg-white/20">
                      <Landmark className="h-4 w-4 mr-1" />
                      Awash
                    </TabsTrigger>
                    <TabsTrigger value="mpesa" className="text-white data-[state=active]:bg-white/20">
                      <Wallet className="h-4 w-4 mr-1" />
                      M-Pesa
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="cbe" className="space-y-3">
                    <div className="p-3 rounded-xl bg-white/[0.08] border border-white/[0.14]">
                      <p className="text-xs text-white/70">Bank</p>
                      <p className="font-semibold">Commercial Bank of Ethiopia</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.08] border border-white/[0.14]">
                      <p className="text-xs text-white/70">Account</p>
                      <p className="font-semibold">1000123456789</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.08] border border-white/[0.14]">
                      <p className="text-xs text-white/70">Holder</p>
                      <p className="font-semibold">Success Education PLC</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="telebirr" className="space-y-3">
                    <div className="p-3 rounded-xl bg-white/[0.08] border border-white/[0.14]">
                      <p className="text-xs text-white/70">Merchant Name</p>
                      <p className="font-semibold">Success Education</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.08] border border-white/[0.14]">
                      <p className="text-xs text-white/70">Merchant Code</p>
                      <p className="font-semibold">123456</p>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                      <p className="text-xs text-emerald-400">USSD Code</p>
                      <p className="font-semibold text-emerald-400">*127*123456*{amount || 'AMOUNT'}#</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="awash" className="space-y-3">
                    <div className="p-3 rounded-xl bg-white/[0.08] border border-white/[0.14]">
                      <p className="text-xs text-white/70">Bank</p>
                      <p className="font-semibold">Awash Bank</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.08] border border-white/[0.14]">
                      <p className="text-xs text-white/70">Account</p>
                      <p className="font-semibold">0123456789012</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.08] border border-white/[0.14]">
                      <p className="text-xs text-white/70">Holder</p>
                      <p className="font-semibold">Success Education PLC</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="mpesa" className="space-y-3">
                    <div className="p-3 rounded-xl bg-white/[0.08] border border-white/[0.14]">
                      <p className="text-xs text-white/70">Business Name</p>
                      <p className="font-semibold">Success Education</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.08] border border-white/[0.14]">
                      <p className="text-xs text-white/70">Till Number</p>
                      <p className="font-semibold">654321</p>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                      <p className="text-xs text-emerald-400">Paybill</p>
                      <p className="font-semibold text-emerald-400">Business No: 654321</p>
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
                <div className="relative">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10"
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
                  <CardTitle className="text-xl">Your Submissions</CardTitle>
                  <CardDescription className="text-white/70">
                    Recent payment submissions and their status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
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
