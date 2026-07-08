import React from "react";

export function TemplateRenderer({ 
  template, 
  mockProducts, 
  cardRadius, 
  cardShadow, 
  getGridColumns, 
  device = "Desktop" 
}: { 
  template: any, 
  mockProducts: number[], 
  cardRadius: number, 
  cardShadow: string, 
  getGridColumns?: string, 
  device?: string 
}) {
  const templateId = template.id;
  
  // Default grid columns if not passed
  const gridColumns = getGridColumns || 'repeat(3, 1fr)';
  const shadowStyle = cardShadow === 'None' ? 'none' : cardShadow === 'Soft' ? '0 4px 6px -1px rgba(0, 0, 0, 0.05)' : cardShadow === 'Medium' ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : cardShadow === 'Hard' ? '0 20px 25px -5px rgba(0, 0, 0, 0.2)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
  const borderStyle = cardShadow === 'None' ? '1px solid var(--color-border)' : 'none';

  return (
    <div style={{ width: '100%', transition: 'all 0.3s ease' }}>
      
      {/* 1. Classic Grid (Free) */}
      {templateId === "1" && (
        <div style={{ display: 'grid', gridTemplateColumns: gridColumns, gap: '24px' }}>
          {mockProducts.map((item) => (
            <div key={item} style={{ backgroundColor: 'white', borderRadius: `${cardRadius}px`, boxShadow: shadowStyle, border: borderStyle, overflow: 'hidden' }}>
              <div style={{ height: '250px', background: template.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>Image</div>
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 600 }}>{template.name} {item}</h3>
                <p style={{ margin: '0 0 16px 0', color: 'var(--color-secondary-text)', fontWeight: 500 }}>$59.00</p>
                <button style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-primary)', backgroundColor: 'transparent', color: 'var(--color-primary)', fontWeight: 600 }}>Quick Add</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. Minimal (Free) - No borders, large image */}
      {templateId === "2" && (
        <div style={{ display: 'grid', gridTemplateColumns: gridColumns, gap: '32px' }}>
          {mockProducts.map((item) => (
            <div key={item} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ height: '320px', background: template.gradient, borderRadius: `${cardRadius}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600, fontSize: '20px' }}></div>
              <div style={{ padding: '0 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 500 }}>Minimal {item}</h3>
                  <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>$49.99</p>
                </div>
                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'black' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. Fashion (Free) - Edge to Edge Image with Overlay */}
      {templateId === "3" && (
        <div style={{ display: 'grid', gridTemplateColumns: gridColumns, gap: '16px' }}>
          {mockProducts.map((item) => (
            <div key={item} style={{ position: 'relative', height: '380px', borderRadius: `${cardRadius}px`, overflow: 'hidden', boxShadow: shadowStyle }}>
              <div style={{ position: 'absolute', inset: 0, background: template.gradient }}></div>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }}></div>
              <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px', color: 'white' }}>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 600 }}>{template.name} Collection</h3>
                <p style={{ margin: '0 0 16px 0', opacity: 0.9 }}>$129.00</p>
                <button style={{ background: 'white', color: 'black', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: 600, width: '100%', cursor: 'pointer' }}>Shop Now</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Luxury (Starter) - Hero left, Grid right */}
      {templateId === "4" && (
        <div style={{ display: 'flex', flexDirection: device === 'Mobile' ? 'column' : 'row', gap: '24px' }}>
          <div style={{ flex: 1.2, height: device === 'Mobile' ? '300px' : '524px', borderRadius: `${cardRadius}px`, background: template.gradient, position: 'relative', overflow: 'hidden', boxShadow: shadowStyle }}>
            <div style={{ position: 'absolute', bottom: '40px', left: '40px', color: 'white' }}>
              <h2 style={{ margin: '0 0 16px 0', fontSize: '36px', fontWeight: 300, letterSpacing: '2px' }}>LUXURY<br/>EDITION</h2>
              <button style={{ background: 'transparent', color: 'white', border: '1px solid white', padding: '12px 32px', letterSpacing: '1px' }}>EXPLORE</button>
            </div>
          </div>
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {mockProducts.slice(0, 4).map((item) => (
              <div key={item} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '200px', background: '#f3f4f6', borderRadius: `${cardRadius}px`, marginBottom: '16px' }}></div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 400, letterSpacing: '1px' }}>Signature Item {item}</h4>
                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>$350.00</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Editorial (Starter) - Staggered layout */}
      {templateId === "5" && (
        <div style={{ display: 'grid', gridTemplateColumns: gridColumns, gap: '24px', alignItems: 'start' }}>
          {mockProducts.map((item, index) => (
            <div key={item} style={{ marginTop: index % 2 !== 0 && device !== 'Mobile' ? '40px' : '0' }}>
              <div style={{ height: index % 2 === 0 ? '400px' : '320px', background: template.gradient, borderRadius: `${cardRadius}px`, marginBottom: '20px', boxShadow: shadowStyle }}></div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 700, fontFamily: 'serif' }}>The Editorial #{item}</h3>
              <p style={{ margin: '0 0 16px 0', color: '#666', lineHeight: '1.5' }}>A fresh perspective on modern aesthetics.</p>
              <span style={{ fontSize: '14px', fontWeight: 600, borderBottom: '1px solid black', paddingBottom: '2px', cursor: 'pointer' }}>DISCOVER</span>
            </div>
          ))}
        </div>
      )}

      {/* 6. Split Layout (Starter) - Current banner style */}
      {templateId === "6" && (
        <div style={{ display: 'flex', flexDirection: device === 'Mobile' ? 'column' : 'row', gap: '32px' }}>
          <div style={{ flex: 1, borderRadius: `${cardRadius}px`, background: template.gradient, height: device === 'Mobile' ? '300px' : 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '32px', fontWeight: 800 }}>
            {template.name}
          </div>
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: device === 'Mobile' ? '1fr' : '1fr 1fr', gap: '16px' }}>
            {mockProducts.slice(0, 4).map((item) => (
              <div key={item} style={{ backgroundColor: '#f8f9fa', borderRadius: `${cardRadius}px`, boxShadow: shadowStyle, padding: '16px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '150px', backgroundColor: '#e9ecef', borderRadius: `${cardRadius - 4}px`, marginBottom: '12px' }}></div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600 }}>Split Edition {item}</h4>
                <p style={{ margin: '0 0 12px 0', color: '#666', fontSize: '12px' }}>$89.99</p>
                <button style={{ marginTop: 'auto', width: '100%', padding: '6px', borderRadius: '4px', border: 'none', backgroundColor: 'black', color: 'white', fontSize: '12px', fontWeight: 600 }}>Buy Now</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Modern Cards (Professional) - Floating neumorphic */}
      {templateId === "7" && (
        <div style={{ display: 'grid', gridTemplateColumns: gridColumns, gap: '32px', padding: '16px' }}>
          {mockProducts.map((item) => (
            <div key={item} style={{ 
              backgroundColor: 'white', 
              borderRadius: `${cardRadius}px`, 
              padding: '20px',
              boxShadow: '20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff',
              display: 'flex', flexDirection: 'column', alignItems: 'center'
            }}>
              <div style={{ height: '220px', width: '100%', borderRadius: `${Math.max(0, cardRadius - 8)}px`, background: template.gradient, marginBottom: '24px' }}></div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 700, color: '#333' }}>Modern Card {item}</h3>
              <p style={{ margin: '0 0 20px 0', color: 'var(--color-primary)', fontWeight: 800, fontSize: '18px' }}>$149.00</p>
              <button style={{ width: '80%', padding: '12px', borderRadius: '30px', border: 'none', backgroundColor: '#f1f5f9', color: '#333', fontWeight: 600, boxShadow: 'inset 2px 2px 5px #d1d5db, inset -3px -3px 7px #ffffff' }}>Add to Cart</button>
            </div>
          ))}
        </div>
      )}

      {/* 8. Premium Showcase (Professional) - Horizontal scrolling cards visually */}
      {templateId === "8" && (
        <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '20px' }}>
          {mockProducts.map((item) => (
            <div key={item} style={{ flexShrink: 0, width: device === 'Mobile' ? '280px' : '350px', backgroundColor: 'white', borderRadius: `${cardRadius}px`, boxShadow: shadowStyle, border: borderStyle }}>
              <div style={{ height: '400px', background: template.gradient, borderRadius: `${cardRadius}px ${cardRadius}px 0 0` }}></div>
              <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: 700 }}>Showcase {item}</h3>
                  <span style={{ backgroundColor: '#f1f5f9', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, color: '#475569' }}>New Season</span>
                </div>
                <div style={{ height: '48px', width: '48px', borderRadius: '50%', backgroundColor: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 9. Lookbook (Professional) - Masonry */}
      {templateId === "9" && (
        <div style={{ display: 'grid', gridTemplateColumns: device === 'Mobile' ? '1fr' : '1fr 1fr 1fr', gap: '16px' }}>
          {mockProducts.map((item, index) => (
            <div key={item} style={{ 
              position: 'relative',
              borderRadius: `${cardRadius}px`, 
              boxShadow: shadowStyle, 
              overflow: 'hidden',
              gridRow: index % 3 === 0 ? 'span 2' : 'span 1',
              height: index % 3 === 0 ? '500px' : '242px',
              background: template.gradient
            }}>
              <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', backgroundColor: 'white', padding: '16px', borderRadius: `${cardRadius - 4}px`, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 700 }}>Lookbook Style {item}</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#666', fontSize: '13px' }}>$120.00</span>
                  <button style={{ background: 'black', color: 'white', border: 'none', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer' }}>Add</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 10. Dark Mode (Professional) */}
      {templateId === "10" && (
        <div style={{ backgroundColor: '#0f172a', padding: '40px 24px', borderRadius: '24px', display: 'grid', gridTemplateColumns: gridColumns, gap: '24px' }}>
          {mockProducts.map((item) => (
            <div key={item} style={{ backgroundColor: '#1e293b', borderRadius: `${cardRadius}px`, border: '1px solid #334155', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
              <div style={{ height: '260px', background: template.gradient, opacity: 0.85 }}></div>
              <div style={{ padding: '24px' }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: 600, color: 'white' }}>Night Collection {item}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '16px' }}>$75.00</p>
                  <button style={{ background: 'transparent', border: '1px solid #38bdf8', color: '#38bdf8', padding: '8px 16px', borderRadius: '4px', fontWeight: 600 }}>ADD</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 11. Pinterest (Professional) - Real Pinterest-like Masonry Columns */}
      {templateId === "11" && (
        <div style={{ columnCount: device === 'Mobile' ? 1 : device === 'Tablet' ? 2 : 3, columnGap: '20px' }}>
          {mockProducts.map((item, index) => (
            <div key={item} style={{ 
              breakInside: 'avoid', 
              marginBottom: '20px', 
              backgroundColor: 'white', 
              borderRadius: `${cardRadius}px`, 
              boxShadow: shadowStyle, 
              border: borderStyle,
              overflow: 'hidden'
            }}>
              <div style={{ height: `${200 + (index % 3) * 100}px`, background: template.gradient }}></div>
              <div style={{ padding: '16px' }}>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 700 }}>Pin Style {item}</h3>
                <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Perfect for your everyday look.</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 12. Magazine (Premium) - 1 Large, 2 Small Stacked, 1 Wide */}
      {templateId === "12" && (
        <div style={{ display: 'grid', gridTemplateColumns: device === 'Mobile' ? '1fr' : '2fr 1fr', gap: '20px' }}>
          <div style={{ gridRow: device === 'Mobile' ? 'auto' : 'span 2', height: '100%', minHeight: '520px', borderRadius: `${cardRadius}px`, background: template.gradient, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '40px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
              <span style={{ color: 'white', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '2px', fontWeight: 700 }}>Editor's Pick</span>
              <h2 style={{ color: 'white', fontSize: '32px', margin: '8px 0 16px 0', fontFamily: 'serif' }}>The Headline Piece</h2>
              <button style={{ background: 'white', border: 'none', padding: '12px 24px', fontWeight: 600 }}>Shop Collection</button>
            </div>
          </div>
          <div style={{ height: '250px', borderRadius: `${cardRadius}px`, background: '#f8f9fa', display: 'flex', alignItems: 'center', padding: '24px' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontFamily: 'serif' }}>Trend {mockProducts[1]}</h3>
              <p style={{ margin: '0 0 16px 0', color: '#666' }}>$140.00</p>
              <u style={{ cursor: 'pointer' }}>View Details</u>
            </div>
            <div style={{ width: '120px', height: '100%', background: template.gradient, borderRadius: `${Math.max(0, cardRadius - 8)}px` }}></div>
          </div>
          <div style={{ height: '250px', borderRadius: `${cardRadius}px`, background: '#f8f9fa', display: 'flex', alignItems: 'center', padding: '24px' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontFamily: 'serif' }}>Trend {mockProducts[2]}</h3>
              <p style={{ margin: '0 0 16px 0', color: '#666' }}>$195.00</p>
              <u style={{ cursor: 'pointer' }}>View Details</u>
            </div>
            <div style={{ width: '120px', height: '100%', background: template.gradient, borderRadius: `${Math.max(0, cardRadius - 8)}px` }}></div>
          </div>
        </div>
      )}

      {/* 13. Boutique (Premium) - Serif, thin borders, elegant */}
      {templateId === "13" && (
        <div style={{ display: 'grid', gridTemplateColumns: gridColumns, gap: '40px' }}>
          {mockProducts.map((item) => (
            <div key={item} style={{ textAlign: 'center', padding: '16px', border: '1px solid #e5e5e5' }}>
              <div style={{ height: '350px', background: template.gradient, marginBottom: '24px' }}></div>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '22px', fontWeight: 400, fontFamily: 'serif', letterSpacing: '1px', color: '#111' }}>Boutique Item {item}</h3>
              <p style={{ margin: '0 0 20px 0', color: '#555', fontSize: '14px', letterSpacing: '2px' }}>$250.00</p>
              <button style={{ background: 'transparent', border: '1px solid #111', color: '#111', padding: '12px 40px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px' }}>Add To Bag</button>
            </div>
          ))}
        </div>
      )}

      {/* 14. Bold Grid (Premium) - Brutalist, thick borders */}
      {templateId === "14" && (
        <div style={{ display: 'grid', gridTemplateColumns: gridColumns, gap: '24px', backgroundColor: '#fffbe8', padding: '24px', border: '4px solid black' }}>
          {mockProducts.map((item) => (
            <div key={item} style={{ backgroundColor: 'white', border: '3px solid black', boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)' }}>
              <div style={{ height: '240px', background: template.gradient, borderBottom: '3px solid black' }}></div>
              <div style={{ padding: '20px' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 900, textTransform: 'uppercase' }}>BOLD {item}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                  <span style={{ fontSize: '20px', fontWeight: 800 }}>$99</span>
                  <button style={{ background: 'black', color: 'white', border: 'none', padding: '8px 16px', fontWeight: 700, textTransform: 'uppercase' }}>BUY</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 15. Minimal Premium (Premium) - Ultra clean overlay */}
      {templateId === "15" && (
        <div style={{ display: 'grid', gridTemplateColumns: gridColumns, gap: '2px', backgroundColor: '#f1f1f1', padding: '2px' }}>
          {mockProducts.map((item) => (
            <div key={item} style={{ position: 'relative', height: '450px', backgroundColor: 'white', overflow: 'hidden', group: 'hover' }}>
              <div style={{ position: 'absolute', inset: 0, background: template.gradient, opacity: 0.9 }}></div>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', opacity: 0, transition: 'opacity 0.3s ease', backgroundColor: 'rgba(255,255,255,0.95)', padding: '32px', textAlign: 'center' }} 
                   onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                   onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
              >
                <h3 style={{ margin: '0 0 12px 0', fontSize: '20px', fontWeight: 400, letterSpacing: '1px' }}>Minimal Premium {item}</h3>
                <p style={{ margin: '0 0 24px 0', color: '#666' }}>$400.00</p>
                <button style={{ background: 'black', color: 'white', border: 'none', padding: '14px 40px', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>Add to Bag</button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
