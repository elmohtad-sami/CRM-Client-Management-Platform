import React, { useMemo, useState } from 'react';
import { ArrowDownUpIcon } from '@animateicons/react/lucide';

export default function PaymentHistoryTable({ payments = [], onStatusChange }) {
  const [sort, setSort] = useState({ key: 'date', direction: 'desc' });

  const sortedPayments = useMemo(() => {
    const arr = [...payments];
    arr.sort((a, b) => {
      let left = a[sort.key];
      let right = b[sort.key];

      if (sort.key === 'date') {
        left = new Date(left).getTime();
        right = new Date(right).getTime();
      }

      if (left < right) return sort.direction === 'asc' ? -1 : 1;
      if (left > right) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  }, [payments, sort]);

  const handleSort = (key) => {
    setSort((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'reference', label: 'Reference' },
    { key: 'method', label: 'Method' },
    { key: 'amount', label: 'Amount' },
    { key: 'status', label: 'Status' }
  ];

  const toggleStatus = (row) => {
    const nextStatus = row.status === 'Paid' ? 'Pending' : 'Paid';
    onStatusChange?.(row.id, { status: nextStatus, paymentStatus: nextStatus });
  };

  return (
    <section className="bg-white/[0.06] backdrop-blur-2xl border border-white/[0.12] rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.03)] p-6 transition-all duration-300">
      <h2 className="text-lg font-bold text-white">Payment History</h2>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-160 text-sm text-left">
          <thead className="bg-white/[0.04] text-white/50 border-b border-white/[0.08]">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 text-xs font-semibold uppercase tracking-wider">
                  <button
                    onClick={() => handleSort(column.key)}
                    className="inline-flex items-center gap-1 hover:text-white transition-colors"
                  >
                    {column.label}
                    <ArrowDownUpIcon size={14} />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {sortedPayments.map((row) => (
              <tr key={row.id} className="hover:bg-white/[0.03] transition-colors">
                <td className="px-4 py-3 text-white/70">{new Date(row.date).toLocaleDateString()}</td>
                <td className="px-4 py-3 font-semibold text-white">{row.reference}</td>
                <td className="px-4 py-3 text-white/70">{row.method}</td>
                <td className="px-4 py-3 font-semibold text-white">{row.amount.toLocaleString()} MAD</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => toggleStatus(row)}
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold transition-colors                     ${row.status === 'Paid' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20' : row.status === 'Overdue' ? 'bg-rose-500/15 text-rose-300 border-rose-500/30 hover:bg-rose-500/20' : 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'}`}
                  >
                    {row.status}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
