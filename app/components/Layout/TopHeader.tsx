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
          Collection Builder Pro
        </h1>
      </div>


    </header>
  );
}
