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
  return json({ activeTemplateId: storeSettings?.templateId || "1" });
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
  const { activeTemplateId } = useLoaderData<typeof loader>();
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

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 8px 0' }}>Collection Templates</h2>
          <p style={{ color: 'var(--color-secondary-text)', margin: 0 }}>Choose from 15 premium layouts to get started quickly.</p>
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
          {filteredTemplates.map((template) => (
            <div key={template.id} className="premium-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', border: activeTemplateId === template.id ? '2px solid var(--color-primary)' : 'none' }}>
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
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                {template.name.charAt(0)}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: 'white',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 600,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  color: 'black'
                }}>
                  {template.category}
                </div>
              </div>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600 }}>{template.name}</h3>
                <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => handleUseTemplate(template)}
                    className="premium-button" 
                    style={{ flex: 1, backgroundColor: activeTemplateId === template.id ? 'transparent' : 'var(--color-primary)', color: activeTemplateId === template.id ? 'var(--color-primary)' : 'white', border: activeTemplateId === template.id ? '1px solid var(--color-primary)' : 'none' }}
                  >
                    {activeTemplateId === template.id ? 'Current' : 'Use Template'}
                  </button>
                  <button 
                    onClick={() => setPreviewTemplate(template)}
                    style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'transparent', cursor: 'pointer' }}
                  >
                    Preview
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="premium-card" style={{ width: '80%', maxWidth: '900px', height: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: '1px solid var(--color-border)' }}>
              <h2 style={{ margin: 0, fontSize: '20px' }}>Previewing: {previewTemplate.name}</h2>
              <button onClick={() => setPreviewTemplate(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
            </div>
            <div style={{ flex: 1, background: previewTemplate.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '48px', fontWeight: 800, textShadow: '0 4px 8px rgba(0,0,0,0.3)' }}>
              {previewTemplate.name} Layout Showcase
            </div>
            <div style={{ padding: '24px', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
              <button onClick={() => setPreviewTemplate(null)} style={{ padding: '12px 24px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: 600 }}>Close Preview</button>
              <button 
                onClick={() => handleUseTemplate(previewTemplate)}
                className="premium-button"
                style={{ padding: '12px 24px' }}
              >
                Use This Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
