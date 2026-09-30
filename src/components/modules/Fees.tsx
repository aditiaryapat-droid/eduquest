import { useState } from 'react';
import { CreditCard, Receipt, Download, X, Loader2, CheckCircle2, Wallet, Building2, Smartphone } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import type { FeeCharge, PaymentRecord } from '@/types';

interface FeesProps {
  charges: FeeCharge[];
  payments: PaymentRecord[];
  onPayment: (amount: number, method: string) => void;
}

type PaymentMethod = 'upi' | 'card' | 'netbanking';

export default function Fees({ charges, payments, onPayment }: FeesProps) {
  const { showToast } = useToast();
  const { user } = useAuth();
  const [showPayModal, setShowPayModal] = useState(false);
  const [payAmount, setPayAmount] = useState(0);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('upi');
  const [upiApp, setUpiApp] = useState('Google Pay');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [bank, setBank] = useState('');
  const [processing, setProcessing] = useState(false);
  const [showReceipt, setShowReceipt] = useState<PaymentRecord | null>(null);

  const totalFee = charges.reduce((s, c) => s + c.amount, 0);
  const amountPaid = payments.reduce((s, p) => s + p.amount, 0);
  const outstanding = totalFee - amountPaid;

  const openPayModal = () => {
    setPayAmount(outstanding > 0 ? outstanding : 0);
    setPayMethod('upi');
    setUpiApp('Google Pay');
    setUpiId('');
    setCardNumber('');
    setCardName('');
    setCardExpiry('');
    setCardCvv('');
    setBank('');
    setShowPayModal(true);
  };

  const handleProceedPay = () => {
    if (payAmount <= 0) {
      showToast('Enter a valid amount', 'error');
      return;
    }
    if (payAmount > outstanding) {
      showToast('Amount exceeds outstanding balance', 'error');
      return;
    }

    if (payMethod === 'upi' && !upiId.trim()) {
      showToast('Please enter your UPI ID', 'error');
      return;
    }
    if (payMethod === 'card' && (!cardNumber.trim() || !cardName.trim() || !cardExpiry.trim() || !cardCvv.trim())) {
      showToast('Please fill all card details', 'error');
      return;
    }
    if (payMethod === 'netbanking' && !bank) {
      showToast('Please select a bank', 'error');
      return;
    }

    setProcessing(true);

    setTimeout(() => {
      const methodDesc =
        payMethod === 'upi' ? `UPI - ${upiApp}` :
        payMethod === 'card' ? 'Debit/Credit Card' :
        `Net Banking - ${bank}`;

      const transactionId = 'EDUQ' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + Math.floor(Math.random() * 1000).toString().padStart(3, '0');

      const newPayment: PaymentRecord = {
        id: 'p' + Math.random().toString(36).substring(2, 9),
        amount: payAmount,
        method: methodDesc,
        date: new Date().toISOString().slice(0, 10),
        transactionId,
      };

      onPayment(payAmount, methodDesc);
      setProcessing(false);
      setShowPayModal(false);
      setShowReceipt(newPayment);
      showToast(`Payment of ₹${payAmount.toLocaleString('en-IN')} successful!`, 'success');
    }, 2500);
  };

  const handleDownloadReceipt = (payment: PaymentRecord) => {
    const printWindow = window.open('', '_blank', 'width=600,height=700');
    if (!printWindow) {
      showToast('Please allow popups to download receipt', 'error');
      return;
    }

    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Fee Receipt - ${payment.transactionId}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Arial', sans-serif; padding: 40px; color: #1e293b; }
    .header { text-align: center; border-bottom: 3px solid #1e40af; padding-bottom: 20px; margin-bottom: 25px; }
    .logo { font-size: 24px; font-weight: bold; color: #1e40af; }
    .subtitle { font-size: 12px; color: #64748b; margin-top: 4px; }
    .receipt-title { font-size: 18px; font-weight: bold; margin-top: 12px; text-transform: uppercase; }
    .receipt-info { background: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
    .info-row:last-child { border-bottom: none; }
    .info-label { font-size: 13px; color: #64748b; font-weight: 600; }
    .info-value { font-size: 13px; color: #1e293b; font-weight: 700; }
    .amount-box { text-align: center; padding: 25px; background: linear-gradient(135deg, #1e40af, #4f46e5); border-radius: 12px; color: white; margin-bottom: 20px; }
    .amount-label { font-size: 13px; opacity: 0.8; text-transform: uppercase; letter-spacing: 1px; }
    .amount-value { font-size: 36px; font-weight: bold; margin-top: 5px; }
    .status { text-align: center; padding: 10px; background: #dcfce7; color: #059669; border-radius: 8px; font-weight: bold; margin-bottom: 20px; }
    .sign { margin-top: 50px; text-align: right; }
    .sign-line { border-top: 2px solid #1e293b; width: 200px; margin-left: auto; margin-bottom: 8px; }
    .sign-label { font-size: 12px; color: #64748b; }
    .footer { margin-top: 30px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">EDUQUEST ACADEMY</div>
    <div class="subtitle">Empower Your Learning Journey</div>
    <div class="receipt-title">Fee Payment Receipt</div>
  </div>
  <div class="receipt-info">
    <div class="info-row"><span class="info-label">Student Name</span><span class="info-value">${user?.name || 'N/A'}</span></div>
    <div class="info-row"><span class="info-label">Roll Number</span><span class="info-value">${user?.rollNo || 'N/A'}</span></div>
    <div class="info-row"><span class="info-label">Transaction ID</span><span class="info-value">${payment.transactionId}</span></div>
    <div class="info-row"><span class="info-label">Date</span><span class="info-value">${new Date(payment.date).toLocaleDateString('en-IN')}</span></div>
    <div class="info-row"><span class="info-label">Payment Method</span><span class="info-value">${payment.method}</span></div>
  </div>
  <div class="amount-box">
    <div class="amount-label">Amount Paid</div>
    <div class="amount-value">₹ ${payment.amount.toLocaleString('en-IN')}</div>
  </div>
  <div class="status">PAYMENT SUCCESSFUL</div>
  <div class="sign">
    <div class="sign-line"></div>
    <div class="sign-label">Accounts Department, EduQuest Academy</div>
  </div>
  <div class="footer">
    This is a computer-generated receipt.<br>
    Generated on ${new Date().toLocaleString('en-IN')}
  </div>
</body>
</html>`;

    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      showToast('Receipt opened for download', 'info');
    }, 500);
  };

  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').slice(0, 19);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1">Fee Payment Portal</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">All fees are in Indian Rupees (₹). Pay securely via UPI, Card, or Net Banking.</p>
      </div>

      {/* Fee Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <CreditCard className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Annual Fee</span>
          </div>
          <p className="text-3xl font-bold text-slate-800 dark:text-white">₹{totalFee.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Amount Paid</span>
          </div>
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">₹{amountPaid.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-400">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Outstanding Balance</span>
          </div>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">₹{outstanding.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Fee Breakdown */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Fee Breakdown</h3>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {charges.map((charge) => (
            <div key={charge.label} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{charge.label}</span>
              <span className="text-sm font-bold text-slate-800 dark:text-white">₹{charge.amount.toLocaleString('en-IN')}</span>
            </div>
          ))}
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 font-bold">
            <span className="text-sm text-slate-800 dark:text-white">Total</span>
            <span className="text-base text-slate-800 dark:text-white">₹{totalFee.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Pay button */}
      {outstanding > 0 ? (
        <button
          onClick={openPayModal}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
        >
          <CreditCard className="h-5 w-5" />
          Pay Outstanding Fee (₹{outstanding.toLocaleString('en-IN')})
        </button>
      ) : (
        <div className="flex items-center gap-3 p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          <div>
            <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">All fees paid!</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">You have no outstanding dues.</p>
          </div>
        </div>
      )}

      {/* Payment History */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="flex items-center gap-2 p-5 border-b border-slate-200 dark:border-slate-800">
          <Receipt className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Payment History</h3>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {payments.map((payment) => (
            <div key={payment.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 dark:text-white">₹{payment.amount.toLocaleString('en-IN')}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{payment.method} · {new Date(payment.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                <p className="text-xs text-slate-400 font-mono">Txn: {payment.transactionId}</p>
              </div>
              <button
                onClick={() => handleDownloadReceipt(payment)}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors flex-shrink-0"
                title="Download Receipt"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !processing && setShowPayModal(false)} />
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            {processing ? (
              <div className="p-12 text-center">
                <Loader2 className="h-16 w-16 text-blue-500 animate-spin mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Processing Payment</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Please wait while we process your payment of ₹{payAmount.toLocaleString('en-IN')}...</p>
                <div className="mt-4 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full progress-shimmer animate-shimmer rounded-full" style={{ width: '100%' }} />
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">Pay Outstanding Fee</h3>
                  <button onClick={() => setShowPayModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="p-5 space-y-5">
                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Amount (₹)</label>
                    <input
                      type="number"
                      value={payAmount || ''}
                      onChange={(e) => setPayAmount(Number(e.target.value))}
                      max={outstanding}
                      placeholder="Enter amount"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-slate-400 mt-1">Outstanding: ₹{outstanding.toLocaleString('en-IN')}</p>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Payment Method</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setPayMethod('upi')}
                        className={`flex flex-col items-center gap-1 py-3 rounded-xl border-2 transition-all ${payMethod === 'upi' ? 'border-blue-500 bg-blue-500/5' : 'border-slate-200 dark:border-slate-700'}`}
                      >
                        <Smartphone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">UPI</span>
                      </button>
                      <button
                        onClick={() => setPayMethod('card')}
                        className={`flex flex-col items-center gap-1 py-3 rounded-xl border-2 transition-all ${payMethod === 'card' ? 'border-blue-500 bg-blue-500/5' : 'border-slate-200 dark:border-slate-700'}`}
                      >
                        <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Card</span>
                      </button>
                      <button
                        onClick={() => setPayMethod('netbanking')}
                        className={`flex flex-col items-center gap-1 py-3 rounded-xl border-2 transition-all ${payMethod === 'netbanking' ? 'border-blue-500 bg-blue-500/5' : 'border-slate-200 dark:border-slate-700'}`}
                      >
                        <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Net Banking</span>
                      </button>
                    </div>
                  </div>

                  {/* UPI */}
                  {payMethod === 'upi' && (
                    <div className="space-y-4 animate-fade-in">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select UPI App</label>
                        <div className="grid grid-cols-3 gap-2">
                          {['Google Pay', 'PhonePe', 'Paytm'].map((app) => (
                            <button
                              key={app}
                              onClick={() => setUpiApp(app)}
                              className={`py-2.5 rounded-xl border-2 text-xs font-medium transition-all ${upiApp === app ? 'border-blue-500 bg-blue-500/5 text-blue-600 dark:text-blue-400' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}
                            >
                              {app}
                            </button>
                          ))}
                        </div>
                      </div>
                      {/* QR Code placeholder */}
                      <div className="flex flex-col items-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                        <div className="w-32 h-32 bg-white rounded-xl border-4 border-slate-200 dark:border-slate-700 flex items-center justify-center mb-2">
                          {/* Simple QR-like pattern */}
                          <svg viewBox="0 0 100 100" className="w-full h-full p-2">
                            <rect width="100" height="100" fill="white" />
                            {Array.from({ length: 12 }).map((_, i) =>
                              Array.from({ length: 12 }).map((_, j) => {
                                const fill = (i + j + i * j) % 3 === 0;
                                return fill ? <rect key={`${i}-${j}`} x={i * 8 + 2} y={j * 8 + 2} width="7" height="7" fill="#1e293b" /> : null;
                              })
                            )}
                            <rect x="2" y="2" width="22" height="22" fill="none" stroke="#1e293b" strokeWidth="3" />
                            <rect x="76" y="2" width="22" height="22" fill="none" stroke="#1e293b" strokeWidth="3" />
                            <rect x="2" y="76" width="22" height="22" fill="none" stroke="#1e293b" strokeWidth="3" />
                          </svg>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Scan QR or enter UPI ID below</p>
                      </div>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@upi"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}

                  {/* Card */}
                  {payMethod === 'card' && (
                    <div className="space-y-4 animate-fade-in">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        placeholder="Card Number (1234 5678 9012 3456)"
                        maxLength={19}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Name on Card"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/, '$1/').slice(0, 5))}
                          placeholder="MM/YY"
                          className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                          placeholder="CVV"
                          className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* Net Banking */}
                  {payMethod === 'netbanking' && (
                    <div className="space-y-3 animate-fade-in">
                      <select
                        value={bank}
                        onChange={(e) => setBank(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select your bank</option>
                        <option value="State Bank of India">State Bank of India</option>
                        <option value="HDFC Bank">HDFC Bank</option>
                        <option value="ICICI Bank">ICICI Bank</option>
                        <option value="Axis Bank">Axis Bank</option>
                        <option value="Punjab National Bank">Punjab National Bank</option>
                        <option value="Bank of Baroda">Bank of Baroda</option>
                        <option value="Canara Bank">Canara Bank</option>
                        <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                      </select>
                    </div>
                  )}

                  <button
                    onClick={handleProceedPay}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                  >
                    Proceed to Pay ₹{payAmount.toLocaleString('en-IN')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceipt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowReceipt(null)} />
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full animate-scale-in">
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Payment Successful!</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Your payment of ₹{showReceipt.amount.toLocaleString('en-IN')} has been processed successfully.</p>
              <div className="text-left bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Transaction ID</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-white">{showReceipt.transactionId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Method</span>
                  <span className="font-semibold text-slate-800 dark:text-white">{showReceipt.method}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Date</span>
                  <span className="font-semibold text-slate-800 dark:text-white">{new Date(showReceipt.date).toLocaleDateString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Amount</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{showReceipt.amount.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDownloadReceipt(showReceipt)}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  <Download className="h-5 w-5" /> Download Receipt
                </button>
                <button
                  onClick={() => setShowReceipt(null)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
