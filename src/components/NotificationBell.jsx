import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import { useClients } from '../context/ClientsContext';

const WINDOW_MS = 48 * 60 * 60 * 1000;

export default function NotificationBell() {
  const { invoices } = useClients();
  const [isOpen, setIsOpen] = useState(false);
  const [readKeys, setReadKeys] = useState([]);
  const [pulse, setPulse] = useState(false);
  const [now] = useState(() => Date.now());
  const rootRef = useRef(null);
  const previousCountRef = useRef(0);

  const notifications = useMemo(() => {
    return invoices
      .filter((invoice) => {
        const dueDate = invoice?.dueDate ? new Date(invoice.dueDate).getTime() : NaN;
        if (Number.isNaN(dueDate)) return false;

        const pending = invoice.status === 'Pending' || invoice.status === 'En attente' || invoice.paymentStatus === 'Pending';
        const paid = invoice.status === 'Paid' || invoice.status === 'Payée' || invoice.paymentStatus === 'Paid';
        const diff = dueDate - now;

        return pending && !paid && diff >= 0 && diff <= WINDOW_MS;
      })
      .map((invoice) => {
        const dueDate = new Date(invoice.dueDate);
        const daysLeft = Math.max(1, Math.ceil((dueDate.getTime() - now) / (24 * 60 * 60 * 1000)));

        return {
          key: `${invoice.id}-${invoice.status}-${invoice.dueDate}`,
          clientName: invoice.clientName,
          invoiceId: invoice.id,
          dueDateValue: dueDate.getTime(),
          dueDateLabel: dueDate.toLocaleDateString(),
          message: `Invoice due in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`
        };
      })
      .sort((left, right) => left.dueDateValue - right.dueDateValue);
  }, [invoices]);

  const unreadNotifications = notifications.filter((notification) => !readKeys.includes(notification.key));
  const unreadCount = unreadNotifications.length;

  useEffect(() => {
    if (unreadCount > previousCountRef.current) {
      setPulse(true);
      const timeoutId = window.setTimeout(() => setPulse(false), 900);
      return () => window.clearTimeout(timeoutId);
    }

    previousCountRef.current = unreadCount;
    return undefined;
  }, [unreadCount]);

  useEffect(() => {
    previousCountRef.current = unreadCount;
  }, [unreadCount]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const markAllAsRead = () => {
    setReadKeys(notifications.map((notification) => notification.key));
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
        aria-label="Notifications"
        title="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className={`absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white ${pulse ? 'animate-bounce' : ''}`}>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-3 w-96 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-slate-900/40">
          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
            <div>
              <p className="text-sm font-bold text-white">Notifications</p>
              <p className="text-xs text-slate-400">Due invoices in the next 48 hours</p>
            </div>
            {notifications.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-700"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-slate-400">
                No upcoming invoice notifications.
              </div>
            ) : (
              notifications.map((notification) => {
                const isUnread = !readKeys.includes(notification.key);

                return (
                  <div
                    key={notification.key}
                    className={`border-b border-slate-800 px-4 py-4 transition-colors last:border-b-0 ${isUnread ? 'bg-slate-800/70' : 'bg-slate-900'}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">{notification.clientName}</p>
                        <p className="mt-0.5 text-xs text-slate-400">Invoice ID: {notification.invoiceId}</p>
                        <p className="mt-0.5 text-xs text-slate-400">Due Date: {notification.dueDateLabel}</p>
                      </div>
                      <span className={`mt-1 inline-flex h-2.5 w-2.5 rounded-full ${isUnread ? 'bg-rose-500' : 'bg-slate-600'}`} />
                    </div>
                    <p className="mt-3 text-sm text-amber-300">{notification.message}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
