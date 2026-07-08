import { useState } from "react";
import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate, Form, useSubmit } from "@remix-run/react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const storeSettings = await prisma.storeSettings.findUnique({
    where: { shop: session.shop }
  });
  return json({ 
    activeTemplateId: storeSettings?.templateId || "1",
    activePlan: storeSettings?.activePlan || "Free"
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const templateId = formData.get("templateId") as string;
  
  if (templateId) {
    await prisma.storeSettings.upsert({
      where: { shop: session.shop },
      create: { shop: session.shop, templateId },
      update: { templateId }
    });
  }
  return json({ success: true });
};

export default function Templates() {
  const { activeTemplateId, activePlan } = useLoaderData<typeof loader>();
  const [activeCategory, setActiveCategory] = useState("All");
  const [previewTemplate, setPreviewTemplate] = useState<any>(null);
  const navigate = useNavigate();
  const shopify = useAppBridge();
  const submit = useSubmit();

  const categories = ["All", "Free", "Starter", "Professional", "Premium"];

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

  const filteredTemplates = activeCategory === "All" 
    ? templates 
    : templates.filter(t => t.category === activeCategory);

  const handleUseTemplate = (template: any) => {
    submit({ templateId: template.id }, { method: "post" });
    shopify.toast.show(`Applied ${template.name} template!`);
    navigate(`/app/customize?template=${template.id}`);
  };

  const isTemplateLocked = (category: string) => {
    if (activePlan === "Premium") return false;
    if (activePlan === "Professional" && category !== "Premium") return false;
    if (activePlan === "Starter" && (category === "Free" || category === "Starter")) return false;
    if (activePlan === "Free" && category === "Free") return false;
    return true;
  };

  const mockProducts = [1, 2, 3, 4, 5, 6];

  const renderPreviewDesign = (template: any) => {
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
                <div style={{ height: '200px', background: template.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>Image</div>
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 600, color: 'black' }}>{template.name} Style {item}</h3>
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
            <div style={{ flex: 1, borderRadius: `${cardRadius}px`, background: template.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '32px', fontWeight: 800 }}>
              New Arrivals
            </div>
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {mockProducts.slice(0, 4).map((item) => (
                <div key={item} style={{ backgroundColor: 'white', borderRadius: `${cardRadius}px`, boxShadow: shadowStyle, padding: '16px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: '120px', backgroundColor: '#e9ecef', borderRadius: `${cardRadius - 4}px`, marginBottom: '12px' }}></div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600, color: 'black' }}>Split Edition {item}</h4>
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
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 700, color: 'black' }}>Lookbook {item}</h4>
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 8px 0' }}>Collection Templates</h2>
          <p style={{ color: 'var(--color-secondary-text)', margin: 0 }}>Choose from 15 premium layouts. You are on the <strong>{activePlan}</strong> plan.</p>
        </div>
        <div style={{ position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Search templates..." 
            style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', width: '250px' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '32px' }}>
        {/* Sidebar Categories */}
        <div style={{ width: '200px', flexShrink: 0 }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-secondary-text)', marginBottom: '16px' }}>Categories</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {categories.map(category => (
              <li key={category}>
                <button
                  onClick={() => setActiveCategory(category)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: activeCategory === category ? 'rgba(91, 75, 255, 0.08)' : 'transparent',
                    color: activeCategory === category ? 'var(--color-primary)' : 'var(--color-text)',
                    fontWeight: activeCategory === category ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Templates Grid */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {filteredTemplates.map((template) => {
            const isLocked = isTemplateLocked(template.category);
            return (
              <div key={template.id} className="premium-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', border: activeTemplateId === template.id ? '2px solid var(--color-primary)' : 'none', opacity: isLocked ? 0.75 : 1 }}>
                <div style={{ 
                  height: '180px', 
                  background: template.gradient,
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: 800,
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  filter: isLocked ? 'grayscale(80%)' : 'none'
                }}>
                  {template.name.charAt(0)}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: isLocked ? '#f1f5f9' : 'white',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 600,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    color: isLocked ? '#64748b' : 'black',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {isLocked && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    )}
                    {template.category}
                  </div>
                </div>
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600 }}>{template.name}</h3>
                  <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                    {isLocked ? (
                      <button 
                        onClick={() => navigate("/app/billing")}
                        className="premium-button" 
                        style={{ flex: 1, backgroundColor: '#f1f5f9', color: '#64748b', border: '1px solid #cbd5e1' }}
                      >
                        Upgrade to Unlock
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleUseTemplate(template)}
                        className="premium-button" 
                        style={{ flex: 1, backgroundColor: activeTemplateId === template.id ? 'transparent' : 'var(--color-primary)', color: activeTemplateId === template.id ? 'var(--color-primary)' : 'white', border: activeTemplateId === template.id ? '1px solid var(--color-primary)' : 'none' }}
                      >
                        {activeTemplateId === template.id ? 'Current' : 'Use Template'}
                      </button>
                    )}
                    
                    <button 
                      onClick={() => setPreviewTemplate(template)}
                      style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'transparent', cursor: 'pointer' }}
                    >
                      Preview
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="premium-card" style={{ width: '90%', maxWidth: '1100px', height: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', backgroundColor: 'white', borderBottom: '1px solid var(--color-border)' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '20px' }}>Previewing: {previewTemplate.name}</h2>
                <p style={{ margin: '4px 0 0 0', color: 'var(--color-secondary-text)', fontSize: '14px' }}>{previewTemplate.category} Plan Template</p>
              </div>
              <button onClick={() => setPreviewTemplate(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
            </div>
            
            {/* The actual design rendering area */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', justifyContent: 'center' }}>
               <div style={{ width: '100%', maxWidth: '1000px' }}>
                 {renderPreviewDesign(previewTemplate)}
               </div>
            </div>

            <div style={{ padding: '24px', backgroundColor: 'white', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
              <button onClick={() => setPreviewTemplate(null)} style={{ padding: '12px 24px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: 600 }}>Close Preview</button>
              
              {isTemplateLocked(previewTemplate.category) ? (
                <button 
                  onClick={() => navigate("/app/billing")}
                  className="premium-button"
                  style={{ padding: '12px 24px', backgroundColor: '#475569' }}
                >
                  Upgrade to Unlock This Template
                </button>
              ) : (
                <button 
                  onClick={() => {
                    handleUseTemplate(previewTemplate);
                    setPreviewTemplate(null);
                  }}
                  className="premium-button"
                  style={{ padding: '12px 24px' }}
                >
                  Use This Template
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
