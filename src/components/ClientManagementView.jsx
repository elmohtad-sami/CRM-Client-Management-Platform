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
      <div className="lg:col-span-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900">{editingClientId ? 'Edit Client' : 'Add Client'}</h3>
        <p className="mt-1 text-sm text-slate-500">Manage core client identity and status.</p>

        <form onSubmit={handleSaveClient} className="mt-5 space-y-3">
          <input
            value={clientForm.name}
            onChange={(event) => setClientForm((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Client name"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            value={clientForm.company}
            onChange={(event) => setClientForm((prev) => ({ ...prev, company: event.target.value }))}
            placeholder="Company"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={clientForm.status}
            onChange={(event) => setClientForm((prev) => ({ ...prev, status: event.target.value }))}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Solvable">Solvable</option>
            <option value="Fidèle">Fidèle</option>
            <option value="Insolvable">Insolvable</option>
          </select>
          <input
            value={clientForm.email}
            onChange={(event) => setClientForm((prev) => ({ ...prev, email: event.target.value }))}
            placeholder="Email"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            value={clientForm.phone}
            onChange={(event) => setClientForm((prev) => ({ ...prev, phone: event.target.value }))}
            placeholder="Phone"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            value={clientForm.industry}
            onChange={(event) => setClientForm((prev) => ({ ...prev, industry: event.target.value }))}
            placeholder="Industry"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <div className="flex gap-2 pt-2">
            <button type="submit" className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">
              {editingClientId ? 'Update Client' : 'Create Client'}
            </button>
            <button
              type="button"
              onClick={resetClientForm}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Reset
            </button>
          </div>
        </form>

        {clientFeedback && (
          <p className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">{clientFeedback}</p>
        )}
      </div>

      <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-4">
          <h3 className="text-lg font-bold text-slate-900">Clients ({clients.length})</h3>
          <p className="text-sm text-slate-500">CRUD management for all client records.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clients
                .slice()
                .sort((left, right) => String(left.name || '').localeCompare(String(right.name || '')))
                .map((client) => {
                  const clientId = String(client._id || client.id || '');
                  return (
                    <tr key={clientId} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-900">{client.name}</td>
                      <td className="px-6 py-4 text-slate-700">{client.status || 'Solvable'}</td>
                      <td className="px-6 py-4 text-slate-600">{client.company || '-'}</td>
                      <td className="px-6 py-4 text-slate-600">{client.email || '-'}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => startEditClient(client)}
                            className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClientRecord(clientId)}
                            className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
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