import { useState, useEffect } from "react";
import { useSearchParams } from "@remix-run/react";
import { useAppBridge } from "@shopify/app-bridge-react";

export default function Customize() {
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("template") || "1";
  
  // Mock current plan from database
  const currentPlan = "Starter"; // Options: "Starter", "Professional", "Premium"

  const [device, setDevice] = useState("Desktop");
  const [productsPerRow, setProductsPerRow] = useState(3);
  const [cardRadius, setCardRadius] = useState(14);
  const [cardShadow, setCardShadow] = useState("Medium");
  const [containerWidth, setContainerWidth] = useState("Standard (1200px)");
  const [hoverAnimation, setHoverAnimation] = useState("None");
  
  const shopify = useAppBridge();
  const mockProducts = [1, 2, 3, 4, 5, 6];

  const getShadowStyle = () => {
    switch (cardShadow) {
      case "Soft": return "0 4px 6px -1px rgba(0, 0, 0, 0.05)";
      case "Medium": return "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
      case "Hard": return "0 20px 25px -5px rgba(0, 0, 0, 0.2)";
      case "None": return "none";
      default: return "none";
    }
  };

  const getGridColumns = () => {
    if (device === "Mobile") return "repeat(1, 1fr)";
    if (device === "Tablet") return "repeat(2, 1fr)";
    return `repeat(${productsPerRow}, 1fr)`;
  };

  // Plan Feature Checks
  const canUseShadows = currentPlan === "Professional" || currentPlan === "Premium";
  const canUseAnimations = currentPlan === "Premium";

  return (
    <div style={{ display: 'flex', gap: '32px', height: 'calc(100vh - 128px)' }}>
      {/* Settings Panel */}
      <div className="premium-card" style={{ width: '350px', padding: '24px', overflowY: 'auto', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Layout Settings</h2>
          <span style={{ fontSize: '12px', padding: '4px 8px', backgroundColor: 'var(--color-primary)', color: 'white', borderRadius: '12px', fontWeight: 600 }}>{currentPlan} Plan</span>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Products Per Row (Desktop)</label>
          <input 
            type="range" min="1" max="5" 
            value={productsPerRow} 
            onChange={(e) => setProductsPerRow(Number(e.target.value))}
            style={{ width: '100%' }} 
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--color-secondary-text)' }}>
            <span>1</span><span>{productsPerRow}</span><span>5</span>
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Container Width</label>
          <select 
            value={containerWidth}
            onChange={(e) => setContainerWidth(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
          >
            <option>Standard (1200px)</option>
            <option>Wide (1440px)</option>
            <option>Full Width</option>
          </select>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Card Radius ({cardRadius}px)</label>
          <input 
            type="range" min="0" max="40" 
            value={cardRadius}
            onChange={(e) => setCardRadius(Number(e.target.value))}
            style={{ width: '100%' }} 
          />
        </div>
        
        <div style={{ marginBottom: '24px', opacity: canUseShadows ? 1 : 0.5 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Card Shadow</label>
            {!canUseShadows && <span style={{ fontSize: '12px', color: 'var(--color-warning)', fontWeight: 600 }}>Pro Plan</span>}
          </div>
          <select 
            value={cardShadow}
            onChange={(e) => setCardShadow(e.target.value)}
            disabled={!canUseShadows}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', cursor: canUseShadows ? 'pointer' : 'not-allowed' }}
          >
            <option>None</option>
            <option>Soft</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

        <div style={{ marginBottom: '24px', opacity: canUseAnimations ? 1 : 0.5 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Hover Animation</label>
            {!canUseAnimations && <span style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: 600 }}>Premium Plan</span>}
          </div>
          <select 
            value={hoverAnimation}
            onChange={(e) => setHoverAnimation(e.target.value)}
            disabled={!canUseAnimations}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', cursor: canUseAnimations ? 'pointer' : 'not-allowed' }}
          >
            <option>None</option>
            <option>Scale Up</option>
            <option>Fade In</option>
            <option>3D Flip</option>
          </select>
        </div>

        <button 
          onClick={() => shopify.toast.show("Layout settings saved successfully!")}
          className="premium-button" 
          style={{ width: '100%' }}
        >
          Save Changes
        </button>
      </div>

      {/* Live Preview Panel */}
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
        <div className="premium-card" style={{ flex: 1, display: 'flex', justifyContent: 'center', backgroundColor: '#e2e8f0', overflowY: 'auto', padding: '24px' }}>
          
          <div style={{ 
            width: device === 'Mobile' ? '375px' : device === 'Tablet' ? '768px' : containerWidth === 'Full Width' ? '100%' : containerWidth === 'Wide (1440px)' ? '1440px' : '1000px',
            backgroundColor: 'white',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            transition: 'width 0.3s ease',
            padding: '32px',
            minHeight: '100%'
          }}>
            <h2 style={{ textAlign: 'center', marginBottom: '32px', fontSize: '24px', fontWeight: 700 }}>Featured Collection Preview</h2>
            
            {/* Conditional Rendering of Designs based on Template ID */}
            
            {/* Design 1: Classic Grid (Default) */}
            {(templateId === "1" || templateId === "2" || templateId === "3" || Number(templateId) > 9) && (
              <div style={{ display: 'grid', gridTemplateColumns: getGridColumns(), gap: '24px', transition: 'all 0.3s ease' }}>
                {mockProducts.map((item) => (
                  <div key={item} style={{ backgroundColor: 'white', borderRadius: `${cardRadius}px`, boxShadow: getShadowStyle(), border: cardShadow === 'None' ? '1px solid var(--color-border)' : 'none', overflow: 'hidden' }}>
                    <div style={{ height: '250px', background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>Product Image</div>
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                      <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 600 }}>Classic Style {item}</h3>
                      <p style={{ margin: '0 0 16px 0', color: 'var(--color-secondary-text)', fontWeight: 500 }}>$59.00</p>
                      <button style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-primary)', backgroundColor: 'transparent', color: 'var(--color-primary)', fontWeight: 600 }}>Quick Add</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Design 2: Split Layout (Template ID 6) */}
            {(templateId === "4" || templateId === "5" || templateId === "6") && (
              <div style={{ display: 'flex', flexDirection: device === 'Mobile' ? 'column' : 'row', gap: '32px' }}>
                <div style={{ flex: 1, borderRadius: `${cardRadius}px`, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', height: device === 'Mobile' ? '300px' : 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '32px', fontWeight: 800 }}>
                  New Arrivals
                </div>
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: device === 'Mobile' ? '1fr' : '1fr 1fr', gap: '16px' }}>
                  {mockProducts.slice(0, 4).map((item) => (
                    <div key={item} style={{ backgroundColor: '#f8f9fa', borderRadius: `${cardRadius}px`, boxShadow: getShadowStyle(), padding: '16px', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ height: '150px', backgroundColor: '#e9ecef', borderRadius: `${cardRadius - 4}px`, marginBottom: '12px' }}></div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600 }}>Split Edition {item}</h4>
                      <p style={{ margin: '0 0 12px 0', color: 'var(--color-secondary-text)', fontSize: '12px' }}>$89.99</p>
                      <button style={{ marginTop: 'auto', width: '100%', padding: '6px', borderRadius: '4px', border: 'none', backgroundColor: 'var(--color-primary)', color: 'white', fontSize: '12px', fontWeight: 600 }}>Buy Now</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Design 3: Lookbook (Template ID 9) */}
            {(templateId === "7" || templateId === "8" || templateId === "9") && (
              <div style={{ display: 'grid', gridTemplateColumns: device === 'Mobile' ? '1fr' : '1fr 1fr 1fr', gap: '16px' }}>
                {mockProducts.map((item, index) => (
                  <div key={item} style={{ 
                    position: 'relative',
                    borderRadius: `${cardRadius}px`, 
                    boxShadow: getShadowStyle(), 
                    overflow: 'hidden',
                    gridRow: index % 3 === 0 ? 'span 2' : 'span 1', // Masonry-like staggering
                    height: index % 3 === 0 ? '500px' : '242px',
                    background: index % 2 === 0 ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                  }}>
                    <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', backgroundColor: 'white', padding: '16px', borderRadius: `${cardRadius - 4}px`, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 700 }}>Lookbook Style {item}</h4>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'var(--color-secondary-text)', fontSize: '13px' }}>$120.00</span>
                        <button style={{ background: 'black', color: 'white', border: 'none', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer' }}>Add</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
