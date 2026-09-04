import React, { useEffect, useState } from 'react';
import { orderApi } from '../../orders/services/orderApi';
import { Modal } from '../../../shared/components/Modal/Modal';
import type { Order } from '../../../shared/types/models.types';

export const OrderManagerPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Detail Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await orderApi.getAllOrders(page, statusFilter);
      setOrders(res.orders);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [page, statusFilter]);

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

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
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
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
            Client Orders & Rental Bookings
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '4px 0 0' }}>
            Monitor bookings, manage fulfillment workflows, and verify customer payments.
          </p>
        </div>

        {/* Filter */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          style={{
            padding: '9px 14px',
            background: '#0d1526',
            border: '1px solid #1e293b',
            borderRadius: '8px',
            color: '#cbd5e1',
            fontSize: '0.84rem',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="all">All Statuses ({total})</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Dispatched / In Transit</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div
        style={{
          background: '#0d1526',
          border: '1px solid #1e293b',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ background: '#080d18', color: '#64748b', textAlign: 'left', borderBottom: '1px solid #1e293b' }}>
                <th style={{ padding: '12px 16px' }}>Order #</th>
                <th style={{ padding: '12px 16px' }}>Customer Details</th>
                <th style={{ padding: '12px 16px' }}>Items Count</th>
                <th style={{ padding: '12px 16px' }}>Total Amount</th>
                <th style={{ padding: '12px 16px' }}>Order Status</th>
                <th style={{ padding: '12px 16px' }}>Date</th>
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
                    No bookings found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
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
                    <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '0.78rem' }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        style={{ padding: '5px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#cbd5e1', fontSize: '0.75rem', cursor: 'pointer' }}
                      >
                        View Items
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0a1020', fontSize: '0.82rem', color: '#64748b' }}>
          <div>Page {page} of {totalPages} ({total} Orders)</div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} style={{ padding: '6px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#cbd5e1', cursor: page <= 1 ? 'not-allowed' : 'pointer' }}>Previous</button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} style={{ padding: '6px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#cbd5e1', cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}>Next</button>
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#080d18', padding: '14px', borderRadius: '8px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>Customer Name</span>
                <div style={{ fontWeight: 600, color: '#f1f5f9' }}>{selectedOrder.customerName}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>Customer Email</span>
                <div style={{ fontWeight: 600, color: '#f1f5f9' }}>{selectedOrder.customerEmail}</div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase' }}>Line Items</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedOrder.items?.map((item) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#080d18', border: '1px solid #1e293b', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {item.image && <img src={item.image} alt={item.name} style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 4 }} />}
                      <div>
                        <div style={{ fontWeight: 600, color: '#f1f5f9', fontSize: '0.86rem' }}>{item.name}</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Qty: {item.quantity} × {formatPrice(item.price)}</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, color: '#34d399' }}>{formatPrice(item.price * item.quantity)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #1e293b', paddingTop: '12px', fontSize: '1rem', fontWeight: 800 }}>
              <span style={{ color: '#f1f5f9' }}>Total Settled:</span>
              <span style={{ color: '#34d399' }}>{formatPrice(selectedOrder.grandTotal)}</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default OrderManagerPage;
