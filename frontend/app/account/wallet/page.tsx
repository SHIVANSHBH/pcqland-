'use client';

import Link from 'next/link';
import { formatPrice, formatDate } from '@/lib/utils';
import { Wallet, ChevronRight, TrendingUp, Gift } from 'lucide-react';

const transactions = [
  { orderId: 'PCD202605201234', cashback: 500, amount: 3998, date: '2026-05-20', type: 'First Order Cashback' },
  { orderId: 'PCD202605151234', cashback: 12, amount: 599, date: '2026-05-15', type: '2% Prepaid Cashback' },
];

export default function WalletPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 text-sm text-pcd-muted mb-6">
        <Link href="/account" className="hover:text-primary">Account</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-pcd-text font-semibold">Wallet</span>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-primary to-blue-700 rounded-2xl p-6 text-white mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Wallet className="w-5 h-5" />
          <span className="text-sm font-medium text-blue-200">Wallet Balance</span>
        </div>
        <p className="text-4xl font-extrabold mb-1">₹512</p>
        <p className="text-xs text-blue-200">Total Cashback Earned: ₹512</p>
      </div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="w-4 h-4 text-amber-600" />
            <h4 className="text-sm font-bold text-amber-800">First Order Cashback</h4>
          </div>
          <p className="text-xs text-amber-700">Get 25% cashback (max ₹500) on your first order. Cashback is credited automatically.</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <h4 className="text-sm font-bold text-green-800">Prepaid Discount</h4>
          </div>
          <p className="text-xs text-green-700">Enjoy 2% special discount when you pay via prepaid card. Applied at checkout.</p>
        </div>
      </div>

      {/* Transactions */}
      <h3 className="text-sm font-bold text-pcd-text mb-4">Cashback History</h3>
      <div className="space-y-3">
        {transactions.map((tx) => (
          <div key={tx.orderId} className="bg-white border border-pcd-border rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-pcd-text">{tx.type}</p>
              <p className="text-xs text-pcd-muted">{tx.orderId} • {formatDate(tx.date)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-green-600">+₹{tx.cashback}</p>
              <p className="text-xs text-pcd-muted">on {formatPrice(tx.amount)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
