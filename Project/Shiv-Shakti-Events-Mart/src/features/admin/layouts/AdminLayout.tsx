import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  Sliders,
  Award,
  FileText,
  Image,
  ShoppingBag,
  MessageSquareQuote,
  ExternalLink,
  LogOut,
  ChevronRight,
  Shield,
  Menu,
  X,
} from 'lucide-react';
import { authApi } from '../../auth/services/authApi';
import type { User } from '../../../shared/types/models.types';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    authApi.getMe().then((user) => {
      if (user) setCurrentUser(user);
    });
  }, []);

  const handleLogout = async () => {
    await authApi.logout();
    navigate('/login');
  };

  // Close mobile nav on route change
  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  const navItemStyle = ({ isActive }: { isActive: boolean }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '0.86rem',
    fontWeight: 500,
    textDecoration: 'none',
    color: isActive ? '#a5b4fc' : '#94a3b8',
    background: isActive ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(124, 58, 237, 0.15))' : 'transparent',
    border: isActive ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
    transition: 'all 0.15s ease',
    marginBottom: '3px',
  });

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#070c16',
        color: '#e2e8f0',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ── SIDEBAR ── */}
      <aside
        style={{
          width: '260px',
          flexShrink: 0,
          background: 'linear-gradient(180deg, #0d1526 0%, #0a0f1d 100%)',
          borderRight: '1px solid #1e293b',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 40,
        }}
        className={`admin-sidebar ${mobileNavOpen ? 'mobile-open' : ''}`}
      >
        {/* Sidebar Brand Header */}
        <div
          style={{
            padding: '20px 20px',
            borderBottom: '1px solid #1e293b',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1rem',
              color: '#fff',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)',
            }}
          >
            SS
          </div>
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, letterSpacing: '0.04em', color: '#f8fafc' }}>
              SHIV SHAKTI
            </div>
            <div style={{ fontSize: '0.68rem', color: '#818cf8', fontWeight: 600, letterSpacing: '0.06em' }}>
              CMS MANAGEMENT COCKPIT
            </div>
          </div>
        </div>

        {/* Sidebar Navigation Links */}
        <div style={{ padding: '16px 12px', flex: 1, overflowY: 'auto' }}>
          {/* Section: Overview */}
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#475569', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '6px 12px 6px' }}>
            Main
          </div>
          <NavLink to="/admin" end style={navItemStyle}>
            <LayoutDashboard size={17} />
            <span>Dashboard Overview</span>
          </NavLink>

          {/* Section: Catalog */}
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#475569', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '16px 12px 6px' }}>
            Catalog Management
          </div>
          <NavLink to="/admin/products" style={navItemStyle}>
            <Package size={17} />
            <span>Products / SKUs</span>
          </NavLink>
          <NavLink to="/admin/categories" style={navItemStyle}>
            <Layers size={17} />
            <span>Categories (3-Tier)</span>
          </NavLink>
          <NavLink to="/admin/filters" style={navItemStyle}>
            <Sliders size={17} />
            <span>Dynamic Filters</span>
          </NavLink>
          <NavLink to="/admin/badges" style={navItemStyle}>
            <Award size={17} />
            <span>Badges</span>
          </NavLink>

          {/* Section: Content */}
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#475569', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '16px 12px 6px' }}>
            Content & Media
          </div>
          <NavLink to="/admin/pages" style={navItemStyle}>
            <FileText size={17} />
            <span>Website Pages CMS</span>
          </NavLink>
          <NavLink to="/admin/media" style={navItemStyle}>
            <Image size={17} />
            <span>Media Library (CDN)</span>
          </NavLink>

          {/* Section: Business */}
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#475569', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '16px 12px 6px' }}>
            Operations & Inquiries
          </div>
          <NavLink to="/admin/orders" style={navItemStyle}>
            <ShoppingBag size={17} />
            <span>Bookings & Orders</span>
          </NavLink>
          <NavLink to="/admin/quotes" style={navItemStyle}>
            <MessageSquareQuote size={17} />
            <span>Instant Quote Requests</span>
          </NavLink>
        </div>

        {/* Sidebar Footer User Info & Logout */}
        <div
          style={{
            padding: '16px',
            borderTop: '1px solid #1e293b',
            background: '#0a0f1d',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#1e293b',
                border: '1px solid #334155',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8',
                fontWeight: 700,
                fontSize: '0.8rem',
              }}
            >
              <Shield size={16} />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser?.name || 'Administrator'}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                {currentUser?.role || 'ADMIN'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => window.open('/', '_blank')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                padding: '7px 8px',
                borderRadius: '6px',
                background: '#1e293b',
                border: '1px solid #334155',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: '0.74rem',
                fontWeight: 500,
                transition: 'all 0.15s',
              }}
            >
              <ExternalLink size={13} />
              <span>Live Site</span>
            </button>
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '7px 10px',
                borderRadius: '6px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                cursor: 'pointer',
                fontSize: '0.74rem',
                fontWeight: 500,
                transition: 'all 0.15s',
              }}
              title="Sign Out"
            >
              <LogOut size={13} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>
        {/* Top bar */}
        <header
          style={{
            padding: '14px 28px',
            background: '#0d1526',
            borderBottom: '1px solid #1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 30,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="admin-mobile-toggle"
              style={{
                background: '#1e293b',
                border: '1px solid #334155',
                color: '#f8fafc',
                padding: '6px 8px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Toggle Admin Navigation"
            >
              {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Admin Cockpit</span>
            <ChevronRight size={14} color="#475569" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0', textTransform: 'capitalize' }}>
              {location.pathname.split('/')[2] || 'Overview'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 10px', borderRadius: '99px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
              API Connected
            </div>
          </div>
        </header>

        {/* Routed Sub-page Content */}
        <main style={{ padding: '28px', flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
