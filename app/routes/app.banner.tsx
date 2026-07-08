import { useAppBridge } from "@shopify/app-bridge-react";

export default function Banner() {
  const shopify = useAppBridge();
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 8px 0' }}>Banner Settings</h2>
      <p style={{ color: 'var(--color-secondary-text)', margin: '0 0 32px 0' }}>Customize the hero banner for your collections.</p>

      <div className="premium-card" style={{ padding: '32px' }}>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Banner Image (Desktop)</label>
          <div style={{ border: '2px dashed var(--color-border)', borderRadius: '12px', padding: '40px', textAlign: 'center', backgroundColor: '#f8fafc', cursor: 'pointer' }}>
            <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Click to upload</span> or drag and drop
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Heading Text</label>
            <input type="text" placeholder="Summer Collection" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Sub Heading Text</label>
            <input type="text" placeholder="Discover the latest trends" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Button Text</label>
            <input type="text" placeholder="Shop Now" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Banner Height</label>
            <select style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
              <option>Small (300px)</option>
              <option>Medium (450px)</option>
              <option>Large (600px)</option>
              <option>Full Screen</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Overlay Opacity</label>
          <input type="range" min="0" max="100" defaultValue="40" style={{ width: '100%' }} />
        </div>

        <button 
          onClick={() => shopify.toast.show("Banner settings updated!")}
          className="premium-button" 
          style={{ width: '100%' }}
        >
          Save Banner Settings
        </button>
      </div>
    </div>
  );
}
