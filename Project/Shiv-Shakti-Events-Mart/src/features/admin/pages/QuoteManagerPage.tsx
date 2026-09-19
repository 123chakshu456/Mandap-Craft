import React, { useEffect, useState, useCallback } from 'react';
import {
  Search,
  Calendar,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import { quoteApi } from '../../quotes/services/quoteApi';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog/ConfirmDialog';
import type { Quote } from '../../../shared/types/models.types';

type DatePreset = 'all' | 'today' | '7d' | '30d' | 'month' | 'custom';
type SortField = 'createdAt' | 'estimated' | 'email' | 'status';
type SortOrder = 'asc' | 'desc';

export const QuoteManagerPage: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [datePreset, setDatePreset] = useState<DatePreset>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Sorting
  const [sortBy, setSortBy] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<Quote | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Handle Preset changes
  const handlePresetChange = (preset: DatePreset) => {
    setDatePreset(preset);
    setPage(1);
    const now = new Date();
    if (preset === 'today') {
      const today = now.toISOString().split('T')[0];
      setStartDate(today);
      setEndDate(today);
    } else if (preset === '7d') {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      setStartDate(d.toISOString().split('T')[0]);
      setEndDate(now.toISOString().split('T')[0]);
    } else if (preset === '30d') {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      setStartDate(d.toISOString().split('T')[0]);
      setEndDate(now.toISOString().split('T')[0]);
    } else if (preset === 'month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      setStartDate(startOfMonth.toISOString().split('T')[0]);
      setEndDate(now.toISOString().split('T')[0]);
    } else if (preset === 'all') {
      setStartDate('');
      setEndDate('');
    }
  };

  const loadQuotes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await quoteApi.getAllQuotes({
        page,
        limit: 20,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        search: debouncedSearch.trim() || undefined,
        sortBy,
        sortOrder,
      });
      setQuotes(res.quotes || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error('Failed to load quotes:', err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, startDate, endDate, debouncedSearch, sortBy, sortOrder]);

  useEffect(() => {
    loadQuotes();
  }, [loadQuotes]);

  const handleUpdateStatus = async (quoteId: string, newStatus: string) => {
    try {
      await quoteApi.updateQuoteStatus(quoteId, newStatus);
      loadQuotes();
    } catch (err: any) {
      alert(err.message || 'Failed to update quote status.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await quoteApi.deleteQuote(deleteTarget.id);
      setQuotes((prev) => prev.filter((q) => q.id !== deleteTarget.id));
      setTotal((prev) => Math.max(0, prev - 1));
      setDeleteTarget(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete quote request.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setDebouncedSearch('');
    setStatusFilter('all');
    setDatePreset('all');
    setStartDate('');
    setEndDate('');
    setSortBy('createdAt');
    setSortOrder('desc');
    setPage(1);
  };

  const hasActiveFilters =
    debouncedSearch !== '' ||
    statusFilter !== 'all' ||
    datePreset !== 'all' ||
    startDate !== '' ||
    endDate !== '' ||
    sortBy !== 'createdAt' ||
    sortOrder !== 'desc';

  const toggleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder(field === 'createdAt' || field === 'estimated' ? 'desc' : 'asc');
    }
    setPage(1);
  };

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const formatDateTime = (isoString: string) => {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return { date: '—', time: '' };
    return {
      date: d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const getSortIcon = (targetField: SortField) => {
    if (sortBy !== targetField) {
      return <ArrowUpDown size={12} style={{ opacity: 0.35 }} />;
    }
    return sortOrder === 'asc' ? <ArrowUp size={12} color="#818cf8" /> : <ArrowDown size={12} color="#818cf8" />;
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Header */}
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
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
            Custom Mandap & Event Proposals (Quotes)
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '4px 0 0' }}>
            Review instant estimates submitted by clients, filter by timeframe, and manage proposal stages.
          </p>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 12px',
              borderRadius: '8px',
              background: '#1e293b',
              border: '1px solid #334155',
              color: '#cbd5e1',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={13} />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>

      {/* ── FILTER & SORT TOOLBAR ── */}
      <div
        style={{
          background: '#0d1526',
          border: '1px solid #1e293b',
          borderRadius: '12px',
          padding: '16px 18px',
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        }}
      >
        {/* Row 1: Search, Status, Sort */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: '1 1 260px' }}>
            <Search
              size={15}
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}
            />
            <input
              type="text"
              placeholder="Search by Email, Venue, Scale..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 34px',
                background: '#080d18',
                border: '1px solid #1e293b',
                borderRadius: '8px',
                color: '#f8fafc',
                fontSize: '0.84rem',
                outline: 'none',
              }}
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            style={{
              padding: '9px 12px',
              background: '#080d18',
              border: '1px solid #1e293b',
              borderRadius: '8px',
              color: '#cbd5e1',
              fontSize: '0.82rem',
              outline: 'none',
              cursor: 'pointer',
              minWidth: '150px',
            }}
          >
            <option value="all">All Inquiries</option>
            <option value="PENDING">Pending Review</option>
            <option value="REVIEWED">Reviewed</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>

          {/* Sort Dropdown */}
          <select
            value={`${sortBy}_${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('_');
              setSortBy(field as SortField);
              setSortOrder(order as SortOrder);
              setPage(1);
            }}
            style={{
              padding: '9px 12px',
              background: '#080d18',
              border: '1px solid #1e293b',
              borderRadius: '8px',
              color: '#cbd5e1',
              fontSize: '0.82rem',
              outline: 'none',
              cursor: 'pointer',
              minWidth: '180px',
            }}
          >
            <option value="createdAt_desc">Date: Newest First</option>
            <option value="createdAt_asc">Date: Oldest First</option>
            <option value="estimated_desc">Budget: Highest First</option>
            <option value="estimated_asc">Budget: Lowest First</option>
            <option value="email_asc">Client Email: A to Z</option>
            <option value="status_asc">Status</option>
          </select>
        </div>

        {/* Row 2: Date Presets & Custom Date Range */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap',
            paddingTop: '10px',
            borderTop: '1px solid #141d2f',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fbbf24', fontSize: '0.78rem', fontWeight: 700 }}>
            <Calendar size={15} />
            <span>Date Filter:</span>
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All Dates' },
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
                  onClick={() => handlePresetChange(p.id as DatePreset)}
                  style={{
                    padding: '5px 11px',
                    borderRadius: '6px',
                    fontSize: '0.76rem',
                    fontWeight: active ? 700 : 500,
                    cursor: 'pointer',
                    border: active ? '1px solid #fbbf24' : '1px solid #1e293b',
                    background: active ? 'rgba(251, 191, 36, 0.15)' : '#080d18',
                    color: active ? '#fcd34d' : '#94a3b8',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Custom Date Range Pickers */}
          {datePreset === 'custom' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPage(1);
                }}
                style={{
                  background: '#080d18',
                  border: '1px solid #334155',
                  color: '#e2e8f0',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '0.76rem',
                  outline: 'none',
                }}
              />
              <span style={{ color: '#64748b', fontSize: '0.76rem' }}>to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPage(1);
                }}
                style={{
                  background: '#080d18',
                  border: '1px solid #334155',
                  color: '#e2e8f0',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '0.76rem',
                  outline: 'none',
                }}
              />
            </div>
          )}

          <div style={{ marginLeft: 'auto', color: '#64748b', fontSize: '0.78rem' }}>
            Found <span style={{ color: '#f1f5f9', fontWeight: 700 }}>{total}</span> quote requests
          </div>
        </div>
      </div>

      {/* Table */}
      <div
        style={{
          background: '#0d1526',
          border: '1px solid #1e293b',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ background: '#080d18', color: '#64748b', textAlign: 'left', borderBottom: '1px solid #1e293b' }}>
                <th
                  onClick={() => toggleSort('email')}
                  style={{ padding: '12px 16px', cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span>Client Email</span>
                    {getSortIcon('email')}
                  </div>
                </th>
                <th style={{ padding: '12px 16px' }}>Event Scale</th>
                <th style={{ padding: '12px 16px' }}>Venue Setting</th>
                <th style={{ padding: '12px 16px' }}>Drapes & Fabric</th>
                <th
                  onClick={() => toggleSort('estimated')}
                  style={{ padding: '12px 16px', cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span>Estimated Budget</span>
                    {getSortIcon('estimated')}
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('status')}
                  style={{ padding: '12px 16px', cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span>Status</span>
                    {getSortIcon('status')}
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('createdAt')}
                  style={{ padding: '12px 16px', cursor: 'pointer', userSelect: 'none', width: '150px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span>Date & Time</span>
                    {getSortIcon('createdAt')}
                  </div>
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'right', width: '80px' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                    Loading quote requests...
                  </td>
                </tr>
              ) : quotes.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                    No quote requests found matching your search or date filters.
                  </td>
                </tr>
              ) : (
                quotes.map((q) => {
                  const dt = formatDateTime(q.createdAt);
                  return (
                    <tr key={q.id} style={{ borderBottom: '1px solid #1a2335' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 600, color: '#f1f5f9' }}>
                        {q.email}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#cbd5e1', textTransform: 'capitalize' }}>
                        {q.scale}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#cbd5e1', textTransform: 'capitalize' }}>
                        {q.venue}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#94a3b8', textTransform: 'capitalize' }}>
                        {q.drapes}
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: '#fbbf24' }}>
                        {formatPrice(q.estimated)}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <select
                          value={q.status}
                          onChange={(e) => handleUpdateStatus(q.id, e.target.value)}
                          style={{
                            padding: '4px 8px',
                            background: '#080d18',
                            border: '1px solid #1e293b',
                            borderRadius: '6px',
                            color: '#cbd5e1',
                            fontSize: '0.76rem',
                            outline: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="REVIEWED">REVIEWED</option>
                          <option value="APPROVED">APPROVED</option>
                          <option value="REJECTED">REJECTED</option>
                        </select>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#94a3b8', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                        <div style={{ color: '#cbd5e1', fontWeight: 600 }}>{dt.date}</div>
                        <div style={{ color: '#64748b', fontSize: '0.72rem' }}>{dt.time}</div>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(q)}
                          title="Delete Quote Request"
                          style={{
                            padding: '6px 8px',
                            background: 'rgba(239, 68, 68, 0.12)',
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
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div
          style={{
            padding: '14px 20px',
            borderTop: '1px solid #1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#0a1020',
            fontSize: '0.82rem',
            color: '#64748b',
          }}
        >
          <div>
            Page {page} of {totalPages} ({total} Total Quotes)
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              style={{
                padding: '6px 12px',
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '6px',
                color: '#cbd5e1',
                cursor: page <= 1 ? 'not-allowed' : 'pointer',
              }}
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              style={{
                padding: '6px 12px',
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '6px',
                color: '#cbd5e1',
                cursor: page >= totalPages ? 'not-allowed' : 'pointer',
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog for Permanent Quote Deletion */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Quote Request"
        message={`Are you sure you want to permanently delete the custom quote proposal request for "${deleteTarget?.email}" (Estimated budget: ${deleteTarget ? formatPrice(deleteTarget.estimated) : ''})? This action cannot be undone.`}
        confirmText="Delete Quote"
        isDestructive={true}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default QuoteManagerPage;
