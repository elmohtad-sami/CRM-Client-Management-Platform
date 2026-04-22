import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import InvoiceCreator from '../components/InvoiceCreator';

// Custom Tooltip Component (declared outside render)
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-purple-200 bg-white p-3 shadow-lg">
        <p className="text-xs font-semibold text-gray-700">{payload[0].payload.month}</p>
        <p className="text-sm font-bold text-purple-600">
          {payload[0].value.toLocaleString('fr-FR')} MAD
        </p>
      </div>
    );
  }
  return null;
};

// Custom Bar Shape Component (declared outside render)
const CustomBar = (props) => {
  const { x, y, width, height } = props;
  const radius = 10;
  return (
    <g>
      <defs>
        <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <path
        d={`
          M ${x},${y + radius}
          L ${x},${y + height}
          L ${x + width},${y + height}
          L ${x + width},${y + radius}
          Q ${x + width},${y} ${x + width - radius},${y}
          L ${x + radius},${y}
          Q ${x},${y} ${x},${y + radius}
        `}
        fill="url(#purpleGradient)"
        stroke="none"
      />
    </g>
  );
};

const Dashboard = () => {
  const [userName] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser).fullName : '';
  });
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  // Revenue Data for Bar Chart
  const revenueData = [
    { month: 'févr. 2026', revenue: 15000 },
    { month: 'mars 2026', revenue: 18500 },
    { month: 'avr. 2026', revenue: 22000 },
    { month: 'mai 2026', revenue: 25000 },
    { month: 'juin 2026', revenue: 23079.97 },
    { month: 'juil. 2026', revenue: 28000 },
  ];

  // Portfolio Data
  const totalAssessed = 4;
  const solvableClients = 1;
  const insolvableClients = totalAssessed - solvableClients;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Welcome, {userName}!</h1>
            <p className="mt-2 text-gray-600">Analytics & Client Portfolio Overview</p>
          </div>
          <div className="flex gap-3">
            <InvoiceCreator />
            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Top Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Total Revenue Card */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">23 079,97 MAD</p>
                <p className="mt-2 text-xs text-green-600 font-semibold">↑ 12% from last month</p>
              </div>
              <div className="rounded-full bg-gradient-to-br from-purple-100 to-purple-50 p-3">
                <TrendingUp className="text-purple-600" size={28} />
              </div>
            </div>
          </div>

          {/* Solvability Rate Card */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Solvability Rate</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">100%</p>
                <p className="mt-2 text-xs text-blue-600 font-semibold">1 out of 1 verified</p>
              </div>
              <div className="rounded-full bg-gradient-to-br from-blue-100 to-blue-50 p-3">
                <TrendingUp className="text-blue-600" size={28} />
              </div>
            </div>
          </div>

          {/* Regulatory Risks Card */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Regulatory Risks</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">2</p>
                <p className="mt-2 text-xs text-orange-600 font-semibold">Active incidents</p>
              </div>
              <div className="rounded-full bg-gradient-to-br from-orange-100 to-orange-50 p-3">
                <AlertTriangle className="text-orange-600" size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 min-w-0 rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">Revenue Trend</h2>
              <p className="mt-1 text-sm text-gray-600">Monthly revenue in MAD (Feb - Jul 2026)</p>
            </div>
            <div className="h-[350px] min-h-[350px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    label={{ value: 'Revenue (MAD)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="revenue" shape={<CustomBar />} radius={[10, 10, 0, 0]}>
                    {revenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="url(#purpleGradient)" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Portfolio Overview */}
          <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-white shadow-sm">
            <h2 className="mb-6 text-xl font-bold">Portfolio Overview</h2>

            {/* Total Assessed */}
            <div className="mb-6 flex items-center rounded-lg bg-white bg-opacity-10 p-4">
              <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 bg-opacity-20">
                <span className="text-lg font-bold text-blue-300">📊</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-300">Total Assessed</p>
                <p className="text-2xl font-bold text-white">{totalAssessed}</p>
              </div>
            </div>

            {/* Solvable Clients */}
            <div className="mb-6 flex items-center rounded-lg bg-white bg-opacity-10 p-4">
              <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500 bg-opacity-20">
                <span className="text-lg font-bold text-green-300">✓</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-300">Solvable Clients</p>
                <p className="text-2xl font-bold text-green-300">{solvableClients}</p>
              </div>
            </div>

            {/* Insolvable Clients */}
            <div className="flex items-center rounded-lg bg-red-600 bg-opacity-20 p-4">
              <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500 bg-opacity-30">
                <AlertTriangle className="text-red-400" size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-300">Insolvable Clients</p>
                <p className="text-2xl font-bold text-red-400">{insolvableClients}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900">Quick Stats</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-600">Average Monthly Revenue</p>
              <p className="mt-1 text-2xl font-bold text-purple-600">
                {(revenueData.reduce((sum, item) => sum + item.revenue, 0) / revenueData.length).toLocaleString('fr-FR', {
                  maximumFractionDigits: 2,
                })} MAD
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-600">Client Assessment Status</p>
              <p className="mt-1 text-2xl font-bold text-blue-600">
                {Math.round((insolvableClients / totalAssessed) * 100)}% requires attention
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
