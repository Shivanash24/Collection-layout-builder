import { NavLink, useNavigate } from "@remix-run/react";

export function Sidebar() {
  const navigate = useNavigate();
  const menuItems = [
    { label: "Dashboard", href: "/app" },
    { label: "Templates", href: "/app/templates" },
    { label: "Customize", href: "/app/customize" },
    { label: "Banner", href: "/app/banner" },
    { label: "Settings", href: "/app/settings" },
    { label: "Preview & Publish", href: "/app/preview-publish" },
    { label: "Billing", href: "/app/billing" },
    { label: "Help Center", href: "/app/help" },
  ];

  return (
    <aside style={{
      width: '260px',
      backgroundColor: 'var(--color-card)',
      borderRight: '1px solid var(--color-border)',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 16px'
    }}>
      <div style={{ marginBottom: '32px', paddingLeft: '12px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--color-text)' }}>
          Layout Builder
        </h2>
      </div>

      <nav style={{ flex: 1 }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {menuItems.map((item) => (
            <li key={item.label}>
              <NavLink 
                to={item.href}
                style={({ isActive }) => ({
                  display: 'block',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  color: isActive ? 'var(--color-primary)' : 'var(--color-secondary-text)',
                  backgroundColor: isActive ? 'rgba(91, 75, 255, 0.08)' : 'transparent',
                  fontWeight: isActive ? 600 : 500,
                  transition: 'all 0.2s ease',
                })}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="premium-card" style={{ padding: '16px', marginTop: 'auto', backgroundColor: '#F8F9FD' }}>
        <h4 style={{ fontSize: '14px', margin: '0 0 4px 0', color: 'var(--color-text)' }}>Starter Plan</h4>
        <p style={{ fontSize: '12px', color: 'var(--color-secondary-text)', margin: '0 0 12px 0' }}>15 Layouts Available</p>
        <button className="premium-button" style={{ width: '100%' }} onClick={() => navigate('/app/billing')}>Upgrade Plan</button>
      </div>
    </aside>
  );
}
