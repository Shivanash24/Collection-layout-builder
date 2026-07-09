import { useState } from "react";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import { useAppBridge } from "@shopify/app-bridge-react";
import prisma from "../db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const storeSettings = await prisma.storeSettings.findUnique({
    where: { shop: session.shop }
  });
  
  const activePlan = storeSettings?.activePlan || "Free";
  const activeTemplateId = storeSettings?.templateId || "1";
  
  return json({ storeName: "Collection Builder Pro", activePlan, activeTemplateId });
};

export default function Dashboard() {
  const { storeName, activePlan, activeTemplateId } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const shopify = useAppBridge();
  const [previewCollection, setPreviewCollection] = useState<any>(null);

  const templates = [
    { id: "1", name: "Classic Grid", category: "Free", gradient: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)" },
    { id: "2", name: "Minimal", category: "Free", gradient: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)" },
    { id: "3", name: "Fashion", category: "Free", gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)" },
    { id: "4", name: "Luxury", category: "Starter", gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
    { id: "5", name: "Editorial", category: "Starter", gradient: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)" },
    { id: "6", name: "Split Layout", category: "Starter", gradient: "linear-gradient(135deg, #ff0844 0%, #ffb199 100%)" },
    { id: "7", name: "Modern Cards", category: "Professional", gradient: "linear-gradient(135deg, #93a5cf 0%, #e4efe9 100%)" },
    { id: "8", name: "Premium Showcase", category: "Professional", gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
    { id: "9", name: "Lookbook", category: "Professional", gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" },
    { id: "10", name: "Dark Mode", category: "Professional", gradient: "linear-gradient(135deg, #1e1366 0%, #2a0845 100%)" },
    { id: "11", name: "Pinterest", category: "Professional", gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" },
    { id: "12", name: "Magazine", category: "Premium", gradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)" },
    { id: "13", name: "Boutique", category: "Premium", gradient: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)" },
    { id: "14", name: "Bold Grid", category: "Premium", gradient: "linear-gradient(135deg, #ff4e50 0%, #f9d423 100%)" },
    { id: "15", name: "Minimal Premium", category: "Premium", gradient: "linear-gradient(135deg, #cd9cf2 0%, #f6f3ff 100%)" },
  ];

  const activeTemplate = templates.find(t => t.id === activeTemplateId) || templates[0];

  const collections = [
    { id: 1, name: "Summer Collection", status: "Published", updated: "2 hrs ago" },
    { id: 2, name: "Winter Sale", status: "Draft", updated: "1 day ago" },
    { id: 3, name: "New Arrivals", status: "Published", updated: "3 days ago" },
  ];

  const mockProducts = [1, 2, 3, 4, 5, 6];

  const renderPreviewDesign = (template: any, collectionName: string) => {
    const templateId = template.id;
    const cardRadius = 14;
    const shadowStyle = "0 10px 15px -3px rgba(0, 0, 0, 0.1)";

    return (
      <div style={{ width: '100%', padding: '32px' }}>
        {/* Design 1: Classic Grid */}
        {(templateId === "1" || templateId === "2" || templateId === "3" || Number(templateId) > 9) && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {mockProducts.map((item) => (
              <div key={item} style={{ backgroundColor: 'white', borderRadius: `${cardRadius}px`, boxShadow: shadowStyle, overflow: 'hidden' }}>
                <div style={{ height: '200px', background: template.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>{collectionName} Item</div>
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 600, color: 'black' }}>{collectionName} {item}</h3>
                  <p style={{ margin: '0 0 16px 0', color: 'var(--color-secondary-text)', fontWeight: 500 }}>$59.00</p>
                  <button style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-primary)', backgroundColor: 'transparent', color: 'var(--color-primary)', fontWeight: 600 }}>Quick Add</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Design 2: Split Layout */}
        {(templateId === "4" || templateId === "5" || templateId === "6") && (
          <div style={{ display: 'flex', gap: '32px' }}>
            <div style={{ flex: 1, borderRadius: `${cardRadius}px`, background: template.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '32px', fontWeight: 800, textAlign: 'center', padding: '20px' }}>
              {collectionName}
            </div>
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {mockProducts.slice(0, 4).map((item) => (
                <div key={item} style={{ backgroundColor: 'white', borderRadius: `${cardRadius}px`, boxShadow: shadowStyle, padding: '16px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: '120px', backgroundColor: '#e9ecef', borderRadius: `${cardRadius - 4}px`, marginBottom: '12px' }}></div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600, color: 'black' }}>{collectionName} {item}</h4>
                  <p style={{ margin: '0 0 12px 0', color: 'var(--color-secondary-text)', fontSize: '12px' }}>$89.99</p>
                  <button style={{ marginTop: 'auto', width: '100%', padding: '6px', borderRadius: '4px', border: 'none', backgroundColor: 'var(--color-primary)', color: 'white', fontSize: '12px', fontWeight: 600 }}>Buy Now</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Design 3: Lookbook */}
        {(templateId === "7" || templateId === "8" || templateId === "9") && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            {mockProducts.map((item, index) => (
              <div key={item} style={{ 
                position: 'relative',
                borderRadius: `${cardRadius}px`, 
                boxShadow: shadowStyle, 
                overflow: 'hidden',
                gridRow: index % 3 === 0 ? 'span 2' : 'span 1',
                height: index % 3 === 0 ? '450px' : '217px',
                background: template.gradient
              }}>
                <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', backgroundColor: 'white', padding: '16px', borderRadius: `${cardRadius - 4}px`, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 700, color: 'black' }}>{collectionName} {item}</h4>
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
    );
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Premium Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', backgroundColor: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <img src="/collection%20buildeer%20icon.jpg" alt="App Logo" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }} />
          </div>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 8px 0', color: 'var(--color-text)' }}>Welcome back, {storeName}</h2>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{ padding: '6px 12px', borderRadius: '20px', backgroundColor: 'var(--color-primary)', color: 'white', fontSize: '13px', fontWeight: 600 }}>
                ⭐ {activePlan.replace(" Plan", "")} Plan
              </span>
              <span style={{ padding: '6px 12px', borderRadius: '20px', backgroundColor: '#f1f5f9', color: '#475569', fontSize: '13px', fontWeight: 600, border: '1px solid #cbd5e1' }}>
                🎨 {activeTemplate.name} Layout
              </span>
            </div>
          </div>
        </div>

      </div>

      <h3 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 20px 0' }}>Your Collections</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '48px' }}>
        {collections.map((collection) => (
          <div key={collection.id} className="premium-card" style={{ overflow: 'hidden' }}>
            <div style={{ 
              height: '160px', 
              background: activeTemplate.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
              fontWeight: 800,
              textShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
              {collection.name}
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 600 }}>{collection.name}</h3>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-secondary-text)' }}>Updated {collection.updated}</p>
                </div>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  backgroundColor: collection.status === 'Published' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  color: collection.status === 'Published' ? 'var(--color-success)' : 'var(--color-warning)'
                }}>
                  {collection.status}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => navigate(`/app/customize`)}
                  style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: 500 }}
                >
                  Customize
                </button>
                <button 
                  onClick={() => setPreviewCollection(collection)}
                  style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)', backgroundColor: 'transparent', cursor: 'pointer' }}
                  title="Preview"
                >
                  👁️
                </button>
                <button 
                  onClick={() => shopify.toast.show(`Deleted ${collection.name}`)}
                  style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)', backgroundColor: 'transparent', cursor: 'pointer' }}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
        <div className="premium-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 20px 0' }}>Usage Analytics</h3>
          <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
            <p style={{ color: 'var(--color-secondary-text)', fontWeight: 500 }}>Unlock Analytics on Professional Plan</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="premium-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 16px 0' }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                onClick={() => navigate("/app/customize")}
                style={{ padding: '12px', textAlign: 'left', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                🎨 Edit Layout Settings
              </button>
              <button 
                onClick={() => navigate("/app/billing")}
                style={{ padding: '12px', textAlign: 'left', borderRadius: '8px', border: '1px solid var(--color-primary)', backgroundColor: 'var(--color-primary)', color: 'white', cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                ✨ Upgrade Plan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal for Dashboard */}
      {previewCollection && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="premium-card" style={{ width: '90%', maxWidth: '1100px', height: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', backgroundColor: 'white', borderBottom: '1px solid var(--color-border)' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '20px' }}>Previewing: {previewCollection.name}</h2>
                <p style={{ margin: '4px 0 0 0', color: 'var(--color-secondary-text)', fontSize: '14px' }}>Using <strong>{activeTemplate.name}</strong> Layout</p>
              </div>
              <button onClick={() => setPreviewCollection(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', justifyContent: 'center' }}>
               <div style={{ width: '100%', maxWidth: '1000px' }}>
                 {renderPreviewDesign(activeTemplate, previewCollection.name)}
               </div>
            </div>

            <div style={{ padding: '24px', backgroundColor: 'white', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
              <button onClick={() => setPreviewCollection(null)} style={{ padding: '12px 24px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: 600 }}>Close Preview</button>
              <button 
                onClick={() => {
                  setPreviewCollection(null);
                  navigate('/app/customize');
                }}
                className="premium-button"
                style={{ padding: '12px 24px' }}
              >
                Customize Layout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
