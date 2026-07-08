import { useAppBridge } from "@shopify/app-bridge-react";

export default function ColorsTypography() {
  const shopify = useAppBridge();
  return (
    <div style={{ display: 'flex', gap: '32px', height: 'calc(100vh - 128px)' }}>
      {/* Settings Panel */}
      <div className="premium-card" style={{ width: '350px', padding: '24px', overflowY: 'auto', flexShrink: 0 }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 24px 0' }}>Colors & Typography</h2>

        <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--color-secondary-text)', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>Colors</h3>
        
        {['Primary', 'Secondary', 'Accent', 'Background', 'Cards', 'Border', 'Price', 'Sale Price', 'Buttons', 'Badge'].map(color => (
          <div key={color} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontWeight: 500 }}>{color}</span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-secondary-text)' }}>#000000</span>
              <div style={{ width: '24px', height: '24px', backgroundColor: 'black', borderRadius: '4px', border: '1px solid var(--color-border)', cursor: 'pointer' }}></div>
            </div>
          </div>
        ))}

        <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--color-secondary-text)', margin: '32px 0 16px 0', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>Typography</h3>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontWeight: 500, marginBottom: '8px' }}>Font Family</label>
          <select style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
            <option>Inter (Default)</option>
            <option>Roboto</option>
            <option>Outfit</option>
            <option>Playfair Display</option>
          </select>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontWeight: 500, marginBottom: '8px' }}>Heading Weight</label>
          <select style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
            <option>Normal (400)</option>
            <option>Medium (500)</option>
            <option>Semibold (600)</option>
            <option selected>Bold (700)</option>
          </select>
        </div>

        <button 
          onClick={() => shopify.toast.show("Colors & Typography updated!")}
          className="premium-button" 
          style={{ width: '100%' }}
        >
          Save Colors & Typography
        </button>
      </div>

      {/* Live Preview Panel */}
      <div className="premium-card" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8F9FD' }}>
         <p style={{ color: 'var(--color-secondary-text)' }}>Live Preview updates as you tweak colors.</p>
      </div>
    </div>
  );
}
