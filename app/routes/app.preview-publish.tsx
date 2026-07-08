import { useState } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";

export default function PreviewPublish() {
  const [device, setDevice] = useState("Desktop");
  const shopify = useAppBridge();

  return (
    <div style={{ display: 'flex', gap: '32px', height: 'calc(100vh - 128px)' }}>
      {/* Publishing Panel */}
      <div className="premium-card" style={{ width: '350px', padding: '24px', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 24px 0' }}>Publish Layout</h2>

        <div style={{ padding: '16px', backgroundColor: 'rgba(34,197,94,0.1)', borderRadius: '12px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-success)', fontWeight: 700, marginBottom: '4px' }}>
            <span style={{ width: '10px', height: '10px', backgroundColor: 'var(--color-success)', borderRadius: '50%', display: 'inline-block' }}></span>
            Ready to Publish
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text)' }}>No errors found. Your layout looks great!</p>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Layout Name</label>
          <input type="text" defaultValue="Summer Collection 2026" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
          <button 
            onClick={() => shopify.toast.show("Draft saved to your layouts")}
            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: 600 }}
          >
            Save Draft
          </button>
          <button 
            onClick={() => shopify.toast.show("Layout published live to your store! 🚀")}
            className="premium-button" 
            style={{ flex: 1, padding: '12px' }}
          >
            Publish Now
          </button>
        </div>
      </div>

      {/* Large Preview Panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '16px' }}>
          {["Desktop", "Tablet", "Mobile"].map(d => (
            <button 
              key={d} 
              onClick={() => setDevice(d)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: device === d ? 'var(--color-primary)' : 'var(--color-border)',
                color: device === d ? 'white' : 'var(--color-text)',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              {d}
            </button>
          ))}
        </div>
        <div className="premium-card" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
          <div style={{ 
            width: device === 'Mobile' ? '375px' : device === 'Tablet' ? '768px' : '100%',
            height: '100%',
            backgroundColor: 'white',
            border: '1px solid var(--color-border)',
            transition: 'width 0.3s ease'
          }}>
            <p style={{ textAlign: 'center', marginTop: '40px', color: 'var(--color-secondary-text)' }}>Full Live Preview</p>
          </div>
        </div>
      </div>
    </div>
  );
}
