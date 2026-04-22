import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, Users, AlertCircle, Plus, 
  Trash2, Edit2, X, Activity, DollarSign, 
  Filter, Receipt, ShieldAlert, ChevronRight, BookOpen, Star, ShieldCheck, CheckCircle2, AlertTriangle, LogOut
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AuthPage from './components/AuthPage';
import FilteredClientList from './components/FilteredClientList';
import GlobalDashboardComponent from './components/GlobalDashboardComponent';
import AddRiskForm from './components/AddRiskForm';
import RiskAnomaliesList from './components/RiskAnomaliesList';

export default function App() {
  const normalizeClientStatus = (value) => {
    if (!value) return null;
    const normalized = String(value).toLowerCase();
    if (normalized.includes('insolv')) return 'Insolvable';
    if (normalized.includes('fid')) return 'Fidèle';
    if (normalized.includes('solv')) return 'Solvable';
    return null;
  };

  // --- AUTH STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('isAuthenticated') === 'true');
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('finance_crm_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // --- STATE ---
  const [invoices, setInvoices] = useState(() => {
    const storedUser = localStorage.getItem('finance_crm_user');
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    if (parsedUser && parsedUser.email) {
      const saved = localStorage.getItem(`finance_crm_data_${parsedUser.email}`);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  
  const [hasAudited, setHasAudited] = useState(false);
  const [riskAnomalies, setRiskAnomalies] = useState(() => {
    const storedUser = localStorage.getItem('finance_crm_user');
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    if (parsedUser && parsedUser.email) {
      const saved = localStorage.getItem(`finance_crm_risks_${parsedUser.email}`);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [filter, setFilter] = useState('Tous'); 
  const [selectedClientName, setSelectedClientName] = useState(null);
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window === 'undefined') return 'dashboard';
    const params = new URLSearchParams(window.location.search);
    return params.get('view') || 'dashboard';
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null); 
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({ clientName: '', clientStatus: 'Fidele', date: '', dueDate: '', amountHT: '', tva: '', paymentStatus: 'Pending', paymentDelay: '', paymentMethod: 'Bank Transfer', status: 'En attente' });

  // --- PERSISTENCE ---
  useEffect(() => {
    if (user && user.email) {
      localStorage.setItem(`finance_crm_data_${user.email}`, JSON.stringify(invoices));
      localStorage.setItem(`finance_crm_risks_${user.email}`, JSON.stringify(riskAnomalies));
    }
  }, [invoices, riskAnomalies, user]);

  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      setCurrentView(params.get('view') || 'dashboard');
    };
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  // --- ENGINE: CLIENT SCORING ---
  const clientsData = useMemo(() => {
    const map = {};
    invoices.forEach(inv => {
      if (!map[inv.clientName]) {
        map[inv.clientName] = { name: inv.clientName, invoiceCount: 0, totalDelay: 0, paidCount: 0, flaggedCount: 0 };
      }
      map[inv.clientName].invoiceCount += 1;
      map[inv.clientName].totalDelay += Number(inv.paymentDelay || 0);
      if (inv.paymentStatus === 'Paid') map[inv.clientName].paidCount += 1;
      if (inv.flags && inv.flags.length > 0) map[inv.clientName].flaggedCount += 1;
    });

    return Object.values(map).map(c => {
      const isSolvable = c.paidCount === c.invoiceCount || (c.totalDelay / c.invoiceCount) < 30;
      const isFidele = c.invoiceCount > 3; // > 3 invoices
      const hasRisks = c.flaggedCount > 0;
      
      const solvabilityScore = Math.round((c.paidCount / c.invoiceCount) * 100) || 0;
      const fidelityScore = Math.min(100, Math.round((c.invoiceCount / 4) * 100));

      return { ...c, isSolvable, isFidele, hasRisks, solvabilityScore, fidelityScore };
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [invoices]);

  // --- DERIVED METRICS ---
  const stats = useMemo(() => {
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.totalTTC, 0);
    const totalRisks = invoices.filter(inv => inv.flags && inv.flags.length > 0).length;
    const solvableCount = clientsData.filter(c => c.isSolvable).length;
    const solvabilityRate = clientsData.length ? Math.round((solvableCount / clientsData.length) * 100) : 0;
    return { totalRevenue, totalRisks, solvabilityRate };
  }, [invoices, clientsData]);

  const clientsStatusByName = useMemo(() => {
    const map = {};

    clientsData.forEach(client => {
      map[client.name] = client.isSolvable ? 'Solvable' : 'Insolvable';
    });

    invoices.forEach(inv => {
      const status = normalizeClientStatus(inv.clientStatus);
      if (status && inv.clientName) {
        map[inv.clientName] = status;
      }
    });

    return map;
  }, [clientsData, invoices]);

  const clientStatusCounts = useMemo(() => {
    return Object.values(clientsStatusByName).reduce((acc, status) => {
      if (status === 'Fidèle') acc.fidele += 1;
      if (status === 'Solvable') acc.solvable += 1;
      if (status === 'Insolvable') acc.insolvable += 1;
      return acc;
    }, { fidele: 0, solvable: 0, insolvable: 0 });
  }, [clientsStatusByName]);

  const monthlyRevenueData = useMemo(() => {
    const monthTotals = invoices.reduce((acc, inv) => {
      if (!inv.date) return acc;

      const parsedDate = new Date(inv.date);
      if (Number.isNaN(parsedDate.getTime())) return acc;

      const monthKey = `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, '0')}`;
      if (!acc[monthKey]) {
        acc[monthKey] = {
          monthKey,
          month: parsedDate.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
          revenue: 0
        };
      }

      acc[monthKey].revenue += Number(inv.amount ?? inv.amountHT ?? inv.totalTTC ?? 0);
      return acc;
    }, {});

    return Object.values(monthTotals)
      .sort((a, b) => a.monthKey.localeCompare(b.monthKey))
      .map(({ month, revenue }) => ({ month, revenue }));
  }, [invoices]);

  // --- FILTERING LOGIC ---
  const displayedInvoices = useMemo(() => {
    let result = invoices;
    
    // If a single client is selected, ignore global filters and show only theirs
    if (selectedClientName) {
      return result.filter(inv => inv.clientName === selectedClientName).sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    if (currentView === 'solvable') {
      result = result.filter(inv => clientsStatusByName[inv.clientName] === 'Solvable');
    } else if (currentView === 'fidèle') {
      result = result.filter(inv => clientsStatusByName[inv.clientName] === 'Fidèle');
    } else if (currentView === 'insolvable') {
      result = result.filter(inv => clientsStatusByName[inv.clientName] === 'Insolvable');
    } else if (filter !== 'Tous') {
      result = result.filter(inv => {
        const client = clientsData.find(c => c.name === inv.clientName);
        if (filter === 'Solvable') return client?.isSolvable;
        if (filter === 'Fidele') return client?.isFidele;
        if (filter === 'Risk') return client?.hasRisks;
        return true;
      });
    }
    
    return result.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [invoices, clientsData, filter, selectedClientName, currentView, clientsStatusByName]);

  const changeView = (view) => {
    setCurrentView(view);
    setSelectedClientName(null);
    setFilter('Tous');
    window.history.pushState({}, '', view === 'dashboard' ? '/' : `/?view=${encodeURIComponent(view)}`);
  };

  // --- CRUD ACTIONS ---
  const openModal = (invoice = null) => {
    if (invoice) {
      setFormData({ clientStatus: 'Fidele', ...invoice });
      setEditingId(invoice.id);
    } else {
      setFormData({ clientName: selectedClientName || '', clientStatus: 'Fidele', date: '', dueDate: '', amountHT: '', tva: '', paymentStatus: 'Pending', paymentDelay: 0, paymentMethod: 'Bank Transfer', status: 'En attente' });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const amountHT = Number(formData.amountHT);
    const tva = Number(formData.tva);
    const newInvoice = {
      ...formData,
      amountHT,
      tva,
      totalTTC: amountHT + tva,
      paymentDelay: Number(formData.paymentDelay),
      flags: [],
      status: formData.status || 'En attente'
    };

    if (editingId) {
      setInvoices(invoices.map(inv => inv.id === editingId ? { ...newInvoice, id: editingId } : inv));
    } else {
      setInvoices([{ ...newInvoice, id: Date.now().toString() }, ...invoices]);
    }
    setHasAudited(false);
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    setInvoices(invoices.filter(inv => inv.id !== id));
  };

  const markAsPaid = (id) => {
    setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status: 'Payée' } : inv));
    setSelectedInvoice(prev => prev && prev.id === id ? { ...prev, status: 'Payée' } : prev);
  };

  const getInvoiceDisplayStatus = (invoice) => {
    if (invoice?.status === 'Payée') {
      return { label: 'Payée', className: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
    }

    const dueDate = invoice?.dueDate ? new Date(invoice.dueDate) : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dueDate && !Number.isNaN(dueDate.getTime())) {
      const normalizedDueDate = new Date(dueDate);
      normalizedDueDate.setHours(0, 0, 0, 0);

      if (normalizedDueDate < today) {
        return { label: 'En retard', className: 'text-rose-600 bg-rose-50 border-rose-200' };
      }
    }

    return { label: 'En attente', className: 'text-amber-700 bg-amber-50 border-amber-200' };
  };

  // --- AUDIT SYSTEM ---
  const handleRunAudit = () => {
    const audited = invoices.map(inv => {
      const flags = [];
      const expectedTVA = inv.amountHT * 0.20;
      
      if (Math.abs(expectedTVA - inv.tva) > 0.01) {
        flags.push(`Anomalie TVA : 20% attendus (${expectedTVA.toLocaleString()} MAD), ${inv.tva.toLocaleString()} MAD trouves. Ref : Article 117 CGI.`);
      }
      if (inv.paymentMethod === 'Cash' && inv.totalTTC > 5000) {
        flags.push(`Violation reglementaire : les paiements en especes superieurs a 5 000 MAD sont interdits. Montant trouve : ${inv.totalTTC.toLocaleString()} MAD. Ref : Article 193 CGI.`);
      }
      return { ...inv, flags };
    });
    setInvoices(audited);
    setHasAudited(true);
  };

  // --- LOGOUT SYSTEM ---
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('finance_crm_user');
    setIsAuthenticated(false);
    setUser(null);
    setInvoices([]);
    setHasAudited(false);
    setFilter('Tous');
    setSelectedClientName(null);
  };

  const selectedClientData = clientsData.find(c => c.name === selectedClientName);

  if (!isAuthenticated) {
    return (
      <AuthPage 
        onLogin={(userData) => {
          setIsAuthenticated(true);
          setUser(userData);
          const savedInfo = localStorage.getItem(`finance_crm_data_${userData.email}`);
          setInvoices(savedInfo ? JSON.parse(savedInfo) : []);
        }} 
      />
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      
      {/* === SIDEBAR (DARK) === */}
      <div className="w-72 bg-slate-900 text-slate-300 flex flex-col shadow-xl z-20 shrink-0">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3 text-white">
            <Building2 className="text-indigo-400" size={28}/>
            <h1 className="text-2xl font-bold tracking-tight">FinAudit CRM</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 space-y-8">
          
          {/* Core Navigation */}
          <div className="px-4">
            <button 
              onClick={() => changeView('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium ${!selectedClientName && currentView === 'dashboard' ? 'bg-indigo-600 text-white shadow-sm' : 'hover:bg-slate-800 hover:text-white'}`}
            >
              <Activity size={18} /> Global Dashboard
            </button>
          </div>

          {/* Smart Filters */}
          <div className="px-4 space-y-2">
            <span className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Financial Filters</span>
            <div className="space-y-1 mt-2">
              <button 
                onClick={() => changeView('solvable')} 
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm ${!selectedClientName && currentView === 'solvable' ? 'bg-slate-800 border border-slate-700 text-white' : 'hover:bg-slate-800 hover:text-white border border-transparent'}`}
              >
                <span className="text-emerald-400"><ShieldCheck size={16}/></span> Solvable Clients
              </button>
              <button 
                onClick={() => changeView('fidèle')} 
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm ${!selectedClientName && currentView === 'fidèle' ? 'bg-slate-800 border border-slate-700 text-white' : 'hover:bg-slate-800 hover:text-white border border-transparent'}`}
              >
                <span className="text-blue-400"><Star size={16}/></span> Fidèle Clients
              </button>
              <button 
                onClick={() => changeView('insolvable')} 
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm ${!selectedClientName && currentView === 'insolvable' ? 'bg-slate-800 border border-slate-700 text-white' : 'hover:bg-slate-800 hover:text-white border border-transparent'}`}
              >
                <span className="text-amber-400"><AlertTriangle size={16}/></span> Insolvable Clients
              </button>
              <button 
                onClick={() => changeView('risks')} 
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm ${!selectedClientName && currentView === 'risks' ? 'bg-slate-800 border border-slate-700 text-white' : 'hover:bg-slate-800 hover:text-white border border-transparent'}`}
              >
                <span className="text-rose-400"><AlertCircle size={16}/></span> Risk Anomalies
              </button>
            </div>
          </div>
        </div>
        
        {/* User Sidebar Bottom */}
        <div className="mt-auto p-4 border-t border-white/10 bg-slate-950/70 backdrop-blur-md relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-indigo-400/60 to-transparent" />
          <div className="absolute -right-10 -bottom-10 h-24 w-24 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />
          <div className="relative rounded-2xl border border-white/10 bg-white/5 px-4 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.35)]">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3 truncate">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
                  {user?.fullName?.charAt(0) || 'U'}
                </div>
                <div className="truncate">
                  <p className="text-sm font-semibold text-slate-100 truncate">{user?.fullName || 'User'}</p>
                  <p className="text-xs text-slate-400 truncate">{user?.companyName || 'Finance Dept'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 shrink-0">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.12)]" />
                Active
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-2.5 text-sm font-semibold text-rose-300 transition-all hover:bg-rose-500 hover:text-white hover:border-rose-400/40 hover:shadow-lg hover:shadow-rose-500/20"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* === MAIN CONTENT === */}
      <div className="flex-1 overflow-y-auto relative flex flex-col">
        
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center z-10 sticky top-0 shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {currentView !== 'dashboard' ? `Clients List - ${currentView === 'fidèle' ? 'Fidèles' : 'Solvables'}` : (selectedClientName ? `${selectedClientName} - Profile` : 'Global CRM Operations')}
            </h2>
            <p className="text-sm text-slate-500 font-medium tracking-wide">
              {currentView !== 'dashboard'
                ? `Filtered by status: ${currentView === 'fidèle' ? 'Fidèle' : 'Solvable'}`
                : (selectedClientName ? 'Dedicated client audit and finance tracking' : (user?.companyName ? `Overview for ${user.companyName}` : 'Enterprise firm overview'))}
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => handleRunAudit()} disabled={invoices.length === 0} className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 font-semibold text-sm transition-all disabled:opacity-50 shadow-sm">
              <ShieldAlert size={16} /> Scan for Risks
            </button>
            <button onClick={() => openModal()} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 font-semibold text-sm transition-all shadow-sm">
              <Plus size={16} /> Add Invoice
            </button>
          </div>
        </header>

        <main className="p-8 space-y-8 max-w-7xl w-full mx-auto">
          {selectedClientName ? (
            <>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center gap-8 justify-between animate-in fade-in slide-in-from-bottom-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500"></div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-400 tracking-widest uppercase">Finance Score</h3>
                  <p className="text-4xl font-black">{selectedClientData?.solvabilityScore}%</p>
                </div>
                <div className="flex gap-4">
                  <div className={`px-4 py-3 rounded-xl border flex flex-col items-center gap-1 min-w-30 ${selectedClientData?.isSolvable ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                    <ShieldCheck size={24} className={selectedClientData?.isSolvable ? 'text-emerald-500' : 'text-rose-500'} />
                    <span className="text-sm font-bold leading-none uppercase">{selectedClientData?.isSolvable ? 'Solvable' : 'Debt Risk'}</span>
                  </div>
                  <div className={`px-4 py-3 rounded-xl border flex flex-col items-center gap-1 min-w-30 ${selectedClientData?.isFidele ? 'bg-blue-50 border-blue-200 text-blue-800' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                    <Star size={24} className={selectedClientData?.isFidele ? 'text-blue-500' : 'text-slate-400'} />
                    <span className="text-sm font-bold leading-none uppercase">{selectedClientData?.isFidele ? 'Fidèle' : 'New/Casual'}</span>
                  </div>
                </div>
              </div>
              <FilteredClientList 
                status="Profile" 
                hasSelectedClient 
                displayedInvoices={displayedInvoices} 
                hasAudited={hasAudited} 
                openModal={openModal} 
                handleDelete={handleDelete} 
                setSelectedInvoice={setSelectedInvoice} 
                setIsDrawerOpen={setIsDrawerOpen} 
              />
            </>
          ) : currentView === 'solvable' ? (
            <FilteredClientList 
              status="Solvable" 
              displayedInvoices={displayedInvoices} 
              hasAudited={hasAudited} 
              openModal={openModal} 
              handleDelete={handleDelete} 
              setSelectedInvoice={setSelectedInvoice} 
              setIsDrawerOpen={setIsDrawerOpen} 
            />
          ) : currentView === 'fidèle' ? (
            <FilteredClientList 
              status="Fidèle" 
              displayedInvoices={displayedInvoices} 
              hasAudited={hasAudited} 
              openModal={openModal} 
              handleDelete={handleDelete} 
              setSelectedInvoice={setSelectedInvoice} 
              setIsDrawerOpen={setIsDrawerOpen} 
            />
          ) : currentView === 'insolvable' ? (
            <FilteredClientList 
              status="Insolvable" 
              displayedInvoices={displayedInvoices} 
              hasAudited={hasAudited} 
              openModal={openModal} 
              handleDelete={handleDelete} 
              setSelectedInvoice={setSelectedInvoice} 
              setIsDrawerOpen={setIsDrawerOpen} 
            />
          ) : currentView === 'risks' ? (
            <>
              <AddRiskForm onAddRisk={(newRisk) => setRiskAnomalies([newRisk, ...riskAnomalies])} />
              <RiskAnomaliesList anomalies={riskAnomalies} onDelete={(id) => setRiskAnomalies(riskAnomalies.filter(r => r.id !== id))} />
            </>
          ) : (
            <>
              <GlobalDashboardComponent 
                 stats={stats} 
                 clientStatusCounts={clientStatusCounts} 
                 monthlyRevenueData={monthlyRevenueData} 
                 changeView={changeView} 
              />
              <FilteredClientList 
                status="All" 
                displayedInvoices={displayedInvoices} 
                hasAudited={hasAudited} 
                openModal={openModal} 
                handleDelete={handleDelete} 
                setSelectedInvoice={setSelectedInvoice} 
                setIsDrawerOpen={setIsDrawerOpen} 
              />
            </>
          )}
        </main>
      </div>

      {/* === ADD/EDIT MODAL === */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-slate-900">{editingId ? 'Edit Record' : 'New Invoice'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full transition-colors"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Client Name</label>
                <input required type="text" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-medium" value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} placeholder="e.g. Acme Corp" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Client Status</label>
                <select className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-medium appearance-none" value={formData.clientStatus} onChange={e => setFormData({...formData, clientStatus: e.target.value})}>
                  <option value="Fidèle">Fidèle</option>
                  <option value="Solvable">Solvable</option>
                  <option value="Insolvable">Insolvable</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Issue Date</label>
                  <input required type="date" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-medium" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Payment Status</label>
                  <select className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-medium appearance-none" value={formData.paymentStatus} onChange={e => setFormData({...formData, paymentStatus: e.target.value})}>
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Date d'échéance</label>
                <input required type="date" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-medium" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Amount HT</label>
                  <input required type="number" step="0.01" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-medium" value={formData.amountHT} onChange={e => setFormData({...formData, amountHT: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Calculated TVA</label>
                  <input required type="number" step="0.01" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-medium" value={formData.tva} onChange={e => setFormData({...formData, tva: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Delay (Days)</label>
                  <input required type="number" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-medium" value={formData.paymentDelay} onChange={e => setFormData({...formData, paymentDelay: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Method</label>
                  <select className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-medium appearance-none" value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value})}>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Cash">Cash</option>
                    <option value="Check">Check</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-wider py-4 rounded-xl mt-6 transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-indigo-500/30">
                {editingId ? 'Update Record' : 'Save Invoice'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* === FISCAL EXPLANATION SLIDE-OVER DRAWER === */}
      <div className={`fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsDrawerOpen(false)} />
      <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col border-l border-slate-200 ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="flex items-center justify-between p-6 bg-rose-50 border-b border-rose-200">
          <div className="flex items-center gap-3 text-rose-900">
            <BookOpen className="text-rose-600" size={26} />
            <h2 className="text-xl font-black">Audit Diagnosis</h2>
          </div>
          <button onClick={() => setIsDrawerOpen(false)} className="text-rose-500 hover:text-rose-900 hover:bg-rose-100 p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 flex-1 overflow-y-auto bg-slate-50">
          {selectedInvoice && (
            <div className="space-y-8">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Target Entry</p>
                <div className="space-y-2 text-sm text-slate-700 font-medium">
                  <div className="flex justify-between"><span className="text-slate-500">Client</span> <span className="text-slate-900 font-bold">{selectedInvoice.clientName}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Date</span> <span>{selectedInvoice.date}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Due Date</span> <span>{selectedInvoice.dueDate || '-'}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">TTC Value</span> <span className="font-bold">{selectedInvoice.totalTTC.toLocaleString()} MAD</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Payment</span> <span>{selectedInvoice.paymentMethod}</span></div>
                  <div className="flex justify-between items-center gap-3"><span className="text-slate-500">Status</span> <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${getInvoiceDisplayStatus(selectedInvoice).className}`}>{getInvoiceDisplayStatus(selectedInvoice).label}</span></div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-200 pb-3 mb-4">
                  <AlertCircle size={16} className="text-rose-500" /> Regulatory Violations
                </h3>
                <div className="space-y-4">
                  {selectedInvoice.flags.map((flag, idx) => (
                    <div key={idx} className="bg-white border text-sm border-rose-200 border-l-4 border-l-rose-500 p-5 rounded-r-xl shadow-sm text-slate-800 font-medium leading-relaxed">
                      {flag}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-slate-200 bg-white space-y-3">
          {selectedInvoice && (!selectedInvoice.status || selectedInvoice.status === 'En attente') && (
            <button onClick={() => markAsPaid(selectedInvoice.id)} className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold uppercase tracking-wider transition-colors shadow-lg hover:shadow-emerald-600/20">
              Marquer comme Payée
            </button>
          )}
          <button onClick={() => setIsDrawerOpen(false)} className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold uppercase tracking-wider transition-colors shadow-lg hover:shadow-slate-900/20">
            Acknowledge Report
          </button>
        </div>
      </div>

    </div>
  );
}

