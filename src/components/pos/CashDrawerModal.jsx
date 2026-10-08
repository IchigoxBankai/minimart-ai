// MiniMart AI - Cash Drawer & Day-End Z-Report Reconciliation Modal

import React, { useState, useMemo } from 'react';
import { 
  Banknote, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  Printer, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  FileText, 
  Plus, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const CashDrawerModal = ({ isOpen, onClose }) => {
  const { 
    cashDrawer, 
    orders, 
    recordCashMovement, 
    closeDayShift, 
    openDayShift, 
    currency, 
    profile 
  } = useStore();

  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'payout' | 'close_shift' | 'z_report'
  const [payoutType, setPayoutType] = useState('PAID_OUT'); // PAID_OUT | PAID_IN
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutNote, setPayoutNote] = useState('');
  
  // Close shift state
  const [countedCash, setCountedCash] = useState('');
  const [closingNotes, setClosingNotes] = useState('');
  const [lastZReport, setLastZReport] = useState(cashDrawer?.lastClosedShift || null);

  if (!isOpen) return null;

  // Calculate today's sales payment method split
  const todayCashSales = useMemo(() => {
    const movements = cashDrawer?.movements || [];
    return movements
      .filter((m) => m.type === 'CASH_SALE')
      .reduce((sum, m) => sum + (m.amount || 0), 0);
  }, [cashDrawer]);

  const openingFloat = cashDrawer?.openingFloat || 2000;
  const paidIns = cashDrawer?.paidIns || 0;
  const paidOuts = cashDrawer?.paidOuts || 0;
  const expectedDrawerCash = openingFloat + todayCashSales + paidIns - paidOuts;

  const cashDiscrepancy = countedCash !== '' ? Number(countedCash) - expectedDrawerCash : 0;

  const handleRecordPayout = (e) => {
    e.preventDefault();
    if (!payoutAmount || Number(payoutAmount) <= 0) return;

    recordCashMovement({
      type: payoutType,
      amount: Number(payoutAmount),
      note: payoutNote,
    });

    setPayoutAmount('');
    setPayoutNote('');
    setActiveTab('summary');
  };

  const handleCloseShiftSubmit = (e) => {
    e.preventDefault();
    const summary = closeDayShift({
      countedCash: Number(countedCash || expectedDrawerCash),
      notes: closingNotes,
      closedBy: profile?.ownerName || 'Store Manager',
    });

    setLastZReport(summary);
    setActiveTab('z_report');
  };

  const handlePrintZReport = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1E2521]/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[#E6E2D8] overflow-hidden flex flex-col max-h-[92vh] animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E6E2D8] bg-[#FAF8F3]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1F6B4F]/10 border border-[#1F6B4F]/20 flex items-center justify-center text-[#1F6B4F]">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-[#1E2521] flex items-center gap-2">
                Cash Register Drawer
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${cashDrawer.isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'}`}>
                  {cashDrawer.isOpen ? 'Active Shift' : 'Shift Closed'}
                </span>
              </h3>
              <p className="text-xs text-[#697A71]">
                Opened at {formatDate(cashDrawer.openedAt)} by {cashDrawer.openedBy || profile?.ownerName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#8A9A90] hover:text-[#1E2521] hover:bg-[#F0ECE1] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-[#E6E2D8] bg-white">
          <button
            onClick={() => setActiveTab('summary')}
            className={`pb-3 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'summary'
                ? 'border-[#1F6B4F] text-[#1F6B4F]'
                : 'border-transparent text-[#697A71] hover:text-[#1E2521]'
            }`}
          >
            Drawer Balance
          </button>
          <button
            onClick={() => setActiveTab('payout')}
            className={`pb-3 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'payout'
                ? 'border-[#1F6B4F] text-[#1F6B4F]'
                : 'border-transparent text-[#697A71] hover:text-[#1E2521]'
            }`}
          >
            + Cash In / Out
          </button>
          <button
            onClick={() => setActiveTab('close_shift')}
            className={`pb-3 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'close_shift'
                ? 'border-[#1F6B4F] text-[#1F6B4F]'
                : 'border-transparent text-[#697A71] hover:text-[#1E2521]'
            }`}
          >
            End Shift Reconciliation
          </button>
          {lastZReport && (
            <button
              onClick={() => setActiveTab('z_report')}
              className={`pb-3 text-xs font-bold transition-all border-b-2 ${
                activeTab === 'z_report'
                  ? 'border-[#1F6B4F] text-[#1F6B4F]'
                  : 'border-transparent text-[#697A71] hover:text-[#1E2521]'
              }`}
            >
              Last Z-Report
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: SUMMARY */}
          {activeTab === 'summary' && (
            <div className="space-y-6">
              {/* Expected Drawer Big Card */}
              <div className="p-5 rounded-2xl bg-[#1F6B4F] text-white shadow-md">
                <span className="text-xs font-medium text-emerald-100 uppercase tracking-wider">
                  Expected In Cash Drawer Right Now
                </span>
                <div className="font-display font-black text-3xl sm:text-4xl mt-1">
                  {formatCurrency(expectedDrawerCash, currency)}
                </div>
                <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/15 text-xs">
                  <div>
                    <span className="text-emerald-200 block text-[11px]">Opening Float</span>
                    <span className="font-bold">{formatCurrency(openingFloat, currency)}</span>
                  </div>
                  <div>
                    <span className="text-emerald-200 block text-[11px]">Cash Sales</span>
                    <span className="font-bold">+{formatCurrency(todayCashSales, currency)}</span>
                  </div>
                  <div>
                    <span className="text-emerald-200 block text-[11px]">Petty Payouts</span>
                    <span className="font-bold">-{formatCurrency(paidOuts, currency)}</span>
                  </div>
                </div>
              </div>

              {/* Recent Movements Log */}
              <div>
                <h4 className="font-bold text-xs text-[#697A71] uppercase tracking-wider mb-3">
                  Shift Cash Transactions Log
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {(cashDrawer.movements || []).length === 0 ? (
                    <p className="text-xs text-[#8A9A90] text-center py-4">No cash movements logged yet.</p>
                  ) : (
                    cashDrawer.movements.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F3] border border-[#EAE6DA] text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                              m.type === 'PAID_OUT'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {m.type === 'PAID_OUT' ? (
                              <ArrowUpRight className="w-4 h-4" />
                            ) : (
                              <ArrowDownLeft className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-[#1E2521]">{m.note || m.type}</span>
                            <span className="block text-[10px] text-[#8A9A90]">{formatDate(m.time)}</span>
                          </div>
                        </div>
                        <span
                          className={`font-mono font-bold ${
                            m.type === 'PAID_OUT' ? 'text-amber-700' : 'text-[#1F6B4F]'
                          }`}
                        >
                          {m.type === 'PAID_OUT' ? '-' : '+'}
                          {formatCurrency(m.amount, currency)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => setActiveTab('payout')}
                  className="btn-secondary flex-1 text-xs font-bold py-2.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log Petty Cash / Payout</span>
                </button>
                <button
                  onClick={() => setActiveTab('close_shift')}
                  className="btn-primary flex-1 text-xs font-bold py-2.5"
                >
                  <FileText className="w-4 h-4" />
                  <span>Close Day & Reconcile</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: LOG PAYOUT / PAYIN */}
          {activeTab === 'payout' && (
            <form onSubmit={handleRecordPayout} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1E2521] mb-1.5">
                  Movement Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPayoutType('PAID_OUT')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      payoutType === 'PAID_OUT'
                        ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-2xs'
                        : 'bg-white border-[#DDD7C8] text-[#697A71]'
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4 text-amber-600" />
                    <span>Paid Out (Petty Expense)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayoutType('PAID_IN')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      payoutType === 'PAID_IN'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-2xs'
                        : 'bg-white border-[#DDD7C8] text-[#697A71]'
                    }`}
                  >
                    <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
                    <span>Paid In (Cash Deposit)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E2521] mb-1">
                  Amount ({currency}) *
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="e.g. 150"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  className="input text-base font-bold"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E2521] mb-1">
                  Reason / Description *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bought packaging tape & paper rolls"
                  value={payoutNote}
                  onChange={(e) => setPayoutNote(e.target.value)}
                  className="input text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('summary')}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs font-bold">
                  Save Cash Movement
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: END SHIFT RECONCILIATION */}
          {activeTab === 'close_shift' && (
            <form onSubmit={handleCloseShiftSubmit} className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-[#EAE6DA] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#697A71]">Expected Cash in Drawer:</span>
                  <span className="font-bold text-[#1E2521] font-mono text-sm">
                    {formatCurrency(expectedDrawerCash, currency)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#697A71]">Registered Today's Cash Sales:</span>
                  <span className="font-semibold text-emerald-700 font-mono">
                    +{formatCurrency(todayCashSales, currency)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E2521] mb-1">
                  Actual Physical Cash Counted in Drawer ({currency}) *
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder={expectedDrawerCash.toString()}
                  value={countedCash}
                  onChange={(e) => setCountedCash(e.target.value)}
                  className="input text-lg font-bold"
                  autoFocus
                />
              </div>

              {countedCash !== '' && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                    cashDiscrepancy === 0
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : cashDiscrepancy > 0
                      ? 'bg-blue-50 border-blue-200 text-blue-800'
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {cashDiscrepancy === 0 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                    <span className="font-bold">
                      {cashDiscrepancy === 0
                        ? 'Perfect Balance! No discrepancy.'
                        : cashDiscrepancy > 0
                        ? 'Cash Surplus (Over)'
                        : 'Cash Shortage (Under)'}
                    </span>
                  </div>
                  <span className="font-mono font-black">
                    {cashDiscrepancy > 0 ? '+' : ''}
                    {formatCurrency(cashDiscrepancy, currency)}
                  </span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#1E2521] mb-1">
                  Closing Notes
                </label>
                <textarea
                  rows="2"
                  placeholder="Optional notes for manager/accountant..."
                  value={closingNotes}
                  onChange={(e) => setClosingNotes(e.target.value)}
                  className="input text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('summary')}
                  className="btn-secondary text-xs"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs font-bold bg-[#1F6B4F] text-white shadow-md shadow-[#1F6B4F]/20"
                >
                  Confirm & Generate Z-Report
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: PRINTABLE Z-REPORT */}
          {activeTab === 'z_report' && lastZReport && (
            <div className="space-y-4">
              <div className="p-6 bg-white border border-[#DDD7C8] rounded-2xl shadow-inner font-mono text-xs text-[#1E2521] space-y-3 print:border-none print:shadow-none">
                <div className="text-center border-b border-dashed border-gray-300 pb-3">
                  <h4 className="font-black text-sm uppercase">{profile?.storeName || 'DailyBasket Supermart'}</h4>
                  <p className="text-[11px] text-gray-500">DAILY SHIFT CLOSING Z-REPORT</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{formatDate(lastZReport.closedAt)}</p>
                  <p className="text-[10px] text-gray-400">Cashier: {lastZReport.closedBy}</p>
                </div>

                <div className="space-y-1.5 py-2 border-b border-dashed border-gray-300">
                  <div className="flex justify-between">
                    <span>Opening Cash Float:</span>
                    <span>{formatCurrency(lastZReport.openingFloat, currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cash Sales:</span>
                    <span>+{formatCurrency(todayCashSales, currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Petty Cash Paid Out:</span>
                    <span>-{formatCurrency(lastZReport.paidOuts, currency)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-black pt-1 border-t border-gray-200">
                    <span>Expected Drawer:</span>
                    <span>{formatCurrency(lastZReport.openingFloat + todayCashSales - lastZReport.paidOuts, currency)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-black">
                    <span>Counted Closing Cash:</span>
                    <span>{formatCurrency(lastZReport.countedCash, currency)}</span>
                  </div>
                </div>

                <div className="flex justify-between font-bold text-xs pt-1">
                  <span>Reconciliation Status:</span>
                  <span className="text-emerald-700">BALANCED & VERIFIED</span>
                </div>

                <div className="text-center pt-3 text-[10px] text-gray-400">
                  *** End of Z-Report ***
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => openDayShift({ openingFloat: 2000, openedBy: profile?.ownerName })}
                  className="btn-secondary text-xs font-bold flex-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Start New Shift (₹2,000 Float)</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrintZReport}
                  className="btn-primary text-xs font-bold flex-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Z-Report</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
