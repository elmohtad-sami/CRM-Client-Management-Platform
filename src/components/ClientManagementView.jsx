import React from 'react';

export default function ClientManagementView({
  editingClientId,
  clientForm,
  setClientForm,
  handleSaveClient,
  resetClientForm,
  clientFeedback,
  clients,
  startEditClient,
  handleDeleteClientRecord
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-1 bg-[var(--c-surface)] backdrop-blur-2xl border border-[var(--c-border-md)] rounded-2xl p-6 shadow-[var(--c-glow)]">
        <h3 className="text-lg font-bold text-[var(--c-text)]">{editingClientId ? 'Edit Client' : 'Add Client'}</h3>
        <p className="mt-1 text-xs text-[var(--c-text-3)]">Manage core client identity and status.</p>

        <form onSubmit={handleSaveClient} className="mt-5 space-y-2.5">
          <input
            value={clientForm.name}
            onChange={(event) => setClientForm((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Client name"
            className="w-full rounded-xl border border-[var(--c-border-strong)] bg-[var(--c-element)] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--c-border)] text-[var(--c-text)] placeholder-[var(--c-placeholder)]"
          />
          <input
            value={clientForm.company}
            onChange={(event) => setClientForm((prev) => ({ ...prev, company: event.target.value }))}
            placeholder="Company"
            className="w-full rounded-xl border border-[var(--c-border-strong)] bg-[var(--c-element)] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--c-border)] text-[var(--c-text)] placeholder-[var(--c-placeholder)]"
          />
          <select
            value={clientForm.status}
            onChange={(event) => setClientForm((prev) => ({ ...prev, status: event.target.value }))}
            className="w-full rounded-xl border border-[var(--c-border-strong)] bg-[var(--c-element)] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--c-border)] text-[var(--c-text)]"
          >
            <option value="Solvable">Solvable</option>
            <option value="Fidèle">Fidèle</option>
            <option value="Insolvable">Insolvable</option>
          </select>
          <input
            value={clientForm.email}
            onChange={(event) => setClientForm((prev) => ({ ...prev, email: event.target.value }))}
            placeholder="Email"
            className="w-full rounded-xl border border-[var(--c-border-strong)] bg-[var(--c-element)] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--c-border)] text-[var(--c-text)] placeholder-[var(--c-placeholder)]"
          />
          <input
            value={clientForm.phone}
            onChange={(event) => setClientForm((prev) => ({ ...prev, phone: event.target.value }))}
            placeholder="Phone"
            className="w-full rounded-xl border border-[var(--c-border-strong)] bg-[var(--c-element)] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--c-border)] text-[var(--c-text)] placeholder-[var(--c-placeholder)]"
          />
          <input
            value={clientForm.industry}
            onChange={(event) => setClientForm((prev) => ({ ...prev, industry: event.target.value }))}
            placeholder="Industry"
            className="w-full rounded-xl border border-[var(--c-border-strong)] bg-[var(--c-element)] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--c-border)] text-[var(--c-text)] placeholder-[var(--c-placeholder)]"
          />
          <input
            value={clientForm.montant}
            onChange={(event) => setClientForm((prev) => ({ ...prev, montant: event.target.value }))}
            placeholder="Montant"
            className="w-full rounded-xl border border-[var(--c-border-strong)] bg-[var(--c-element)] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--c-border)] text-[var(--c-text)] placeholder-[var(--c-placeholder)]"
          />

          <div className="flex gap-2 pt-2">
            <button type="submit" className="flex-1 rounded-xl bg-[var(--c-element)] text-[var(--c-text)] px-4 py-2.5 text-xs uppercase tracking-wider font-bold backdrop-blur-sm border border-[var(--c-border)] hover:bg-[var(--c-element-hover-2)] transition-colors">
              {editingClientId ? 'Update Client' : 'Create Client'}
            </button>
            <button
              type="button"
              onClick={resetClientForm}
              className="rounded-xl border border-[var(--c-border-md)] px-4 py-2.5 text-xs font-semibold text-[var(--c-text-2)] hover:bg-[var(--c-element-hover)] transition-colors"
            >
              Reset
            </button>
          </div>
        </form>

        {clientFeedback && (
          <p className="mt-4 rounded-xl border border-[var(--c-border-md)] bg-[var(--c-elevated)] px-4 py-2.5 text-xs text-[var(--c-text-2)]">{clientFeedback}</p>
        )}
      </div>

      <div className="lg:col-span-2 bg-[var(--c-surface)] backdrop-blur-2xl border border-[var(--c-border-md)] rounded-2xl shadow-[var(--c-glow)] overflow-hidden">
        <div className="border-b border-[var(--c-border)] px-6 py-4">
          <h3 className="text-lg font-bold text-[var(--c-text)]">Clients ({clients.length})</h3>
          <p className="text-sm text-[var(--c-text-3)]">Management for all client records.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[var(--c-elevated)] text-[var(--c-text-3)] border-b border-[var(--c-border)]">
              <tr>
                <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider">Name</th>
                <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider">Status</th>
                <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider">Company</th>
                <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider">Montant</th>
                <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider">Email</th>
                <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--c-border)]">
              {clients
                .slice()
                .sort((left, right) => String(left.name || '').localeCompare(String(right.name || '')))
                .map((client) => {
                  const clientId = String(client._id || client.id || '');
                  return (
                    <tr key={clientId} className="hover:bg-[var(--c-elevated)] transition-colors">
                      <td className="px-4 py-3 font-semibold text-[var(--c-text)]">{client.name}</td>
                      <td className="px-4 py-3 text-[var(--c-text-2)]">{client.status || 'Solvable'}</td>
                      <td className="px-4 py-3 text-[var(--c-text-2)]">{client.company || '-'}</td>
                      <td className="px-4 py-3 text-[var(--c-text-2)]">{client.montant || '-'}</td>
                      <td className="px-4 py-3 text-[var(--c-text-2)]">{client.email || '-'}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => startEditClient(client)}
                            className="rounded-lg border border-[var(--c-border)] bg-[var(--c-element)] px-3 py-1.5 text-xs font-semibold text-[var(--c-text)] hover:bg-[var(--c-element-hover)] transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClientRecord(clientId)}
                            className="rounded-lg border border-[var(--c-danger-border)] bg-[var(--c-danger-bg)] px-3 py-1.5 text-xs font-semibold text-[var(--c-danger)] hover:bg-[var(--c-danger-hover)] transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}