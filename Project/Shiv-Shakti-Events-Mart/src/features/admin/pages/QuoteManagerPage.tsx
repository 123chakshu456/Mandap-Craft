import React, { useEffect, useState } from 'react';
import { quoteApi } from '../../quotes/services/quoteApi';
import type { Quote } from '../../../shared/types/models.types';

export const QuoteManagerPage: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const loadQuotes = async () => {
    setLoading(true);
    try {
      const res = await quoteApi.getAllQuotes(page, statusFilter);
      setQuotes(res.quotes);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Failed to load quotes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuotes();
  }, [page, statusFilter]);

  const handleUpdateStatus = async (quoteId: string, newStatus: string) => {
    try {
      await quoteApi.updateQuoteStatus(quoteId, newStatus);
      loadQuotes();
    } catch (err: any) {
      alert(err.message || 'Failed to update quote status.');
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
            Custom Mandap & Event Proposals (Quotes)
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '4px 0 0' }}>
            Review instant estimates submitted by prospective clients and manage proposal stages.
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
          <option value="all">All Inquiries ({total})</option>
          <option value="PENDING">Pending Review</option>
          <option value="REVIEWED">Reviewed</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Table */}
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
                <th style={{ padding: '12px 16px' }}>Client Email</th>
                <th style={{ padding: '12px 16px' }}>Event Scale</th>
                <th style={{ padding: '12px 16px' }}>Venue Setting</th>
                <th style={{ padding: '12px 16px' }}>Drapes & Fabric</th>
                <th style={{ padding: '12px 16px' }}>Estimated Budget</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                    Loading quote requests...
                  </td>
                </tr>
              ) : quotes.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                    No quote requests submitted yet.
                  </td>
                </tr>
              ) : (
                quotes.map((q) => (
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
                    <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '0.78rem' }}>
                      {new Date(q.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0a1020', fontSize: '0.82rem', color: '#64748b' }}>
          <div>Page {page} of {totalPages} ({total} Quotes)</div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} style={{ padding: '6px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#cbd5e1', cursor: page <= 1 ? 'not-allowed' : 'pointer' }}>Previous</button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} style={{ padding: '6px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#cbd5e1', cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteManagerPage;
