import React, { useEffect, useRef, useState } from 'react';
import { BellIcon } from '@animateicons/react/lucide';
import { useClients } from '../context/ClientsContext';

const WINDOW_MS = 48 * 60 * 60 * 1000;

export default function NotificationBellIcon() {
  const { invoices } = useClients();
  const [isOpen, setIsOpen] = useState(false);
  const [readKeys, setReadKeys] = useState([]);
  const [pulse, setPulse] = useState(false);
  const [now] = useState(() => Date.now());
  const rootRef = useRef(null);
  const previousCountRef = useRef(0);

  const notifications = invoices
    .filter((invoice) => {
      const dueDate = invoice?.dueDate ? new Date(invoice.dueDate).getTime() : NaN;
      if (Number.isNaN(dueDate)) return false;

      const pending = invoice.status === 'Pending' || invoice.status === 'En attente' || invoice.paymentStatus === 'Pending';
      const paid = invoice.status === 'Paid' || invoice.status === 'Payée' || invoice.paymentStatus === 'Paid';
      const diff = dueDate - now;

      return pending && !paid && Math.abs(diff) <= WINDOW_MS;
    })
    .map((invoice) => {
      const dueDate = new Date(invoice.dueDate);
      const diffMs = dueDate.getTime() - now;
      const daysLeft = Math.ceil(Math.abs(diffMs) / (24 * 60 * 60 * 1000));
      const isOverdue = diffMs < 0;

      return {
        key: `${invoice.id}-${invoice.status}-${invoice.dueDate}`,
        clientName: invoice.clientName,
        invoiceId: invoice.id,
        dueDateValue: dueDate.getTime(),
        dueDateLabel: dueDate.toLocaleDateString(),
        message: isOverdue
          ? `Invoice overdue by ${daysLeft} day${daysLeft === 1 ? '' : 's'}`
          : `Invoice due in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`
      };
    })
    .sort((left, right) => left.dueDateValue - right.dueDateValue);

  const unreadNotifications = notifications.filter((notification) => !readKeys.includes(notification.key));
  const unreadCount = unreadNotifications.length;

  useEffect(() => {
    if (unreadCount > previousCountRef.current) {
      const startId = window.setTimeout(() => setPulse(true), 0);
      const stopId = window.setTimeout(() => setPulse(false), 900);
      previousCountRef.current = unreadCount;

      return () => {
        window.clearTimeout(startId);
        window.clearTimeout(stopId);
      };
    }

    previousCountRef.current = unreadCount;
    return undefined;
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
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--c-border-md)] bg-[var(--c-surface)] text-[var(--c-text-2)] shadow-sm transition-colors hover:bg-[var(--c-element-hover)] hover:text-[var(--c-text)] backdrop-blur-sm"
        aria-label="Notifications"
        title="Notifications"
      >
        <BellIcon size={16} />
        {unreadCount > 0 && (
          <span className={`absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white ${pulse ? 'animate-bounce' : ''}`}>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-3 w-96 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl border border-[var(--c-border-md)] bg-[var(--c-bg)] backdrop-blur-2xl shadow-2xl">
          <div className="flex items-center justify-between border-b border-[var(--c-border)] px-4 py-2.5">
            <div>
              <p className="text-xs font-bold text-[var(--c-text)]">Notifications</p>
              <p className="text-[11px] text-[var(--c-placeholder)]">Invoices due or overdue within 48 hours</p>
            </div>
            {notifications.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="rounded-lg border border-[var(--c-border-md)] bg-[var(--c-element)] px-3 py-1.5 text-xs font-semibold text-[var(--c-text)] transition-colors hover:bg-[var(--c-element-hover)]"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-[var(--c-placeholder)]">
                No upcoming invoice notifications.
              </div>
            ) : (
              notifications.map((notification) => {
                const isUnread = !readKeys.includes(notification.key);

                return (
                  <div
                    key={notification.key}
                    className={`border-b border-[var(--c-border)] px-4 py-3 transition-colors last:border-b-0 ${isUnread ? 'bg-[var(--c-surface)]' : 'bg-transparent'}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[var(--c-text)]">{notification.clientName}</p>
                          <p className="mt-0.5 text-[11px] text-[var(--c-placeholder)]">Invoice ID: {notification.invoiceId}</p>
                        <p className="mt-0.5 text-[11px] text-[var(--c-placeholder)]">Due Date: {notification.dueDateLabel}</p>
                      </div>
                      <span className={`mt-1 inline-flex h-2.5 w-2.5 rounded-full ${isUnread ? 'bg-rose-500' : 'bg-[var(--c-element-hover-2)]'}`} />
                    </div>
                    <p className="mt-3 text-sm text-[var(--c-warning)]">{notification.message}</p>
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
