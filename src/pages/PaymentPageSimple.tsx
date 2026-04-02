import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TopBar from '@/components/TopBar';
import StarField from '@/components/StarField';

const PaymentPage = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');

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

        <div className="bg-white/[0.08] border border-white/[0.14] rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Payment Form</h2>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full p-3 bg-white/[0.08] border border-white/[0.14] rounded-lg text-white placeholder:text-white/50"
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
