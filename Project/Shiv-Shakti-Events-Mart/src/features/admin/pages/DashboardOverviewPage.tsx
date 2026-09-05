import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  ShoppingBag,
  MessageSquareQuote,
  IndianRupee,
  Layers,
  FileText,
  Plus,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { adminApi } from '../services/adminApi';
import type { AdminStats, Order, Quote, AuditLog } from '../../../shared/types/models.types';

export const DashboardOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [recentQuotes, setRecentQuotes] = useState<Quote[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [auditLoading, setAuditLoading] = useState(false);

  const loadAuditLogs = async () => {
    setAuditLoading(true);
    try {
      const logs = await adminApi.getAuditLogs({ limit: 8 });
      setAuditLogs(logs || []);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setAuditLoading(false);
    }
  };

  useEffect(() => {
    Promise.all([
      adminApi.getStats()
        .then((data) => {
          setStats(data.stats);
          setRecentOrders(data.recentOrders || []);
          setRecentQuotes(data.recentQuotes || []);
        })
        .catch((err) => console.error('Failed to load admin stats:', err)),
      loadAuditLogs(),
    ]).finally(() => setLoading(false));
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
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

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Top Banner Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
            Executive Operations Cockpit
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0' }}>
            Live platform metrics, catalog state, booking pipeline, and CMS publishing status.
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
            <TrendingUp size={13} /> Direct booking settlements
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

        {/* Categories */}
        <div style={{ background: 'linear-gradient(135deg, #0d1526, #131d35)', border: '1px solid #1e293b', borderRadius: '14px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Taxonomy</span>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(232, 121, 249, 0.15)', color: '#e879f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
            {loading ? '...' : stats?.totalCategories || 38}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '6px' }}>
            3-Tier Hierarchical Verticals
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' }}>
        {/* Recent Orders Card */}
        <div
          style={{
            background: '#0d1526',
            border: '1px solid #1e293b',
            borderRadius: '14px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid #1e293b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#0a1020',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingBag size={17} color="#818cf8" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>Recent Orders</h3>
            </div>
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

          <div style={{ padding: '0' }}>
            {recentOrders.length === 0 ? (
              <div style={{ padding: '36px', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                No recent orders placed yet.
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ background: '#090e1a', color: '#64748b', textAlign: 'left', borderBottom: '1px solid #1e293b' }}>
                    <th style={{ padding: '10px 16px' }}>Order #</th>
                    <th style={{ padding: '10px 16px' }}>Client</th>
                    <th style={{ padding: '10px 16px' }}>Amount</th>
                    <th style={{ padding: '10px 16px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} style={{ borderBottom: '1px solid #1a2335' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: '#e2e8f0' }}>{order.orderNumber}</td>
                      <td style={{ padding: '12px 16px', color: '#94a3b8' }}>{order.customerName}</td>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: '#34d399' }}>{formatCurrency(order.grandTotal)}</td>
                      <td style={{ padding: '12px 16px' }}>{getStatusBadge(order.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent Quotes Card */}
        <div
          style={{
            background: '#0d1526',
            border: '1px solid #1e293b',
            borderRadius: '14px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid #1e293b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#0a1020',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquareQuote size={17} color="#fbbf24" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>Recent Quotes</h3>
            </div>
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

          <div style={{ padding: '0' }}>
            {recentQuotes.length === 0 ? (
              <div style={{ padding: '36px', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                No recent quote requests.
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ background: '#090e1a', color: '#64748b', textAlign: 'left', borderBottom: '1px solid #1e293b' }}>
                    <th style={{ padding: '10px 16px' }}>Email</th>
                    <th style={{ padding: '10px 16px' }}>Venue / Scale</th>
                    <th style={{ padding: '10px 16px' }}>Est. Cost</th>
                    <th style={{ padding: '10px 16px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentQuotes.map((quote) => (
                    <tr key={quote.id} style={{ borderBottom: '1px solid #1a2335' }}>
                      <td style={{ padding: '12px 16px', color: '#e2e8f0' }}>{quote.email}</td>
                      <td style={{ padding: '12px 16px', color: '#94a3b8', textTransform: 'capitalize' }}>{quote.venue} ({quote.scale})</td>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: '#fbbf24' }}>{formatCurrency(quote.estimated)}</td>
                      <td style={{ padding: '12px 16px' }}>{getStatusBadge(quote.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* ── ENTERPRISE AUDIT LOG & MUTATION STREAM CARD ── */}
      <div
        style={{
          marginTop: '24px',
          background: '#0d1526',
          border: '1px solid #1e293b',
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.2)',
        }}
      >
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
                Cryptographic Postgres audit trail tracking administrative catalog mutations, media uploads, and bulk operations.
              </p>
            </div>
          </div>

          <button
            onClick={loadAuditLogs}
            disabled={auditLoading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '6px',
              color: '#94a3b8',
              fontSize: '0.76rem',
              fontWeight: 600,
              cursor: auditLoading ? 'not-allowed' : 'pointer',
            }}
          >
            <RefreshCw size={13} className={auditLoading ? 'animate-spin' : ''} />
            <span>{auditLoading ? 'Refreshing...' : 'Refresh Feed'}</span>
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          {auditLogs.length === 0 ? (
            <div style={{ padding: '36px', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
              No audit records recorded yet. Mutations performed in the CMS will appear here automatically.
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

                  const dateObj = new Date(log.createdAt);
                  const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  const dateStr = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });

                  return (
                    <tr key={log.id} style={{ borderBottom: '1px solid #1a2335' }}>
                      <td style={{ padding: '12px 18px', color: '#94a3b8', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                        <span style={{ color: '#cbd5e1', fontWeight: 600 }}>{timeStr}</span> ({dateStr})
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
    </div>
  );
};

export default DashboardOverviewPage;
