import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, ShieldAlert, Activity, Star, ShieldCheck } from 'lucide-react';

export default function GlobalDashboardComponent({ stats, clientStatusCounts, monthlyRevenueData, changeView }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Revenue</p>
            <p className="text-3xl font-black text-slate-900 mt-2">{stats.totalRevenue.toLocaleString()} MAD</p>
          </div>
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign size={28} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Solvability Rate</p>
            <p className="text-3xl font-black text-slate-900 mt-2">{stats.solvabilityRate}%</p>
          </div>
          <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Activity size={28} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Regulatory Risks</p>
            <p className="text-3xl font-black text-slate-900 mt-2">{stats.totalRisks}</p>
          </div>
          <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
            <ShieldAlert size={28} />
          </div>
        </div>
      </div>

      {/* Charts & Status Block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Total Revenue Per Month</h3>
              <p className="text-sm text-slate-500">Monthly financial performance over time</p>
            </div>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={(value) => `${value >= 1000 ? (value / 1000) + 'k' : value}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#0F172A', marginBottom: '4px' }}
                  itemStyle={{ color: '#6366F1', fontWeight: '500' }}
                  formatter={(value) => [`${value.toLocaleString()} MAD`, 'Revenue']}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#6366F1" 
                  strokeWidth={4}
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} 
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#6366F1', className: 'animate-pulse' }} 
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Client Portfolios breakdown */}
        <div className="bg-linear-to-b from-slate-900 to-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700 flex flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          
          <div>
            <h3 className="text-lg font-bold mb-2">Portfolio Overview</h3>
            <p className="text-slate-400 text-sm mb-8">Snapshot of your client bases according to trust and reliability algorithms.</p>
            
            <div className="space-y-4">
              <button onClick={() => changeView('solvable')} className="w-full flex items-center justify-between bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50 p-4 rounded-xl transition-all group backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <ShieldCheck size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-emerald-50 text-sm">Solvable Clients</p>
                    <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">Reliable payments</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-white">{clientStatusCounts?.solvable || 0}</p>
                </div>
              </button>

              <button onClick={() => changeView('fidèle')} className="w-full flex items-center justify-between bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50 p-4 rounded-xl transition-all group backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Star size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-blue-50 text-sm">Fidèle Clients</p>
                    <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">High retention rate</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-white">{clientStatusCounts?.fidele || 0}</p>
                </div>
              </button>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-700/50">
            <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span>Total Assessed</span>
              <span className="text-slate-200">{(clientStatusCounts?.solvable || 0) + (clientStatusCounts?.fidele || 0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
