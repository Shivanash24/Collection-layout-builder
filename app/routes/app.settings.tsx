import { useAppBridge } from "@shopify/app-bridge-react";

export default function Settings() {
  const shopify = useAppBridge();
  const toggles = [
    { label: "Enable Add To Cart", default: true },
    { label: "Enable Wishlist", default: true },
    { label: "Enable Quick View", default: true },
    { label: "Enable Hover Effects", default: true },
    { label: "Enable Product Vendor", default: false },
    { label: "Enable Sale Badge", default: true },
    { label: "Enable Product Count", default: true },
    { label: "Enable Collection Description", default: true },
    { label: "Enable Infinite Scroll", default: false },
    { label: "Enable Filters", default: true },
    { label: "Sticky Filters", default: false },
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 8px 0' }}>Collection Settings</h2>
      <p style={{ color: 'var(--color-secondary-text)', margin: '0 0 32px 0' }}>Configure how your collections behave on the storefront.</p>

      <div className="premium-card" style={{ padding: '32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {toggles.map(toggle => (
            <div key={toggle.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontWeight: 500 }}>{toggle.label}</span>
              {/* Fake Toggle Switch for UI purposes */}
              <div style={{
                width: '44px',
                height: '24px',
                backgroundColor: toggle.default ? 'var(--color-success)' : '#d1d5db',
                borderRadius: '12px',
                position: 'relative',
                cursor: 'pointer'
              }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '2px',
                  left: toggle.default ? '22px' : '2px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  transition: 'left 0.2s'
                }}></div>
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ marginTop: '32px' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Products Per Page (Pagination)</label>
          <input type="number" defaultValue="24" style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', width: '200px' }} />
        </div>

        <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            onClick={() => shopify.toast.show("Collection settings saved successfully")}
            className="premium-button"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
