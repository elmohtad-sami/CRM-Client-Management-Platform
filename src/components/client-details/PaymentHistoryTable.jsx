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
    <section className="bg-[var(--c-surface)] backdrop-blur-2xl border border-[var(--c-border-md)] rounded-2xl shadow-[var(--c-glow)] p-6 transition-all duration-300">
      <h2 className="text-lg font-bold text-[var(--c-text)]">Payment History</h2>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-160 text-sm text-left">
          <thead className="bg-[var(--c-elevated)] text-[var(--c-text-3)] border-b border-[var(--c-border)]">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 text-xs font-semibold uppercase tracking-wider">
                  <button
                    onClick={() => handleSort(column.key)}
                    className="inline-flex items-center gap-1 hover:text-[var(--c-text)] transition-colors"
                  >
                    {column.label}
                    <ArrowDownUpIcon size={14} />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--c-border)]">
            {sortedPayments.map((row) => (
              <tr key={row.id} className="hover:bg-[var(--c-elevated)] transition-colors">
                <td className="px-4 py-3 text-[var(--c-text-2)]">{new Date(row.date).toLocaleDateString()}</td>
                <td className="px-4 py-3 font-semibold text-[var(--c-text)]">{row.reference}</td>
                <td className="px-4 py-3 text-[var(--c-text-2)]">{row.method}</td>
                <td className="px-4 py-3 font-semibold text-[var(--c-text)]">{row.amount.toLocaleString()} MAD</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => toggleStatus(row)}
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold transition-colors                     ${row.status === 'Paid' ? 'bg-[var(--c-positive-bg)] text-[var(--c-positive)] border-[var(--c-positive-border)] hover:bg-[var(--c-positive-hover)]' : row.status === 'Overdue' ? 'bg-[var(--c-danger-bg)] text-[var(--c-danger)] border-[var(--c-danger-border)] hover:bg-[var(--c-danger-hover)]' : 'bg-[var(--c-warning-bg)] text-[var(--c-warning)] border-[var(--c-warning-border)] hover:bg-[var(--c-warning-hover)]'}`}
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
