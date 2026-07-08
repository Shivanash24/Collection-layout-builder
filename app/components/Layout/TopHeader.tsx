export function TopHeader() {
  return (
    <header style={{
      height: '64px',
      backgroundColor: 'var(--color-card)',
      borderBottom: '1px solid var(--color-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'fixed',
      top: 0,
      right: 0,
      left: '260px',
      zIndex: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h1 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>
          My Awesome Store
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Notification Bell Placeholder */}
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-secondary-text)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </button>

        {/* User Avatar */}
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-primary)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 600,
          fontSize: '14px',
          cursor: 'pointer'
        }}>
          AM
        </div>
      </div>
    </header>
  );
}
