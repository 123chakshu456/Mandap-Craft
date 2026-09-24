import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  ShoppingBag,
  MessageSquareQuote,
  IndianRupee,
  FileText,
  Plus,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  RefreshCw,
  Calendar,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  X,
  Clock,
  Trash2,
  Pencil,
} from 'lucide-react';
import { adminApi } from '../services/adminApi';
import { orderApi } from '../../orders/services/orderApi';
import { quoteApi } from '../../quotes/services/quoteApi';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog/ConfirmDialog';
import type { AdminStats, Order, Quote, AuditLog, Product } from '../../../shared/types/models.types';

type DatePreset = 'all' | 'today' | '7d' | '30d' | 'month' | 'custom';
type OrderSortField = 'createdAt' | 'grandTotal' | 'orderNumber' | 'customerName';
type QuoteSortField = 'createdAt' | 'estimated' | 'email';
type SortDirection = 'asc' | 'desc';

export const DashboardOverviewPage: React.FC = () => {
  const navigate = useNavigate();

  // Primary Data States
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [recentQuotes, setRecentQuotes] = useState<Quote[]>([]);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [auditLoading, setAuditLoading] = useState(false);

  // Global Date Filter States
  const [datePreset, setDatePreset] = useState<DatePreset>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [appliedCustomDates, setAppliedCustomDates] = useState<{ start: string; end: string } | null>(null);

  // Recent Orders Local Filters & Sort
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSortField, setOrderSortField] = useState<OrderSortField>('createdAt');
  const [orderSortDir, setOrderSortDir] = useState<SortDirection>('desc');

  // Recent Quotes Local Filters & Sort
  const [quoteStatusFilter, setQuoteStatusFilter] = useState('all');
  const [quoteSortField, setQuoteSortField] = useState<QuoteSortField>('createdAt');
  const [quoteSortDir, setQuoteSortDir] = useState<SortDirection>('desc');

  // Audit Log Local Filters
  const [auditDateFilter, setAuditDateFilter] = useState<DatePreset>('all');
  const [auditActionFilter, setAuditActionFilter] = useState('all');
  const [auditSearch, setAuditSearch] = useState('');
  const [auditSortDir, setAuditSortDir] = useState<SortDirection>('desc');

  // Quick Delete States
  const [orderDeleteTarget, setOrderDeleteTarget] = useState<Order | null>(null);
  const [quoteDeleteTarget, setQuoteDeleteTarget] = useState<Quote | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Helper to compute date range from preset
  const getDateRangeForPreset = useCallback((preset: DatePreset, custom?: { start: string; end: string } | null) => {
    const now = new Date();
    if (preset === 'today') {
      const todayStr = now.toISOString().split('T')[0];
      return { startDate: todayStr, endDate: todayStr };
    }
    if (preset === '7d') {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      return { startDate: d.toISOString().split('T')[0], endDate: now.toISOString().split('T')[0] };
    }
    if (preset === '30d') {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      return { startDate: d.toISOString().split('T')[0], endDate: now.toISOString().split('T')[0] };
    }
    if (preset === 'month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return { startDate: startOfMonth.toISOString().split('T')[0], endDate: now.toISOString().split('T')[0] };
    }
    if (preset === 'custom' && custom?.start && custom?.end) {
      return { startDate: custom.start, endDate: custom.end };
    }
    return { startDate: undefined, endDate: undefined };
  }, []);

  // Fetch Dashboard Stats & Primary Data
  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const { startDate, endDate } = getDateRangeForPreset(datePreset, appliedCustomDates);
      const data = await adminApi.getStats({ startDate, endDate });
      setStats(data.stats);
      setRecentOrders(data.recentOrders || []);
      setRecentQuotes(data.recentQuotes || []);
      setRecentProducts(data.recentProducts || []);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  }, [datePreset, appliedCustomDates, getDateRangeForPreset]);

  // Fetch Audit Logs
  const loadAuditLogs = useCallback(async () => {
    setAuditLoading(true);
    try {
      const { startDate, endDate } = getDateRangeForPreset(auditDateFilter);
      const logs = await adminApi.getAuditLogs({
        limit: 12,
        action: auditActionFilter !== 'all' ? auditActionFilter : undefined,
        startDate,
        endDate,
        search: auditSearch.trim() || undefined,
        sortOrder: auditSortDir,
      });
      setAuditLogs(logs || []);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setAuditLoading(false);
    }
  }, [auditDateFilter, auditActionFilter, auditSearch, auditSortDir, getDateRangeForPreset]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  useEffect(() => {
    loadAuditLogs();
  }, [loadAuditLogs]);

  const handleApplyCustomDateRange = () => {
    if (!customStartDate || !customEndDate) {
      alert('Please select both Start Date and End Date.');
      return;
    }
    setAppliedCustomDates({ start: customStartDate, end: customEndDate });
  };

  const handleClearDateFilter = () => {
    setDatePreset('all');
    setCustomStartDate('');
    setCustomEndDate('');
    setAppliedCustomDates(null);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const formatDateTime = (isoString?: string) => {
    if (!isoString) return { date: '—', time: '' };
    const dateObj = new Date(isoString);
    if (isNaN(dateObj.getTime())) return { date: '—', time: '' };
    const date = dateObj.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
    const time = dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    return { date, time };
  };

  const formatUploadTiming = (isoString?: string) => {
    if (!isoString) return { date: '—', time: '', relative: '', full: 'Not recorded' };
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return { date: '—', time: '', relative: '', full: 'Invalid date' };

    const date = d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const time = d.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

    const diffMs = Date.now() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    let relative = '';
    if (diffMins < 1) relative = 'Just now';
    else if (diffMins < 60) relative = `${diffMins}m ago`;
    else if (diffHours < 24) relative = `${diffHours}h ago`;
    else if (diffDays === 1) relative = 'Yesterday';
    else if (diffDays < 7) relative = `${diffDays}d ago`;
    else relative = `${Math.floor(diffDays / 7)}w ago`;

    return { date, time, relative, full: `${date} at ${time}` };
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { bg: string; color: string }> = {
      CONFIRMED: { bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399' },
      PROCESSING: { bg: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' },
      SHIPPED: { bg: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' },
      DELIVERED: { bg: 'rgba(34, 197, 94, 0.15)', color: '#4ade80' },
      CANCELLED: { bg: 'rgba(239, 68, 68, 0.15)', color: '#f87171' },
      PENDING: { bg: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' },
      REVIEWED: { bg: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc' },
      APPROVED: { bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399' },
      REJECTED: { bg: 'rgba(239, 68, 68, 0.15)', color: '#f87171' },
    };
    const style = map[status] || { bg: '#1e293b', color: '#94a3b8' };
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '2px 8px',
          borderRadius: '99px',
          fontSize: '0.72rem',
          fontWeight: 600,
          background: style.bg,
          color: style.color,
          letterSpacing: '0.04em',
        }}
      >
        {status}
      </span>
    );
  };

  const getAuditActionBadge = (action: string) => {
    let bg = 'rgba(100, 116, 139, 0.15)';
    let color = '#94a3b8';

    if (action.includes('PUBLISH') || action === 'CREATE_PRODUCT') {
      bg = 'rgba(16, 185, 129, 0.15)';
      color = '#34d399';
    } else if (action.includes('BULK_UPDATE') || action === 'UPDATE_PRODUCT') {
      bg = 'rgba(99, 102, 241, 0.15)';
      color = '#a5b4fc';
    } else if (action.includes('UPLOAD')) {
      bg = 'rgba(6, 182, 212, 0.15)';
      color = '#67e8f9';
    } else if (action.includes('UNPUBLISH')) {
      bg = 'rgba(245, 158, 11, 0.15)';
      color = '#fbbf24';
    } else if (action.includes('DELETE')) {
      bg = 'rgba(239, 68, 68, 0.15)';
      color = '#f87171';
    }

    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '2px 8px',
          borderRadius: '99px',
          fontSize: '0.7rem',
          fontWeight: 700,
          background: bg,
          color: color,
          fontFamily: 'monospace',
          letterSpacing: '0.03em',
        }}
      >
        {action}
      </span>
    );
  };

  // Filter and Sort Recent Orders
  const filteredSortedOrders = useMemo(() => {
    let list = [...recentOrders];
    if (orderStatusFilter !== 'all') {
      list = list.filter((o) => o.status === orderStatusFilter);
    }
    list.sort((a, b) => {
      let aVal: any = a[orderSortField];
      let bVal: any = b[orderSortField];

      if (orderSortField === 'createdAt') {
        aVal = new Date(a.createdAt || 0).getTime();
        bVal = new Date(b.createdAt || 0).getTime();
      } else if (orderSortField === 'grandTotal') {
        aVal = Number(a.grandTotal) || 0;
        bVal = Number(b.grandTotal) || 0;
      } else {
        aVal = String(aVal || '').toLowerCase();
        bVal = String(bVal || '').toLowerCase();
      }

      if (aVal < bVal) return orderSortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return orderSortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [recentOrders, orderStatusFilter, orderSortField, orderSortDir]);

  const toggleOrderSort = (field: OrderSortField) => {
    if (orderSortField === field) {
      setOrderSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setOrderSortField(field);
      setOrderSortDir('desc');
    }
  };

  // Filter and Sort Recent Quotes
  const filteredSortedQuotes = useMemo(() => {
    let list = [...recentQuotes];
    if (quoteStatusFilter !== 'all') {
      list = list.filter((q) => q.status === quoteStatusFilter);
    }
    list.sort((a, b) => {
      let aVal: any = a[quoteSortField];
      let bVal: any = b[quoteSortField];

      if (quoteSortField === 'createdAt') {
        aVal = new Date(a.createdAt || 0).getTime();
        bVal = new Date(b.createdAt || 0).getTime();
      } else if (quoteSortField === 'estimated') {
        aVal = Number(a.estimated) || 0;
        bVal = Number(b.estimated) || 0;
      } else {
        aVal = String(aVal || '').toLowerCase();
        bVal = String(bVal || '').toLowerCase();
      }

      if (aVal < bVal) return quoteSortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return quoteSortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [recentQuotes, quoteStatusFilter, quoteSortField, quoteSortDir]);

  const toggleQuoteSort = (field: QuoteSortField) => {
    if (quoteSortField === field) {
      setQuoteSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setQuoteSortField(field);
      setQuoteSortDir('desc');
    }
  };

  const getSortIcon = (currentField: string, targetField: string, dir: SortDirection) => {
    if (currentField !== targetField) {
      return <ArrowUpDown size={12} style={{ opacity: 0.4 }} />;
    }
    return dir === 'asc' ? <ArrowUp size={12} color="#818cf8" /> : <ArrowDown size={12} color="#818cf8" />;
  };

  const handleDeleteOrder = async () => {
    if (!orderDeleteTarget) return;
    setIsDeleting(true);
    try {
      await orderApi.deleteOrder(orderDeleteTarget.id);
      setRecentOrders((prev) => prev.filter((o) => o.id !== orderDeleteTarget.id));
      if (stats) {
        setStats({ ...stats, totalOrders: Math.max(0, (stats.totalOrders || 1) - 1) });
      }
      setOrderDeleteTarget(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete order.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteQuote = async () => {
    if (!quoteDeleteTarget) return;
    setIsDeleting(true);
    try {
      await quoteApi.deleteQuote(quoteDeleteTarget.id);
      setRecentQuotes((prev) => prev.filter((q) => q.id !== quoteDeleteTarget.id));
      if (stats) {
        setStats({ ...stats, totalQuotes: Math.max(0, (stats.totalQuotes || 1) - 1) });
      }
      setQuoteDeleteTarget(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete quote.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* ── TOP BANNER HEADER ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
            Executive Operations Cockpit
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0' }}>
            Live platform metrics, booking pipeline, quote requests, and mutation audit stream.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/admin/products/new')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
            }}
          >
            <Plus size={15} />
            <span>New SKU / Product</span>
          </button>
          <button
            onClick={() => navigate('/admin/orders')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 14px',
              borderRadius: '8px',
              background: '#1e293b',
              border: '1px solid #334155',
              color: '#cbd5e1',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            <ShoppingBag size={15} />
            <span>Manage Orders</span>
          </button>
          <button
            onClick={() => navigate('/admin/pages')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 14px',
              borderRadius: '8px',
              background: '#1e293b',
              border: '1px solid #334155',
              color: '#cbd5e1',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            <FileText size={15} />
            <span>Manage Pages</span>
          </button>
        </div>
      </div>

      {/* ── GLOBAL COCKPIT DATE RANGE FILTER BAR ── */}
      <div
        style={{
          background: '#0d1526',
          border: '1px solid #1e293b',
          borderRadius: '12px',
          padding: '14px 18px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#818cf8', fontWeight: 700, fontSize: '0.85rem' }}>
            <Calendar size={18} />
            <span>Metrics Window:</span>
          </div>

          {/* Date Presets */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All Time' },
              { id: 'today', label: 'Today' },
              { id: '7d', label: 'Last 7 Days' },
              { id: '30d', label: 'Last 30 Days' },
              { id: 'month', label: 'This Month' },
              { id: 'custom', label: 'Custom Range...' },
            ].map((p) => {
              const active = datePreset === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setDatePreset(p.id as DatePreset);
                    if (p.id !== 'custom') {
                      setAppliedCustomDates(null);
                    }
                  }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '7px',
                    fontSize: '0.78rem',
                    fontWeight: active ? 700 : 500,
                    cursor: 'pointer',
                    border: active ? '1px solid #6366f1' : '1px solid #1e293b',
                    background: active ? 'rgba(99, 102, 241, 0.2)' : '#090e1a',
                    color: active ? '#a5b4fc' : '#94a3b8',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Custom Date Pickers if selected */}
          {datePreset === 'custom' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                style={{
                  background: '#090e1a',
                  border: '1px solid #334155',
                  color: '#e2e8f0',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  outline: 'none',
                }}
              />
              <span style={{ color: '#64748b', fontSize: '0.8rem' }}>to</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                style={{
                  background: '#090e1a',
                  border: '1px solid #334155',
                  color: '#e2e8f0',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  outline: 'none',
                }}
              />
              <button
                onClick={handleApplyCustomDateRange}
                style={{
                  background: '#6366f1',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '5px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Apply
              </button>
            </div>
          )}
        </div>

        {/* Current Filter Status Indicator & Refresh */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {datePreset !== 'all' && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                padding: '4px 10px',
                borderRadius: '99px',
                color: '#a5b4fc',
                fontSize: '0.74rem',
                fontWeight: 600,
              }}
            >
              <span>Filtered Data</span>
              <button
                onClick={handleClearDateFilter}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#a5b4fc',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                }}
                title="Clear date filter"
              >
                <X size={13} />
              </button>
            </div>
          )}

          <button
            onClick={loadDashboardData}
            disabled={loading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '7px',
              background: '#1e293b',
              border: '1px solid #334155',
              color: '#94a3b8',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '0.78rem',
              fontWeight: 600,
            }}
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>{loading ? 'Refreshing...' : 'Refresh KPIs'}</span>
          </button>
        </div>
      </div>

      {/* ── KPI METRICS GRID ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        {/* Total Revenue */}
        <div style={{ background: 'linear-gradient(135deg, #0d1526, #131d35)', border: '1px solid #1e293b', borderRadius: '14px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Gross Revenue</span>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(52, 211, 153, 0.15)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IndianRupee size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
            {loading ? '...' : formatCurrency(stats?.totalRevenue || 0)}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#34d399', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={13} /> {datePreset !== 'all' ? 'Filtered Window Revenue' : 'Direct booking settlements'}
          </div>
        </div>

        {/* Total Products */}
        <div style={{ background: 'linear-gradient(135deg, #0d1526, #131d35)', border: '1px solid #1e293b', borderRadius: '14px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Catalog SKUs</span>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
            {loading ? '...' : (stats?.totalProducts || 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '6px' }}>
            <span style={{ color: '#34d399', fontWeight: 600 }}>{stats?.publishedProducts || 0}</span> Published • <span style={{ color: '#fbbf24', fontWeight: 600 }}>{stats?.draftProducts || 0}</span> Drafts
          </div>
        </div>

        {/* Orders Volume */}
        <div style={{ background: 'linear-gradient(135deg, #0d1526, #131d35)', border: '1px solid #1e293b', borderRadius: '14px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total Orders</span>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
            {loading ? '...' : (stats?.totalOrders || 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '6px' }}>
            {datePreset !== 'all' ? 'Orders in Selected Period' : 'Lifetime Bookings'}
          </div>
        </div>

        {/* Quotes & Proposals */}
        <div style={{ background: 'linear-gradient(135deg, #0d1526, #131d35)', border: '1px solid #1e293b', borderRadius: '14px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Custom Quotes</span>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquareQuote size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
            {loading ? '...' : stats?.totalQuotes || 0}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#fbbf24', marginTop: '6px' }}>
            {stats?.pendingQuotes || 0} Pending Review
          </div>
        </div>
      </div>

      {/* ── RECENT ACTIVITY SECTIONS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px' }}>
        {/* ── RECENT ORDERS CARD ── */}
        <div
          style={{
            background: '#0d1526',
            border: '1px solid #1e293b',
            borderRadius: '14px',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid #1e293b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#0a1020',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingBag size={17} color="#818cf8" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>Recent Orders</h3>
              <span style={{ fontSize: '0.72rem', background: '#1e293b', color: '#94a3b8', padding: '2px 7px', borderRadius: '99px', fontWeight: 600 }}>
                {filteredSortedOrders.length}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Order Status Quick Filter */}
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                style={{
                  background: '#090e1a',
                  border: '1px solid #334155',
                  color: '#cbd5e1',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  fontSize: '0.74rem',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="all">All Statuses</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>

              <button
                onClick={() => navigate('/admin/orders')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'none',
                  border: 'none',
                  color: '#818cf8',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <span>View All</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Orders Table */}
          <div style={{ overflowX: 'auto' }}>
            {filteredSortedOrders.length === 0 ? (
              <div style={{ padding: '36px', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                No orders match the current filter window.
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ background: '#090e1a', color: '#64748b', textAlign: 'left', borderBottom: '1px solid #1e293b' }}>
                    <th
                      onClick={() => toggleOrderSort('orderNumber')}
                      style={{ padding: '10px 14px', cursor: 'pointer', userSelect: 'none' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span>Order #</span>
                        {getSortIcon(orderSortField, 'orderNumber', orderSortDir)}
                      </div>
                    </th>
                    <th
                      onClick={() => toggleOrderSort('customerName')}
                      style={{ padding: '10px 14px', cursor: 'pointer', userSelect: 'none' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span>Client</span>
                        {getSortIcon(orderSortField, 'customerName', orderSortDir)}
                      </div>
                    </th>
                    <th
                      onClick={() => toggleOrderSort('grandTotal')}
                      style={{ padding: '10px 14px', cursor: 'pointer', userSelect: 'none' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span>Amount</span>
                        {getSortIcon(orderSortField, 'grandTotal', orderSortDir)}
                      </div>
                    </th>
                    <th style={{ padding: '10px 14px' }}>Status</th>
                    <th
                      onClick={() => toggleOrderSort('createdAt')}
                      style={{ padding: '10px 14px', cursor: 'pointer', userSelect: 'none', width: '130px' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span>Date & Time</span>
                        {getSortIcon(orderSortField, 'createdAt', orderSortDir)}
                      </div>
                    </th>
                    <th style={{ padding: '10px 14px', width: '40px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSortedOrders.map((order) => {
                    const dt = formatDateTime(order.createdAt);
                    return (
                      <tr key={order.id} style={{ borderBottom: '1px solid #1a2335' }}>
                        <td style={{ padding: '12px 14px', fontWeight: 600, color: '#e2e8f0', fontFamily: 'monospace' }}>
                          {order.orderNumber}
                        </td>
                        <td style={{ padding: '12px 14px', color: '#94a3b8' }}>
                          <div style={{ color: '#cbd5e1', fontWeight: 600 }}>{order.customerName}</div>
                          {order.customerEmail && (
                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{order.customerEmail}</div>
                          )}
                        </td>
                        <td style={{ padding: '12px 14px', fontWeight: 700, color: '#34d399' }}>
                          {formatCurrency(order.grandTotal)}
                        </td>
                        <td style={{ padding: '12px 14px' }}>{getStatusBadge(order.status)}</td>
                        <td style={{ padding: '12px 14px', color: '#94a3b8', fontSize: '0.76rem', whiteSpace: 'nowrap' }}>
                          <div style={{ color: '#cbd5e1', fontWeight: 600 }}>{dt.date}</div>
                          <div style={{ color: '#64748b' }}>{dt.time}</div>
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={() => setOrderDeleteTarget(order)}
                            title="Discard Order Record"
                            style={{
                              padding: '5px 7px',
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.25)',
                              borderRadius: '6px',
                              color: '#f87171',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.15s',
                            }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* ── RECENT QUOTES CARD ── */}
        <div
          style={{
            background: '#0d1526',
            border: '1px solid #1e293b',
            borderRadius: '14px',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid #1e293b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#0a1020',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquareQuote size={17} color="#fbbf24" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>Recent Quotes</h3>
              <span style={{ fontSize: '0.72rem', background: '#1e293b', color: '#94a3b8', padding: '2px 7px', borderRadius: '99px', fontWeight: 600 }}>
                {filteredSortedQuotes.length}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Quote Status Quick Filter */}
              <select
                value={quoteStatusFilter}
                onChange={(e) => setQuoteStatusFilter(e.target.value)}
                style={{
                  background: '#090e1a',
                  border: '1px solid #334155',
                  color: '#cbd5e1',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  fontSize: '0.74rem',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="all">All Inquiries</option>
                <option value="PENDING">Pending</option>
                <option value="REVIEWED">Reviewed</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>

              <button
                onClick={() => navigate('/admin/quotes')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'none',
                  border: 'none',
                  color: '#fbbf24',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <span>View All</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Quotes Table */}
          <div style={{ overflowX: 'auto' }}>
            {filteredSortedQuotes.length === 0 ? (
              <div style={{ padding: '36px', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                No quote inquiries match the current filter window.
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ background: '#090e1a', color: '#64748b', textAlign: 'left', borderBottom: '1px solid #1e293b' }}>
                    <th
                      onClick={() => toggleQuoteSort('email')}
                      style={{ padding: '10px 14px', cursor: 'pointer', userSelect: 'none' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span>Client Email</span>
                        {getSortIcon(quoteSortField, 'email', quoteSortDir)}
                      </div>
                    </th>
                    <th style={{ padding: '10px 14px' }}>Venue / Scale</th>
                    <th
                      onClick={() => toggleQuoteSort('estimated')}
                      style={{ padding: '10px 14px', cursor: 'pointer', userSelect: 'none' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span>Est. Cost</span>
                        {getSortIcon(quoteSortField, 'estimated', quoteSortDir)}
                      </div>
                    </th>
                    <th style={{ padding: '10px 14px' }}>Status</th>
                    <th
                      onClick={() => toggleQuoteSort('createdAt')}
                      style={{ padding: '10px 14px', cursor: 'pointer', userSelect: 'none', width: '130px' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span>Date & Time</span>
                        {getSortIcon(quoteSortField, 'createdAt', quoteSortDir)}
                      </div>
                    </th>
                    <th style={{ padding: '10px 14px', width: '40px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSortedQuotes.map((quote) => {
                    const dt = formatDateTime(quote.createdAt);
                    return (
                      <tr key={quote.id} style={{ borderBottom: '1px solid #1a2335' }}>
                        <td style={{ padding: '12px 14px', color: '#e2e8f0', fontWeight: 600 }}>{quote.email}</td>
                        <td style={{ padding: '12px 14px', color: '#94a3b8', textTransform: 'capitalize' }}>
                          {quote.venue} ({quote.scale})
                        </td>
                        <td style={{ padding: '12px 14px', fontWeight: 700, color: '#fbbf24' }}>
                          {formatCurrency(quote.estimated)}
                        </td>
                        <td style={{ padding: '12px 14px' }}>{getStatusBadge(quote.status)}</td>
                        <td style={{ padding: '12px 14px', color: '#94a3b8', fontSize: '0.76rem', whiteSpace: 'nowrap' }}>
                          <div style={{ color: '#cbd5e1', fontWeight: 600 }}>{dt.date}</div>
                          <div style={{ color: '#64748b' }}>{dt.time}</div>
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={() => setQuoteDeleteTarget(quote)}
                            title="Discard Quote Request"
                            style={{
                              padding: '5px 7px',
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.25)',
                              borderRadius: '6px',
                              color: '#f87171',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.15s',
                            }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* ── RECENTLY UPLOADED SKUS & TIMINGS CARD ── */}
      <div
        style={{
          marginTop: '28px',
          background: '#0d1526',
          border: '1px solid #1e293b',
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#0a1020',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'rgba(99, 102, 241, 0.15)',
                color: '#818cf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Package size={17} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
                  Recently Uploaded Product SKUs
                </h3>
                <span
                  style={{
                    fontSize: '0.72rem',
                    background: 'rgba(99, 102, 241, 0.2)',
                    color: '#a5b4fc',
                    border: '1px solid rgba(99, 102, 241, 0.35)',
                    padding: '2px 8px',
                    borderRadius: '99px',
                    fontWeight: 700,
                  }}
                >
                  {recentProducts.length} Recent Uploads
                </span>
              </div>
              <p style={{ fontSize: '0.76rem', color: '#64748b', margin: '2px 0 0' }}>
                Real-time upload timeline showing when inventory items and catalogue SKUs were published to the platform
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => navigate('/admin/products')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '7px',
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                color: '#a5b4fc',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <span>View All 1,216 SKUs with Timings</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div style={{ overflowX: 'auto' }}>
          {recentProducts.length === 0 ? (
            <div style={{ padding: '36px', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
              No product uploads recorded yet.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: '#090e1a', color: '#64748b', textAlign: 'left', borderBottom: '1px solid #1e293b' }}>
                  <th style={{ padding: '10px 14px', width: '56px' }}>Image</th>
                  <th style={{ padding: '10px 14px', width: '150px' }}>SKU Code</th>
                  <th style={{ padding: '10px 14px' }}>Product Details</th>
                  <th style={{ padding: '10px 14px' }}>Category & Route</th>
                  <th style={{ padding: '10px 14px' }}>Price</th>
                  <th style={{ padding: '10px 14px' }}>Status</th>
                  <th style={{ padding: '10px 14px', width: '180px' }}>Upload Timing</th>
                  <th style={{ padding: '10px 14px', width: '70px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map((prod) => {
                  const { date, time, relative, full } = formatUploadTiming(prod.createdAt);
                  const isVeryRecent = relative === 'Just now' || relative.includes('m ago');
                  const isRecent = relative.includes('h ago') || relative === 'Yesterday';

                  return (
                    <tr
                      key={prod.id}
                      style={{
                        borderBottom: '1px solid #1a2335',
                        transition: 'background 0.15s',
                      }}
                    >
                      <td style={{ padding: '10px 14px' }}>
                        <img
                          src={prod.image || '/placeholder.jpg'}
                          alt={prod.name}
                          style={{
                            width: '40px',
                            height: '40px',
                            objectFit: 'cover',
                            borderRadius: '7px',
                            border: '1px solid #1e293b',
                            background: '#1e293b',
                          }}
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </td>
                      <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontWeight: 700, color: '#818cf8', fontSize: '0.8rem' }}>
                        {prod.sku || 'SKU-PENDING'}
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ fontWeight: 600, color: '#f1f5f9', lineHeight: 1.3 }}>
                          {prod.name}
                        </div>
                      </td>
                      <td style={{ padding: '10px 14px', color: '#94a3b8', textTransform: 'capitalize' }}>
                        {prod.categoryId} {prod.subcategoryId ? `› ${prod.subcategoryId}` : ''}
                      </td>
                      <td style={{ padding: '10px 14px', fontWeight: 700, color: '#34d399' }}>
                        {formatCurrency(prod.price)}
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        {getStatusBadge(prod.status)}
                      </td>
                      <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                        <div title={`Uploaded to platform on: ${full}`}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f1f5f9' }}>
                              {date}
                            </span>
                            {relative && (
                              <span
                                style={{
                                  fontSize: '0.66rem',
                                  fontWeight: 700,
                                  padding: '1px 6px',
                                  borderRadius: '4px',
                                  background: isVeryRecent
                                    ? 'rgba(16, 185, 129, 0.2)'
                                    : isRecent
                                    ? 'rgba(99, 102, 241, 0.18)'
                                    : 'rgba(30, 41, 59, 0.7)',
                                  color: isVeryRecent
                                    ? '#34d399'
                                    : isRecent
                                    ? '#a5b4fc'
                                    : '#94a3b8',
                                  border: isVeryRecent
                                    ? '1px solid rgba(16, 185, 129, 0.3)'
                                    : isRecent
                                    ? '1px solid rgba(99, 102, 241, 0.3)'
                                    : '1px solid rgba(51, 65, 85, 0.5)',
                                }}
                              >
                                {relative}
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={11} color="#64748b" />
                            <span>{time}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/products/${prod.id}`)}
                          title="Edit Product SKU"
                          style={{
                            padding: '5px 9px',
                            background: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '6px',
                            color: '#cbd5e1',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.74rem',
                            fontWeight: 600,
                            transition: 'all 0.15s',
                          }}
                        >
                          <Pencil size={12} />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── ENTERPRISE AUDIT LOG & MUTATION STREAM CARD ── */}
      <div
        style={{
          marginTop: '28px',
          background: '#0d1526',
          border: '1px solid #1e293b',
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.2)',
        }}
      >
        {/* Header & Filter Controls */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#0a1020',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
                Enterprise Audit Ledger & Mutation Stream
              </h3>
              <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '2px 0 0' }}>
                Cryptographic Postgres audit trail tracking catalog mutations, media uploads, and bulk operations.
              </p>
            </div>
          </div>

          {/* Audit Filter Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search size={13} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="text"
                placeholder="Search actor or entity..."
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                style={{
                  background: '#090e1a',
                  border: '1px solid #334155',
                  color: '#cbd5e1',
                  borderRadius: '6px',
                  padding: '5px 8px 5px 26px',
                  fontSize: '0.75rem',
                  outline: 'none',
                  width: '160px',
                }}
              />
            </div>

            {/* Action Type Filter */}
            <select
              value={auditActionFilter}
              onChange={(e) => setAuditActionFilter(e.target.value)}
              style={{
                background: '#090e1a',
                border: '1px solid #334155',
                color: '#cbd5e1',
                borderRadius: '6px',
                padding: '5px 8px',
                fontSize: '0.75rem',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="all">All Actions</option>
              <option value="PUBLISH">Publish</option>
              <option value="UNPUBLISH">Unpublish</option>
              <option value="CREATE_PRODUCT">Create SKU</option>
              <option value="UPDATE_PRODUCT">Update SKU</option>
              <option value="BULK_UPDATE">Bulk Action</option>
              <option value="UPLOAD">Media Upload</option>
              <option value="DELETE">Delete</option>
            </select>

            {/* Date Preset for Audit */}
            <select
              value={auditDateFilter}
              onChange={(e) => setAuditDateFilter(e.target.value as DatePreset)}
              style={{
                background: '#090e1a',
                border: '1px solid #334155',
                color: '#cbd5e1',
                borderRadius: '6px',
                padding: '5px 8px',
                fontSize: '0.75rem',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>

            {/* Sort Toggle */}
            <button
              onClick={() => setAuditSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
              title={`Sorting: ${auditSortDir === 'desc' ? 'Newest First' : 'Oldest First'}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '5px 8px',
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '6px',
                color: '#cbd5e1',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Clock size={13} />
              <span>{auditSortDir === 'desc' ? 'Newest' : 'Oldest'}</span>
            </button>

            {/* Refresh */}
            <button
              onClick={loadAuditLogs}
              disabled={auditLoading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 10px',
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '6px',
                color: '#94a3b8',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: auditLoading ? 'not-allowed' : 'pointer',
              }}
            >
              <RefreshCw size={12} className={auditLoading ? 'animate-spin' : ''} />
              <span>{auditLoading ? '...' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {/* Audit Table */}
        <div style={{ overflowX: 'auto' }}>
          {auditLogs.length === 0 ? (
            <div style={{ padding: '36px', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
              No audit records match the current search or date filters.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: '#090e1a', color: '#64748b', textAlign: 'left', borderBottom: '1px solid #1e293b' }}>
                  <th style={{ padding: '10px 18px', width: '170px' }}>Timestamp</th>
                  <th style={{ padding: '10px 18px', width: '180px' }}>Actor</th>
                  <th style={{ padding: '10px 18px', width: '180px' }}>Action</th>
                  <th style={{ padding: '10px 18px', width: '120px' }}>Entity</th>
                  <th style={{ padding: '10px 18px' }}>Mutation Details</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => {
                  let formattedDetails = '';
                  if (typeof log.details === 'object' && log.details !== null) {
                    if (log.details.count) {
                      formattedDetails = `${log.details.count} item(s) modified (${log.details.status || log.details.categoryId || 'Batch Action'})`;
                    } else if (log.details.name) {
                      formattedDetails = `"${log.details.name}" ${log.details.sku ? `[${log.details.sku}]` : ''}`;
                    } else {
                      formattedDetails = JSON.stringify(log.details);
                    }
                  } else if (log.details) {
                    formattedDetails = String(log.details);
                  }

                  const dt = formatDateTime(log.createdAt);

                  return (
                    <tr key={log.id} style={{ borderBottom: '1px solid #1a2335' }}>
                      <td style={{ padding: '12px 18px', color: '#94a3b8', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                        <span style={{ color: '#cbd5e1', fontWeight: 600 }}>{dt.time}</span> ({dt.date})
                      </td>
                      <td style={{ padding: '12px 18px', color: '#e2e8f0', fontFamily: 'monospace', fontSize: '0.78rem' }}>
                        {log.userEmail || 'System / Admin'}
                      </td>
                      <td style={{ padding: '12px 18px' }}>
                        {getAuditActionBadge(log.action)}
                      </td>
                      <td style={{ padding: '12px 18px', color: '#cbd5e1', fontWeight: 600 }}>
                        {log.entity}
                      </td>
                      <td style={{ padding: '12px 18px', color: '#94a3b8', fontSize: '0.8rem' }}>
                        {formattedDetails || 'Standard record update'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Confirmation Dialogs for Quick Dashboard Actions */}
      <ConfirmDialog
        isOpen={Boolean(orderDeleteTarget)}
        onClose={() => setOrderDeleteTarget(null)}
        onConfirm={handleDeleteOrder}
        title="Delete Order Record"
        message={`Are you sure you want to delete order #${orderDeleteTarget?.orderNumber}? All associated line items will be removed.`}
        confirmText="Delete Order"
        isDestructive={true}
        isLoading={isDeleting}
      />

      <ConfirmDialog
        isOpen={Boolean(quoteDeleteTarget)}
        onClose={() => setQuoteDeleteTarget(null)}
        onConfirm={handleDeleteQuote}
        title="Delete Quote Request"
        message={`Are you sure you want to delete the quote proposal request from "${quoteDeleteTarget?.email}"?`}
        confirmText="Delete Quote"
        isDestructive={true}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default DashboardOverviewPage;
