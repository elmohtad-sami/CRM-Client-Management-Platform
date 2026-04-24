import React, { useMemo, useState } from 'react';
import { ArrowUpDown } from 'lucide-react';

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
    <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm transition-all duration-300">
      <h2 className="text-lg font-bold text-slate-900">Payment History</h2>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-160 text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 text-xs font-bold uppercase tracking-wider">
                  <button
                    onClick={() => handleSort(column.key)}
                    className="inline-flex items-center gap-1 hover:text-slate-900 transition-colors"
                  >
                    {column.label}
                    <ArrowUpDown size={14} />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedPayments.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 text-slate-700">{new Date(row.date).toLocaleDateString()}</td>
                <td className="px-4 py-3 font-semibold text-slate-900">{row.reference}</td>
                <td className="px-4 py-3 text-slate-700">{row.method}</td>
                <td className="px-4 py-3 font-semibold text-indigo-600">{row.amount.toLocaleString()} MAD</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => toggleStatus(row)}
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold transition-colors ${row.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : row.status === 'Overdue' ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100' : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'}`}
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
