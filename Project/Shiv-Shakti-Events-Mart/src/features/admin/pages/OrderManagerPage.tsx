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
import { orderApi } from '../../orders/services/orderApi';
import { Modal } from '../../../shared/components/Modal/Modal';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog/ConfirmDialog';
import type { Order } from '../../../shared/types/models.types';

type DatePreset = 'all' | 'today' | '7d' | '30d' | 'month' | 'custom';
type SortField = 'createdAt' | 'grandTotal' | 'orderNumber' | 'customerName';
type SortOrder = 'asc' | 'desc';

export const OrderManagerPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
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

  // Detail Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Handle Preset Changes
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

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await orderApi.getAllOrders({
        page,
        limit: 20,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        search: debouncedSearch.trim() || undefined,
        sortBy,
        sortOrder,
      });
      setOrders(res.orders || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, startDate, endDate, debouncedSearch, sortBy, sortOrder]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await orderApi.updateOrderStatus(orderId, newStatus);
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus as any } : null));
      }
      loadOrders();
    } catch (err: any) {
      alert(err.message || 'Failed to update status.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await orderApi.deleteOrder(deleteTarget.id);
      if (selectedOrder?.id === deleteTarget.id) {
        setSelectedOrder(null);
      }
      setOrders((prev) => prev.filter((o) => o.id !== deleteTarget.id));
      setTotal((prev) => Math.max(0, prev - 1));
      setDeleteTarget(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete order.');
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
      setSortOrder(field === 'createdAt' || field === 'grandTotal' ? 'desc' : 'asc');
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
            Client Orders & Rental Bookings
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '4px 0 0' }}>
            Monitor bookings, filter by date ranges, search client records, and manage delivery statuses.
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
              placeholder="Search by Order #, Client Name, Email..."
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

          {/* Status Filter Dropdown */}
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
            <option value="all">All Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Dispatched / In Transit</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
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
            <option value="grandTotal_desc">Amount: Highest First</option>
            <option value="grandTotal_asc">Amount: Lowest First</option>
            <option value="customerName_asc">Client Name: A to Z</option>
            <option value="orderNumber_desc">Order #: Highest</option>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#818cf8', fontSize: '0.78rem', fontWeight: 700 }}>
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
                    border: active ? '1px solid #6366f1' : '1px solid #1e293b',
                    background: active ? 'rgba(99, 102, 241, 0.2)' : '#080d18',
                    color: active ? '#a5b4fc' : '#94a3b8',
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
            Found <span style={{ color: '#f1f5f9', fontWeight: 700 }}>{total}</span> bookings
          </div>
        </div>
      </div>

      {/* Orders Table */}
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
                  onClick={() => toggleSort('orderNumber')}
                  style={{ padding: '12px 16px', cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span>Order #</span>
                    {getSortIcon('orderNumber')}
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('customerName')}
                  style={{ padding: '12px 16px', cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span>Customer Details</span>
                    {getSortIcon('customerName')}
                  </div>
                </th>
                <th style={{ padding: '12px 16px' }}>Items Count</th>
                <th
                  onClick={() => toggleSort('grandTotal')}
                  style={{ padding: '12px 16px', cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span>Total Amount</span>
                    {getSortIcon('grandTotal')}
                  </div>
                </th>
                <th style={{ padding: '12px 16px' }}>Order Status</th>
                <th
                  onClick={() => toggleSort('createdAt')}
                  style={{ padding: '12px 16px', cursor: 'pointer', userSelect: 'none', width: '150px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span>Date & Time</span>
                    {getSortIcon('createdAt')}
                  </div>
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                    No bookings found matching your search or date filters.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const dt = formatDateTime(order.createdAt);
                  return (
                    <tr key={order.id} style={{ borderBottom: '1px solid #1a2335' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: '#e2e8f0', fontFamily: 'monospace' }}>
                        {order.orderNumber}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 600, color: '#f1f5f9' }}>{order.customerName}</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{order.customerEmail}</div>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#94a3b8' }}>
                        {order.items?.length || 0} Products
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: '#34d399' }}>
                        {formatPrice(order.grandTotal)}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
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
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#94a3b8', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                        <div style={{ color: '#cbd5e1', fontWeight: 600 }}>{dt.date}</div>
                        <div style={{ color: '#64748b', fontSize: '0.72rem' }}>{dt.time}</div>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            style={{
                              padding: '6px 12px',
                              background: '#1e293b',
                              border: '1px solid #334155',
                              borderRadius: '6px',
                              color: '#cbd5e1',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            View Breakdown
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(order)}
                            title="Delete Order Record"
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
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
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
            Page {page} of {totalPages} ({total} Total Bookings)
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

      {/* Order Item Details Modal */}
      {selectedOrder && (
        <Modal
          isOpen={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          title={`Order Breakdown: ${selectedOrder.orderNumber}`}
          maxWidth="640px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                background: '#080d18',
                padding: '14px',
                borderRadius: '8px',
              }}
            >
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>Customer Details</span>
                <div style={{ fontWeight: 600, color: '#f1f5f9' }}>{selectedOrder.customerName}</div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{selectedOrder.customerEmail}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>Order Placed</span>
                <div style={{ fontWeight: 600, color: '#f1f5f9' }}>
                  {formatDateTime(selectedOrder.createdAt).date} at {formatDateTime(selectedOrder.createdAt).time}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#38bdf8' }}>Status: {selectedOrder.status}</div>
              </div>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#94a3b8',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                }}
              >
                Line Items
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedOrder.items?.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: '#080d18',
                      border: '1px solid #1e293b',
                      borderRadius: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 4 }}
                        />
                      )}
                      <div>
                        <div style={{ fontWeight: 600, color: '#f1f5f9', fontSize: '0.86rem' }}>{item.name}</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                          Qty: {item.quantity} × {formatPrice(item.price)}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, color: '#34d399' }}>{formatPrice(item.price * item.quantity)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid #1e293b',
                paddingTop: '16px',
                marginTop: '12px',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <button
                type="button"
                onClick={() => setDeleteTarget(selectedOrder)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '6px',
                  color: '#f87171',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <Trash2 size={14} />
                <span>Delete Order Record</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.05rem', fontWeight: 800 }}>
                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Total Settled:</span>
                <span style={{ color: '#34d399' }}>{formatPrice(selectedOrder.grandTotal)}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Confirmation Dialog for Permanent Order Deletion */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Order Record"
        message={`Are you sure you want to permanently delete order #${deleteTarget?.orderNumber}? All associated line items and financial metrics will be removed permanently. This action cannot be undone.`}
        confirmText="Delete Permanently"
        isDestructive={true}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default OrderManagerPage;
