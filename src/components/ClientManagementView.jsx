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
      <div className="lg:col-span-1 bg-white/[0.06] backdrop-blur-2xl border border-white/[0.12] rounded-2xl p-6 shadow-[0_0_40px_rgba(255,255,255,0.03)]">
        <h3 className="text-lg font-bold text-white">{editingClientId ? 'Edit Client' : 'Add Client'}</h3>
        <p className="mt-1 text-xs text-white/50">Manage core client identity and status.</p>

        <form onSubmit={handleSaveClient} className="mt-5 space-y-2.5">
          <input
            value={clientForm.name}
            onChange={(event) => setClientForm((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Client name"
            className="w-full rounded-xl border border-white/[0.15] bg-white/[0.08] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-white/40"
          />
          <input
            value={clientForm.company}
            onChange={(event) => setClientForm((prev) => ({ ...prev, company: event.target.value }))}
            placeholder="Company"
            className="w-full rounded-xl border border-white/[0.15] bg-white/[0.08] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-white/40"
          />
          <select
            value={clientForm.status}
            onChange={(event) => setClientForm((prev) => ({ ...prev, status: event.target.value }))}
            className="w-full rounded-xl border border-white/[0.15] bg-white/[0.08] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-white/30 text-white"
          >
            <option value="Solvable">Solvable</option>
            <option value="Fidèle">Fidèle</option>
            <option value="Insolvable">Insolvable</option>
          </select>
          <input
            value={clientForm.email}
            onChange={(event) => setClientForm((prev) => ({ ...prev, email: event.target.value }))}
            placeholder="Email"
            className="w-full rounded-xl border border-white/[0.15] bg-white/[0.08] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-white/40"
          />
          <input
            value={clientForm.phone}
            onChange={(event) => setClientForm((prev) => ({ ...prev, phone: event.target.value }))}
            placeholder="Phone"
            className="w-full rounded-xl border border-white/[0.15] bg-white/[0.08] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-white/40"
          />
          <input
            value={clientForm.industry}
            onChange={(event) => setClientForm((prev) => ({ ...prev, industry: event.target.value }))}
            placeholder="Industry"
            className="w-full rounded-xl border border-white/[0.15] bg-white/[0.08] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-white/40"
          />

          <div className="flex gap-2 pt-2">
            <button type="submit" className="flex-1 rounded-xl bg-white/15 text-white px-4 py-2.5 text-xs uppercase tracking-wider font-bold backdrop-blur-sm border border-white/10 hover:bg-white/25 transition-colors">
              {editingClientId ? 'Update Client' : 'Create Client'}
            </button>
            <button
              type="button"
              onClick={resetClientForm}
              className="rounded-xl border border-white/[0.12] px-4 py-2.5 text-xs font-semibold text-white/70 hover:bg-white/10 transition-colors"
            >
              Reset
            </button>
          </div>
        </form>

        {clientFeedback && (
          <p className="mt-4 rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 py-2.5 text-xs text-white/70">{clientFeedback}</p>
        )}
      </div>

      <div className="lg:col-span-2 bg-white/[0.06] backdrop-blur-2xl border border-white/[0.12] rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.03)] overflow-hidden">
        <div className="border-b border-white/[0.08] px-6 py-4">
          <h3 className="text-lg font-bold text-white">Clients ({clients.length})</h3>
          <p className="text-sm text-white/50">CRUD management for all client records.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white/[0.04] text-white/50 border-b border-white/[0.08]">
              <tr>
                <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider">Name</th>
                <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider">Status</th>
                <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider">Company</th>
                <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider">Email</th>
                <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {clients
                .slice()
                .sort((left, right) => String(left.name || '').localeCompare(String(right.name || '')))
                .map((client) => {
                  const clientId = String(client._id || client.id || '');
                  return (
                    <tr key={clientId} className="hover:bg-white/[0.03] transition-colors">
                      <td className="px-4 py-3 font-semibold text-white">{client.name}</td>
                      <td className="px-4 py-3 text-white/70">{client.status || 'Solvable'}</td>
                      <td className="px-4 py-3 text-white/70">{client.company || '-'}</td>
                      <td className="px-4 py-3 text-white/70">{client.email || '-'}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => startEditClient(client)}
                            className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/20 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClientRecord(clientId)}
                            className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition-colors"
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