import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UsersIcon, InfoIcon, PlusIcon, 
  Trash2Icon, UserPenIcon, XIcon, ActivityIcon, DollarSignIcon, 
  SlidersHorizontalIcon, ClipboardIcon, ShieldXIcon, ChevronRightIcon, BookOpenIcon, StarIcon, ShieldCheckIcon, CircleCheckIcon, TriangleAlertIcon, MenuIcon, SettingsIcon, SearchIcon
} from '@animateicons/react/lucide';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AuthPage from './components/AuthPage';
import Loader from './components/Loader';
import FilteredClientList from './components/FilteredClientList';
import GlobalDashboardComponent from './components/GlobalDashboardComponent';
import AddRiskForm from './components/AddRiskForm';
import RiskAnomaliesList from './components/RiskAnomaliesList';
import DevisManager from './components/DevisManager';
import ClientDetailsPage from './components/client-details/ClientDetailsPage';
import ProtectedPermissionRoute from './components/ProtectedPermissionRoute';
import SettingsView from './components/SettingsView';
import ClientManagementView from './components/ClientManagementView';
import InvoiceModal from './components/InvoiceModal';
import AuditDrawer from './components/AuditDrawer';
import { useUser } from './context/UserContext';
import { useClients } from './context/ClientsContext';
import NotificationBell from './components/NotificationBell';
import { devisApi } from './api/devis';
import SettingsDropdown from './components/SettingsDropdown';
import ThemeToggle from './components/ThemeToggle';
import { authApi } from './api/auth';

export default function App() {
  const navigate = useNavigate();
  const { user, token, login, logout, isAuthenticated, isLoading } = useUser();
  const { clients, invoices, setInvoices, createInvoice, updateClientInvoice, addClient, updateClient, deleteClient } = useClients();

  const normalizeClientStatus = (value) => {
    if (!value) return null;
    const normalized = String(value).toLowerCase();
    if (normalized.includes('insolv')) return 'Insolvable';
    if (normalized.includes('fid')) return 'Fidèle';
    if (normalized.includes('solv')) return 'Solvable';
    return null;
  };

  // --- STATE ---
  const [hasAudited, setHasAudited] = useState(false);
  const [riskAnomalies, setRiskAnomalies] = useState(() => {
    if (user && user.email) {
      const saved = localStorage.getItem(`finance_crm_risks_${user.email}`);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [editingRiskAnomaly, setEditingRiskAnomaly] = useState(null);
  const [devisList, setDevisList] = useState(() => {
    if (user && user.email) {
      const saved = localStorage.getItem(`finance_crm_devis_${user.email}`);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [companyInfo, setCompanyInfo] = useState(() => {
    if (user && user.email) {
      const saved = localStorage.getItem(`finance_crm_company_${user.email}`);
      return saved ? JSON.parse(saved) : {
        name: 'FINANCE CRM',
        address: '123, Avenue Mohammed V',
        city: 'Casablanca, Maroc',
        phone: '+212 5 22 00 00 00',
        email: 'contact@financecrm.ma',
        rc: '123456',
        if_: 'A123456',
        ice: '123456789000012',
        rib: '123 456 7890 1234567890 12',
        bank: 'Attijariwafa Bank — Agence Casa Centre'
      };
    }
    return {};
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('Tous'); 
  const [selectedClientName, setSelectedClientName] = useState(null);
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window === 'undefined') return 'dashboard';
    if (window.location.pathname.startsWith('/clients/')) return 'client-details';
    if (window.location.pathname === '/settings') return 'settings';
    const params = new URLSearchParams(window.location.search);
    return params.get('view') || 'dashboard';
  });
  const [clientDetailsId, setClientDetailsId] = useState(() => {
    if (typeof window === 'undefined') return null;
    const match = window.location.pathname.match(/^\/clients\/([^/]+)$/);
    return match ? match[1] : null;
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null); 
  const [editingId, setEditingId] = useState(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 1024 : false));
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({ fullName: '', email: '', companyName: '', profileImage: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [settingsMessage, setSettingsMessage] = useState('');
  const [invoiceError, setInvoiceError] = useState('');

  const [clientForm, setClientForm] = useState({
    name: '',
    company: '',
    status: 'Solvable',
    email: '',
    phone: '',
    industry: '',
    montant: ''
  });
  const [editingClientId, setEditingClientId] = useState('');
  const [clientFeedback, setClientFeedback] = useState('');

  const [formData, setFormData] = useState({ clientName: '', clientStatus: 'Fidele', date: '', dueDate: '', amountHT: '', tva: '', paymentStatus: 'Pending', paymentDelay: '', paymentMethod: 'Bank Transfer', status: 'En attente' });

  // --- PERSISTENCE ---
  // Load from localStorage AFTER user is ready (runs first in definition order)
  useEffect(() => {
    if (!user?.email) return;

    const saved = localStorage.getItem(`finance_crm_risks_${user.email}`);
    if (saved) setRiskAnomalies(JSON.parse(saved));
    const savedDevises = localStorage.getItem(`finance_crm_devis_${user.email}`);
    if (savedDevises) setDevisList(JSON.parse(savedDevises));
    const savedCompany = localStorage.getItem(`finance_crm_company_${user.email}`);
    if (savedCompany) setCompanyInfo(JSON.parse(savedCompany));
  }, [user?.email]);

  // Save to localStorage whenever local data changes (no `user` dep — avoids
  // overwriting saved data with empty state before load effect has run)
  useEffect(() => {
    if (user && user.email) {
      localStorage.setItem(`finance_crm_data_${user.email}`, JSON.stringify(invoices));
      localStorage.setItem(`finance_crm_risks_${user.email}`, JSON.stringify(riskAnomalies));
      localStorage.setItem(`finance_crm_devis_${user.email}`, JSON.stringify(devisList));
      localStorage.setItem(`finance_crm_company_${user.email}`, JSON.stringify(companyInfo));
    }
  }, [invoices, riskAnomalies, devisList, companyInfo, user]);

  // Load devis from server (authoritative source; overwrites localStorage cache)
  useEffect(() => {
    if (!token) return;

    devisApi.list(token)
      .then((serverDevis) => {
        if (Array.isArray(serverDevis)) {
          setDevisList(serverDevis);
        }
      })
      .catch(() => {
        // Server unavailable; localStorage data (loaded above) serves as fallback
      });
  }, [token]);

  useEffect(() => {
    const handleUrlChange = () => {
      const clientMatch = window.location.pathname.match(/^\/clients\/([^/]+)$/);
      if (clientMatch) {
        setClientDetailsId(clientMatch[1]);
        setCurrentView('client-details');
        return;
      }

      if (window.location.pathname === '/settings') {
        setClientDetailsId(null);
        setCurrentView('settings');
        return;
      }

      setClientDetailsId(null);
      const params = new URLSearchParams(window.location.search);
      setCurrentView(params.get('view') || 'dashboard');
    };
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  useEffect(() => {
    if (user) {
      setProfileForm({
        fullName: user.fullName || '',
        email: user.email || '',
        companyName: user.companyName || '',
        profileImage: user.profileImage || ''
      });

    }
  }, [user]);

  // Listen for explicit userUpdated events from the UserContext to force sync
  useEffect(() => {
    const handler = (e) => {
      const newUser = e?.detail || null;
      if (!newUser) {
        setProfileForm({ fullName: '', email: '', companyName: '', profileImage: '' });
        return;
      }
      setProfileForm({
        fullName: newUser.fullName || '',
        email: newUser.email || '',
        companyName: newUser.companyName || '',
        profileImage: newUser.profileImage || ''
      });
    };

    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('userUpdated', handler);
    }
    return () => {
      if (typeof window !== 'undefined' && window.removeEventListener) {
        window.removeEventListener('userUpdated', handler);
      }
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsMobileSidebarOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- ENGINE: CLIENT SCORING ---
  const clientsData = useMemo(() => {
    return clients.map((client) => {
      const clientInvoices = invoices.filter((invoice) => {
        const invoiceClientId = String(invoice.clientId || '').trim().toLowerCase();
        const invoiceClientName = String(invoice.clientName || '').trim().toLowerCase();
        const clientId = String(client._id || client.id || '').trim().toLowerCase();
        const clientName = String(client.name || '').trim().toLowerCase();

        return invoiceClientId === clientId || invoiceClientName === clientName || invoiceClientName === String(client.company || '').trim().toLowerCase();
      });

      const invoiceCount = clientInvoices.length;
      const totalDelay = clientInvoices.reduce((sum, invoice) => sum + Number(invoice.paymentDelay || 0), 0);
      const paidCount = clientInvoices.filter((invoice) => invoice.paymentStatus === 'Paid').length;
      const flaggedCount = clientInvoices.filter((invoice) => invoice.flags && invoice.flags.length > 0).length;
      const normalizedStatus = normalizeClientStatus(client.status);
      const isSolvable = normalizedStatus === 'Solvable' || (invoiceCount > 0 ? (paidCount === invoiceCount || (totalDelay / invoiceCount) < 30) : false);
      const isFidele = normalizedStatus === 'Fidèle' || String(client.status || '').toLowerCase().includes('fid') || invoiceCount > 3;
      const hasRisks = normalizedStatus === 'Insolvable' || Number(client.riskScore || 0) > 70 || flaggedCount > 0;

      const solvabilityScore = invoiceCount > 0 ? Math.round((paidCount / invoiceCount) * 100) || 0 : (isSolvable ? 100 : 0);
      const fidelityScore = isFidele ? 100 : Math.min(100, Math.round((invoiceCount / 4) * 100));

      return { ...client, invoiceCount, totalDelay, paidCount, flaggedCount, isSolvable, isFidele, hasRisks, solvabilityScore, fidelityScore };
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [clients, invoices]);

  // --- DERIVED METRICS ---
  const stats = useMemo(() => {
    const clientInvoices = clients.flatMap((client) => Array.isArray(client.invoices) ? client.invoices : []);
    const totalRevenue = clients.reduce((sum, client) => {
      const clientInvTotal = (Array.isArray(client.invoices) ? client.invoices : [])
        .reduce((s, inv) => s + Number(inv.totalTTC ?? inv.amountHT ?? inv.amount ?? 0), 0);
      return sum + (clientInvTotal || Number(client.montant || 0) || Number(client.totalRevenue || 0));
    }, 0);
    const totalRisks = clientInvoices.filter(inv => inv.flags && inv.flags.length > 0).length;
    const solvableCount = clientsData.filter(c => c.isSolvable).length;
    const solvabilityRate = clientsData.length ? Math.round((solvableCount / clientsData.length) * 100) : 0;
    return { totalRevenue, totalRisks, solvabilityRate };
  }, [clients, clientsData]);

  const clientsStatusByName = useMemo(() => {
    const map = {};

    clientsData.forEach(client => {
      map[client.name] = normalizeClientStatus(client.status) || (client.isFidele ? 'Fidèle' : (client.isSolvable ? 'Solvable' : 'Insolvable'));
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
    const monthTotals = clients.reduce((acc, client) => {
      const clientInvoices = Array.isArray(client.invoices) ? client.invoices : [];

      clientInvoices.forEach((inv) => {
        if (!inv.date) return;
        const parsedDate = new Date(inv.date);
        if (Number.isNaN(parsedDate.getTime())) return;
        const monthKey = `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, '0')}`;
        if (!acc[monthKey]) {
          acc[monthKey] = {
            monthKey,
            month: parsedDate.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
            revenue: 0
          };
        }
        acc[monthKey].revenue += Number(inv.amount ?? inv.amountHT ?? inv.totalTTC ?? 0);
      });

      if (clientInvoices.length === 0) {
        const montantVal = Number(client.montant || 0) || Number(client.totalRevenue || 0);
        if (montantVal > 0) {
          const dateStr = client.registrationDate || new Date().toISOString().slice(0, 10);
          const parsedDate = new Date(dateStr);
          if (!Number.isNaN(parsedDate.getTime())) {
            const monthKey = `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, '0')}`;
            if (!acc[monthKey]) {
              acc[monthKey] = {
                monthKey,
                month: parsedDate.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
                revenue: 0
              };
            }
            acc[monthKey].revenue += montantVal;
          }
        }
      }

      return acc;
    }, {});

    return Object.values(monthTotals)
      .sort((a, b) => a.monthKey.localeCompare(b.monthKey))
      .map(({ month, revenue }) => ({ month, revenue }));
  }, [clients]);

  // --- FILTERING LOGIC ---
  const displayedInvoices = useMemo(() => {
    let result = invoices;

    const toClientRow = (client) => {
      const clientInvoices = invoices.filter(inv => inv.clientName === client.name || inv.clientId === client._id || inv.clientId === client.id).filter(Boolean);
      const computedTotal = clientInvoices.reduce((sum, inv) => sum + Number(inv.totalTTC ?? inv.amountHT ?? inv.amount ?? 0), 0) || Number(client.montant || 0) || Number(client.totalRevenue || 0);

      return {
        id: client._id || client.id || client.name,
        clientId: client._id || client.id || client.name,
        clientName: client.name,
        date: client.registrationDate || new Date().toISOString().slice(0, 10),
        totalTTC: computedTotal,
        paymentMethod: client.industry || 'Client',
        paymentStatus: client.status || 'Solvable',
        flags: client.hasRisks ? ['Risk profile flagged'] : [],
        sourceType: 'client'
      };
    };
    
    // If a single client is selected, ignore global filters and show only theirs
    if (selectedClientName) {
      return result.filter(inv => inv.clientName === selectedClientName).sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    if (currentView === 'dashboard') {
      let clientsResult = clientsData;

      if (filter !== 'Tous') {
        clientsResult = clientsResult.filter((client) => {
          if (filter === 'Solvable') return client.isSolvable;
          if (filter === 'Fidele') return client.isFidele;
          if (filter === 'Risk') return client.hasRisks;
          return true;
        });
      }

      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        clientsResult = clientsResult.filter((client) =>
          client.name?.toLowerCase().includes(q) ||
          String(client.montant || client.totalRevenue || 0).includes(q)
        );
      }

      return clientsResult.map(toClientRow);
    }

    if (currentView === 'solvable') {
      let filtered = clientsData.filter((client) => clientsStatusByName[client.name] === 'Solvable');
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        filtered = filtered.filter((client) => client.name?.toLowerCase().includes(q));
      }
      return filtered.map(toClientRow);
    } else if (currentView === 'fidèle') {
      let filtered = clientsData.filter((client) => clientsStatusByName[client.name] === 'Fidèle');
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        filtered = filtered.filter((client) => client.name?.toLowerCase().includes(q));
      }
      return filtered.map(toClientRow);
    } else if (currentView === 'insolvable') {
      let filtered = clientsData.filter((client) => clientsStatusByName[client.name] === 'Insolvable');
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        filtered = filtered.filter((client) => client.name?.toLowerCase().includes(q));
      }
      return filtered.map(toClientRow);
    } else if (filter !== 'Tous') {
      result = result.filter(inv => {
        const client = clientsData.find(c => c.name === inv.clientName);
        if (filter === 'Solvable') return client?.isSolvable;
        if (filter === 'Fidele') return client?.isFidele;
        if (filter === 'Risk') return client?.hasRisks;
        return true;
      });
    }

    if (searchQuery.trim() && !['dashboard', 'solvable', 'fidèle', 'insolvable'].includes(currentView)) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(inv =>
        inv.clientName?.toLowerCase().includes(q) ||
        inv.reference?.toLowerCase().includes(q) ||
        (inv.totalTTC != null && String(inv.totalTTC).includes(q))
      );
    }

    return result.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [invoices, clientsData, filter, selectedClientName, currentView, clientsStatusByName, searchQuery]);

  const changeView = (view) => {
    setCurrentView(view);
    setSelectedClientName(null);
    setFilter('Tous');
    setSearchQuery('');
    if (isMobile) setIsMobileSidebarOpen(false);
    if (view === 'dashboard') {
      navigate('/');
    } else if (view === 'settings') {
      navigate('/settings');
    } else if (view === 'client-details' && clientDetailsId) {
      navigate(`/clients/${encodeURIComponent(String(clientDetailsId))}`);
    } else {
      navigate(`/?view=${encodeURIComponent(view)}`);
    }
  };

  const openClientDetails = (clientId) => {
    if (!clientId) return;
    setClientDetailsId(String(clientId));
    setCurrentView('client-details');
    if (isMobile) setIsMobileSidebarOpen(false);
    navigate(`/clients/${encodeURIComponent(String(clientId))}`);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (isProfileSaving) return;
    if (!token) {
      setSettingsMessage('Error: Please log in to update your profile.');
      return;
    }

    // Validation
    if (!profileForm.fullName?.trim()) {
      setSettingsMessage('Error: Full name is required.');
      return;
    }
    if (!profileForm.email?.trim()) {
      setSettingsMessage('Error: Email is required.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileForm.email)) {
      setSettingsMessage('Error: Please enter a valid email address.');
      return;
    }

    setIsProfileSaving(true);
    setSettingsMessage('');

    try {
      const payload = await authApi.updateProfile({
        fullName: profileForm.fullName.trim(),
        email: profileForm.email.trim().toLowerCase(),
        companyName: profileForm.companyName?.trim() || '',
        profileImage: profileForm.profileImage
      }, token);

      if (!payload || !payload.user) {
        throw new Error('Invalid response from server');
      }

      // Migrate localStorage if email changed
      if (user?.email && profileForm.email && user.email.toLowerCase() !== profileForm.email.toLowerCase()) {
        const oldDataKey = `finance_crm_data_${user.email}`;
        const oldRisksKey = `finance_crm_risks_${user.email}`;
        const newDataKey = `finance_crm_data_${profileForm.email}`;
        const newRisksKey = `finance_crm_risks_${profileForm.email}`;
        const existingData = localStorage.getItem(oldDataKey);
        const existingRisks = localStorage.getItem(oldRisksKey);

        if (existingData) {
          localStorage.setItem(newDataKey, existingData);
          localStorage.removeItem(oldDataKey);
        }
        if (existingRisks) {
          localStorage.setItem(newRisksKey, existingRisks);
          localStorage.removeItem(oldRisksKey);
        }
      }

      login(payload);

      setProfileForm({
        fullName: payload.user.fullName || '',
        email: payload.user.email || '',
        companyName: payload.user.companyName || '',
        profileImage: payload.user.profileImage || ''
      });
      
      setSettingsMessage('Success: Profile updated successfully!');
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Profile update error:', error);
      setSettingsMessage(`Error: ${error.message || 'Failed to update profile. Please try again.'}`);
    } finally {
      setIsProfileSaving(false);
    }
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const imageData = String(reader.result || '');
      setProfileForm(prev => ({ ...prev, profileImage: imageData }));
      setSettingsMessage('Profile image selected. Save your profile to apply it.');
    };
    reader.readAsDataURL(file);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!user || !token) {
      setSettingsMessage('Please log in to change your password.');
      return;
    }

    // Validation
    if (!passwordForm.currentPassword?.trim()) {
      setSettingsMessage('Current password is required.');
      return;
    }
    if (!passwordForm.newPassword?.trim()) {
      setSettingsMessage('New password is required.');
      return;
    }
    if (!passwordForm.confirmPassword?.trim()) {
      setSettingsMessage('Password confirmation is required.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setSettingsMessage('New password and confirmation password do not match.');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setSettingsMessage('New password must be at least 6 characters long.');
      return;
    }

    const updatePassword = async () => {
      try {
        await authApi.updatePassword({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
          confirmPassword: passwordForm.confirmPassword
        }, token);

        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setSettingsMessage('Password updated successfully. Please log in again with your new password.');
        
        // Optional: logout after password change
        setTimeout(() => {
          handleLogout();
        }, 2000);
      } catch (error) {
        console.error('Password change error:', error);
        setSettingsMessage(error.message || 'Unable to update password. Please try again.');
      }
    };

    void updatePassword();
  };

  // --- CRUD ACTIONS ---
  const openModal = (invoice = null) => {
    if (invoice) {
      setFormData({ clientStatus: 'Fidele', ...invoice });
      setEditingId(invoice.id);
      setInvoiceError('');
    } else {
      const selectedClient = clients.find((client) => client.name === selectedClientName) || null;
      setFormData({ clientId: selectedClient?._id || '', clientName: selectedClientName || '', clientStatus: 'Fidele', date: '', dueDate: '', amountHT: '', tva: '', paymentStatus: 'Pending', paymentDelay: 0, paymentMethod: 'Bank Transfer', status: 'En attente' });
      setEditingId(null);
      setInvoiceError('');
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amountHT = Number(formData.amountHT);
    const tva = Number(formData.tva);
    const resolvedClientName = String(formData.clientName || selectedClientName || '').trim();
    const resolvedClientId = formData.clientId || clients.find((client) => client.name === resolvedClientName)?._id || '';
    const newInvoice = {
      ...formData,
      clientId: resolvedClientId,
      clientName: resolvedClientName,
      amountHT,
      tva,
      totalTTC: amountHT + tva,
      paymentDelay: Number(formData.paymentDelay),
      flags: [],
      status: formData.status || 'En attente'
    };

    try {
      if (!newInvoice.clientName) {
        throw new Error('Please enter a client name before saving the invoice.');
      }

      if (editingId) {
        const clientId = newInvoice.clientId;
        await updateClientInvoice(clientId, editingId, newInvoice);
        setInvoices((current) => current.map((inv) => (inv.id === editingId ? { ...newInvoice, id: editingId } : inv)));
      } else {
        const createdClient = await createInvoice(newInvoice);
        setSelectedClientName(createdClient?.name || newInvoice.clientName || null);
        setCurrentView('dashboard');
        setFilter('Tous');
      }

      setHasAudited(false);
      setIsModalOpen(false);
      setInvoiceError('');
    } catch (error) {
      setInvoiceError(error.message || 'Unable to save invoice.');
    }
  };

  const handleDelete = (id) => {
    setInvoices(invoices.filter(inv => inv.id !== id));
  };

  const resetClientForm = () => {
    setClientForm({
      name: '',
      company: '',
      status: 'Solvable',
      email: '',
      phone: '',
      industry: '',
      montant: ''
    });
    setEditingClientId('');
  };

  const startEditClient = (client) => {
    setEditingClientId(String(client?._id || client?.id || ''));
    setClientForm({
      name: client?.name || '',
      company: client?.company || '',
      status: client?.status || 'Solvable',
      email: client?.email || '',
      phone: client?.phone || '',
      industry: client?.industry || '',
      montant: client?.montant || ''
    });
    setClientFeedback('');
  };

  const handleSaveClient = (event) => {
    event.preventDefault();

    if (!clientForm.name.trim()) {
      setClientFeedback('Client name is required.');
      return;
    }

    const payload = {
      ...clientForm,
      name: clientForm.name.trim(),
      company: clientForm.company.trim() || clientForm.name.trim(),
      email: clientForm.email.trim(),
      phone: clientForm.phone.trim(),
      industry: clientForm.industry.trim(),
      montant: clientForm.montant
    };

    if (editingClientId) {
      updateClient(editingClientId, payload);
      setClientFeedback('Client updated successfully.');
    } else {
      addClient(payload);
      setClientFeedback('Client created successfully.');
    }

    resetClientForm();
  };

  const handleDeleteClientRecord = (clientId) => {
    if (!window.confirm('Delete this client? This action cannot be undone.')) {
      return;
    }

    deleteClient(clientId);
    if (editingClientId && editingClientId === String(clientId)) {
      resetClientForm();
    }
    setClientFeedback('Client deleted successfully.');
  };

  const markAsPaid = (id) => {
    setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status: 'Payée' } : inv));
    setSelectedInvoice(prev => prev && prev.id === id ? { ...prev, status: 'Payée' } : prev);
  };

  const getInvoiceDisplayStatus = (invoice) => {
    if (invoice?.status === 'Payée') {
      return { label: 'Payée', className: 'text-[var(--c-positive)] bg-[var(--c-positive-bg)] border-[var(--c-positive-border)]' };
    }

    const dueDate = invoice?.dueDate ? new Date(invoice.dueDate) : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dueDate && !Number.isNaN(dueDate.getTime())) {
      const normalizedDueDate = new Date(dueDate);
      normalizedDueDate.setHours(0, 0, 0, 0);

      if (normalizedDueDate < today) {
        return { label: 'En retard', className: 'text-[var(--c-danger)] bg-[var(--c-danger-bg)] border-[var(--c-danger-border)]' };
      }
    }

    return { label: 'En attente', className: 'text-[var(--c-warning)] bg-[var(--c-warning-bg)] border-[var(--c-warning-border)]' };
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
    logout();
    setInvoices([]);
    setHasAudited(false);
    setFilter('Tous');
    setSelectedClientName(null);
  };

  const selectedClientData = clientsData.find(c => c.name === selectedClientName);
  const showSidebarLabels = isMobile || isSidebarExpanded;
  const isSettingsPage = currentView === 'settings';
  const isClientManagementPage = currentView === 'clients-management';
  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileSidebarOpen(prev => !prev);
    } else {
      setIsSidebarExpanded(prev => !prev);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return (
      <AuthPage 
        onLogin={({ user: authUser, token: authToken }) => {
          login({ user: authUser, token: authToken });
          const savedInfo = localStorage.getItem(`finance_crm_data_${authUser.email}`);
          setInvoices(savedInfo ? JSON.parse(savedInfo) : []);
        }}
      />
    );
  }

  return (
    <div className="flex h-screen bg-[var(--c-bg)] font-sans text-[var(--c-text)] overflow-hidden relative">
      {/* Neon glow accents */}
      <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(251,146,60,0.25) 0%, rgba(234,88,12,0.10) 50%, transparent 70%)' }} />
      <div className="absolute -top-20 -right-20 w-[450px] h-[450px] rounded-full blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(217,70,239,0.25) 0%, rgba(147,51,234,0.10) 50%, transparent 70%)' }} />
      {isMobile && isMobileSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-[var(--c-overlay)] backdrop-blur-sm z-30 lg:hidden"
        />
      )}
      
      {/* === SIDEBAR (DARK) === */}
      <div
        data-print-hide
        className={`${
        isMobile
          ? `fixed inset-y-0 left-0 w-72 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} z-40`
          : `${isSidebarExpanded ? 'w-72' : 'w-20'} relative translate-x-0 z-20`
      } bg-[var(--c-sidebar)] backdrop-blur-xl border-r border-[var(--c-border)] text-[var(--c-text-2)] flex flex-col shadow-[var(--c-glow)] shrink-0 transition-all duration-300 ease-in-out overflow-hidden`}>
        <div className="p-6 border-b border-[var(--c-border)] flex items-center justify-between">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-[var(--c-element-hover)] rounded-lg transition-colors text-[var(--c-text-3)] hover:text-[var(--c-text)] shrink-0"
            title={showSidebarLabels ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {showSidebarLabels ? <XIcon size={18} /> : <MenuIcon size={18} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 space-y-8">
          
          {/* Core Navigation */}
          <div className="px-4">
            <button 
              onClick={() => changeView('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium tracking-wider ${!selectedClientName && currentView === 'dashboard' ? 'bg-[var(--c-element)] text-[var(--c-text)] shadow-sm' : 'hover:bg-[var(--c-element-hover)] hover:text-[var(--c-text)]'}`}
              title="Global Dashboard"
            >
              <ActivityIcon size={18} /> 
              {showSidebarLabels && <span>Global Dashboard</span>}
            </button>
            <button
              onClick={() => changeView('clients-management')}
              className={`mt-2 w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium tracking-wider ${!selectedClientName && currentView === 'clients-management' ? 'bg-[var(--c-element)] text-[var(--c-text)] shadow-sm' : 'hover:bg-[var(--c-element-hover)] hover:text-[var(--c-text)]'}`}
              title="Client Management"
            >
              <UsersIcon size={18} />
              {showSidebarLabels && <span>Client Management</span>}
            </button>
          </div>

          {/* Smart Filters */}
          <div className="px-4 space-y-2">
            {showSidebarLabels && (
              <span className="px-3 text-[11px] font-bold text-[var(--c-text-3)] uppercase tracking-wider">Financial Filters</span>
            )}
            <div className="space-y-1 mt-2">
              <button 
                onClick={() => changeView('solvable')} 
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-xs tracking-wider ${!selectedClientName && currentView === 'solvable' ? 'bg-[var(--c-element)] text-[var(--c-text)] shadow-sm' : 'hover:bg-[var(--c-element-hover)] hover:text-[var(--c-text)] border border-transparent'}`}
                title="Solvable Clients"
              >
                <span className="text-[var(--c-positive)]"><ShieldCheckIcon size={16}/></span> 
                {showSidebarLabels && <span>Solvable Clients</span>}
              </button>
              <button 
                onClick={() => changeView('fidèle')} 
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-xs tracking-wider ${!selectedClientName && currentView === 'fidèle' ? 'bg-[var(--c-element)] text-[var(--c-text)] shadow-sm' : 'hover:bg-[var(--c-element-hover)] hover:text-[var(--c-text)] border border-transparent'}`}
                title="Fidèle Clients"
              >
                <span className="text-[var(--c-info)]"><StarIcon size={16}/></span> 
                {showSidebarLabels && <span>Fidèle Clients</span>}
              </button>
              <button 
                onClick={() => changeView('insolvable')} 
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-xs tracking-wider ${!selectedClientName && currentView === 'insolvable' ? 'bg-[var(--c-element)] text-[var(--c-text)] shadow-sm' : 'hover:bg-[var(--c-element-hover)] hover:text-[var(--c-text)] border border-transparent'}`}
                title="Insolvable Clients"
              >
                <span className="text-[var(--c-warning)]"><TriangleAlertIcon size={16}/></span> 
                {showSidebarLabels && <span>Insolvable Clients</span>}
              </button>
              <button 
                onClick={() => changeView('risks')} 
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-xs tracking-wider ${!selectedClientName && currentView === 'risks' ? 'bg-[var(--c-element)] text-[var(--c-text)] shadow-sm' : 'hover:bg-[var(--c-element-hover)] hover:text-[var(--c-text)] border border-transparent'}`}
                title="Risk Anomalies"
              >
                <span className="text-[var(--c-danger)]"><InfoIcon size={16}/></span> 
                {showSidebarLabels && <span>Risk Anomalies</span>}
              </button>
              <button 
                onClick={() => changeView('devis')} 
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-xs tracking-wider ${!selectedClientName && currentView === 'devis' ? 'bg-[var(--c-element)] text-[var(--c-text)] shadow-sm' : 'hover:bg-[var(--c-element-hover)] hover:text-[var(--c-text)] border border-transparent'}`}
                title="Devis Manager"
              >
                <span className="text-[var(--c-positive)]"><DollarSignIcon size={16}/></span> 
                {showSidebarLabels && <span>Devis Manager</span>}
              </button>
            </div>
          </div>

        
        </div>
        

      </div>

      {/* === MAIN CONTENT === */}
      <div className="flex-1 overflow-y-auto relative flex flex-col">
        
        {/* Top Header */}
        <header data-print-hide className="bg-[var(--c-elevated)] backdrop-blur-xl border-b border-[var(--c-border)] px-8 py-5 flex justify-between items-center z-10 sticky top-0 shadow-sm">
          <div>
            <button
              onClick={toggleSidebar}
              className="lg:hidden mb-3 p-2 bg-[var(--c-element)] hover:bg-[var(--c-element-hover)] rounded-lg transition-colors text-[var(--c-text-2)]"
              title="Toggle sidebar"
            >
              <MenuIcon size={18} />
            </button>
            <h2 className="text-lg font-bold text-[var(--c-text)]">
              {isSettingsPage
                ? 'Settings'
                : isClientManagementPage
                  ? 'Client Management'
                  : currentView === 'risks'
                    ? 'Risk Anomalies'
                    : currentView === 'devis'
                      ? 'Devis Manager'
                      : currentView === 'client-details'
                        ? 'Client Details'
                        : (currentView !== 'dashboard'
                            ? `Clients List - ${currentView === 'fidèle' ? 'Fidèles' : currentView === 'insolvable' ? 'Insolvables' : 'Solvables'}`
                            : (selectedClientName ? `${selectedClientName} - Profile` : 'Enterprise Dashboard'))}
            </h2>
              <p className="text-sm text-[var(--c-text-3)] font-medium tracking-wide">
                {isSettingsPage
                  ? 'Manage your account details, security, and session settings.'
                  : isClientManagementPage
                    ? 'Create, edit, and remove client records.'
                    : currentView === 'risks'
                      ? 'Regulatory anomalies and flagged invoices.'
                      : currentView === 'devis'
                        ? 'Create and manage client devis (estimates).'
                        : currentView === 'client-details'
                          ? 'Dedicated client audit and finance tracking'
                          : (currentView !== 'dashboard'
                              ? `Filtered by status: ${currentView === 'fidèle' ? 'Fidèle' : currentView === 'insolvable' ? 'Insolvable' : 'Solvable'}`
                              : (selectedClientName ? 'Dedicated client audit and finance tracking' : (user?.companyName ? `Overview for ${user.companyName}` : 'Enterprise firm overview')))}
              </p>
            </div>
          <div className="flex gap-2">
              <NotificationBell />
            <button onClick={() => handleRunAudit()} disabled={invoices.length === 0} className="bg-[var(--c-element)] hover:bg-[var(--c-element-hover-2)] text-[var(--c-text)] rounded-xl backdrop-blur-sm border border-[var(--c-border)] px-4 py-2.5 flex items-center justify-center gap-2 font-semibold text-xs tracking-wider uppercase transition-all disabled:opacity-50">
              <ShieldXIcon size={14} /> Scan for Risks
            </button>
            <button onClick={() => openModal()} className="bg-[var(--c-element)] hover:bg-[var(--c-element-hover-2)] text-[var(--c-text)] rounded-xl backdrop-blur-sm border border-[var(--c-border)] px-4 py-2.5 flex items-center justify-center gap-2 font-semibold text-xs tracking-wider uppercase transition-all">
              <PlusIcon size={14} /> Add Invoice
            </button>
            <ThemeToggle />
            <SettingsDropdown user={user} onLogout={handleLogout} changeView={changeView} />
          </div>
        </header>

        <main className="p-8 space-y-8 max-w-7xl w-full mx-auto">
          {currentView === 'client-details' ? (
            <ProtectedPermissionRoute action="view_clients">
              <ClientDetailsPage
                key={clientDetailsId || 'client-details'}
                clientId={clientDetailsId || ''}
                onBack={() => changeView('dashboard')}
                onDelete={() => {
                  navigate('/');
                  setCurrentView('dashboard');
                }}
                startEditClient={startEditClient}
                changeView={changeView}
              />
            </ProtectedPermissionRoute>
          ) : isSettingsPage ? (
            <SettingsView
              user={user}
              profileForm={profileForm}
              setProfileForm={setProfileForm}
              isEditingProfile={isEditingProfile}
              setIsEditingProfile={setIsEditingProfile}
              handleSaveProfile={handleSaveProfile}
              handleProfileImageChange={handleProfileImageChange}
              passwordForm={passwordForm}
              setPasswordForm={setPasswordForm}
              handleChangePassword={handleChangePassword}
              settingsMessage={settingsMessage}
              handleLogout={handleLogout}
              isProfileSaving={isProfileSaving}
            />
          ) : isClientManagementPage ? (
            <ClientManagementView
              editingClientId={editingClientId}
              clientForm={clientForm}
              setClientForm={setClientForm}
              handleSaveClient={handleSaveClient}
              resetClientForm={resetClientForm}
              clientFeedback={clientFeedback}
              clients={clients}
              startEditClient={startEditClient}
              handleDeleteClientRecord={handleDeleteClientRecord}
            />
          ) : selectedClientName ? (
            <>
              <div className="bg-[var(--c-surface)] backdrop-blur-2xl border border-[var(--c-border-md)] rounded-2xl shadow-[var(--c-glow)] p-6 flex flex-col md:flex-row items-center gap-8 justify-between animate-in fade-in slide-in-from-bottom-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-[var(--c-accent)]"></div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[var(--c-placeholder)] tracking-widest uppercase">Finance Score</h3>
                  <p className="text-4xl font-black">{selectedClientData?.solvabilityScore}%</p>
                </div>
                <div className="flex gap-4">
                  <div className={`px-4 py-3 rounded-xl border flex flex-col items-center gap-1 min-w-30 ${selectedClientData?.isSolvable ? 'bg-[var(--c-positive-bg)] border-[var(--c-positive-border)] text-[var(--c-positive)]' : 'bg-[var(--c-danger-bg)] border-[var(--c-danger-border)] text-[var(--c-danger)]'}`}>
                    <ShieldCheckIcon size={22} className={selectedClientData?.isSolvable ? 'text-[var(--c-positive)]' : 'text-[var(--c-danger)]'} />
                    <span className="text-xs font-bold leading-none uppercase">{selectedClientData?.isSolvable ? 'Solvable' : 'Debt Risk'}</span>
                  </div>
                  <div className={`px-4 py-3 rounded-xl border flex flex-col items-center gap-1 min-w-30 ${selectedClientData?.isFidele ? 'bg-blue-500/10 border-[var(--c-info-border)] text-[var(--c-info)]' : 'bg-[var(--c-elevated)] border-[var(--c-border)] text-[var(--c-text-2)]'}`}>
                    <StarIcon size={22} className={selectedClientData?.isFidele ? 'text-[var(--c-info)]' : 'text-[var(--c-placeholder)]'} />
                    <span className="text-xs font-bold leading-none uppercase">{selectedClientData?.isFidele ? 'Fidèle' : 'New/Casual'}</span>
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
                onRowClick={openClientDetails}
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
              onRowClick={openClientDetails}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
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
              onRowClick={openClientDetails}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
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
              onRowClick={openClientDetails}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          ) : currentView === 'risks' ? (
            <>
              <AddRiskForm
                editAnomaly={editingRiskAnomaly}
                onAddRisk={(newRisk) => setRiskAnomalies([newRisk, ...riskAnomalies])}
                onEditRisk={(updated) => {
                  setRiskAnomalies((prev) => prev.map((r) => r.id === updated.id ? updated : r));
                  setEditingRiskAnomaly(null);
                }}
              />
              <RiskAnomaliesList
                anomalies={riskAnomalies}
                onDelete={(id) => setRiskAnomalies(riskAnomalies.filter(r => r.id !== id))}
                onEdit={(anomaly) => setEditingRiskAnomaly(anomaly)}
              />
            </>
          ) : currentView === 'devis' ? (
            <DevisManager devisList={devisList} onAddDevis={async (d) => {
  try {
    const saved = await devisApi.create(d, token);
    setDevisList((prev) => [saved, ...prev]);
    createInvoice({
      clientName: d.client?.name || '',
      amountHT: d.amountHT,
      tva: d.tva,
      totalTTC: d.totalTTC,
      status: d.status,
      paymentStatus: d.status === 'Accepté' ? 'Paid' : 'Pending',
      reference: d.reference,
      method: 'Bank Transfer',
      date: d.createdAt ? d.createdAt.slice(0, 10) : new Date().toISOString().slice(0, 10),
      dueDate: d.createdAt ? new Date(new Date(d.createdAt).getTime() + 30*24*60*60*1000).toISOString().slice(0, 10) : '',
      paymentDelay: 0,
      flags: [],
      source: 'devis'
    }).catch(() => {});
  } catch (err) {
    console.error('Failed to save devis:', err);
  }
}} onDeleteDevis={async (id) => {
  try {
    await devisApi.remove(id, token);
    setDevisList((prev) => prev.filter((d) => d.id !== id));
  } catch (err) {
    console.error('Failed to delete devis:', err);
  }
}} clients={clients} companyInfo={companyInfo} onUpdateCompanyInfo={setCompanyInfo} />
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
                onRowClick={openClientDetails}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </>
          )}
        </main>
      </div>

      {/* === ADD/EDIT MODAL === */}
      <InvoiceModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        editingId={editingId}
        invoiceError={invoiceError}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
      />

      {/* === FISCAL EXPLANATION SLIDE-OVER DRAWER === */}
      <AuditDrawer
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        selectedInvoice={selectedInvoice}
        getInvoiceDisplayStatus={getInvoiceDisplayStatus}
        markAsPaid={markAsPaid}
      />

    </div>
  );
}

