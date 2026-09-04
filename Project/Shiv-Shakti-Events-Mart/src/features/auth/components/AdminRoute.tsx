import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/authApi';

export interface AdminRouteProps {
  children: ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'authorized' | 'unauthorized' | 'not-logged-in'>('loading');

  useEffect(() => {
    authApi.getMe().then((user) => {
      if (!user) {
        setStatus('not-logged-in');
      } else if (user.role === 'ADMIN') {
        setStatus('authorized');
      } else {
        setStatus('unauthorized');
      }
    }).catch(() => {
      setStatus('not-logged-in');
    });
  }, []);

  if (status === 'loading') {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#070c16', color: '#94a3b8', fontFamily: 'Inter, sans-serif', fontSize: '1rem',
        gap: '12px',
      }}>
        <div style={{ width: 24, height: 24, border: '3px solid #334155', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        Verifying administrative authorization...
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (status === 'not-logged-in') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#070c16', color: '#94a3b8', fontFamily: 'Inter, sans-serif', textAlign: 'center', gap: '16px' }}>
        <div style={{ fontSize: '3.5rem' }}>🔐</div>
        <h2 style={{ color: '#f1f5f9', margin: 0, fontWeight: 800 }}>Admin Login Required</h2>
        <p style={{ margin: 0, color: '#64748b' }}>You need an authenticated administrative session to access the CMS management cockpit.</p>
        <button onClick={() => navigate('/login')} style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #6366f1, #7c3aed)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem' }}>
          Go to Sign In
        </button>
      </div>
    );
  }

  if (status === 'unauthorized') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#070c16', color: '#94a3b8', fontFamily: 'Inter, sans-serif', textAlign: 'center', gap: '16px' }}>
        <div style={{ fontSize: '3.5rem' }}>🚫</div>
        <h2 style={{ color: '#f1f5f9', margin: 0, fontWeight: 800 }}>Access Denied</h2>
        <p style={{ margin: 0, color: '#64748b' }}>Your account does not possess administrator privileges for Shiv Shakti Events Mart.</p>
        <button onClick={() => navigate('/')} style={{ padding: '10px 24px', background: '#1e293b', color: '#cbd5e1', border: '1px solid #334155', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem' }}>
          Back to Storefront
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
