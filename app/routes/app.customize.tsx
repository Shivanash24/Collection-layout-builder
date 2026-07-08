import { useState, useEffect } from "react";
import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useSearchParams, Form, useSubmit } from "@remix-run/react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { TemplateRenderer } from "../components/TemplateRenderer";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const storeSettings = await prisma.storeSettings.findUnique({
    where: { shop: session.shop }
  });
  return json({ storeSettings: storeSettings || {
    templateId: "1",
    activePlan: "Free",
    productsPerRow: 3,
    cardRadius: 14,
    cardShadow: "Medium",
    containerWidth: "Standard (1200px)",
    hoverAnimation: "None"
  } });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  
  const productsPerRow = Number(formData.get("productsPerRow"));
  const containerWidth = formData.get("containerWidth") as string;
  const cardRadius = Number(formData.get("cardRadius"));
  const cardShadow = formData.get("cardShadow") as string;
  const hoverAnimation = formData.get("hoverAnimation") as string;

  await prisma.storeSettings.upsert({
    where: { shop: session.shop },
    create: { shop: session.shop, productsPerRow, containerWidth, cardRadius, cardShadow, hoverAnimation },
    update: { productsPerRow, containerWidth, cardRadius, cardShadow, hoverAnimation }
  });

  return json({ success: true });
};

export default function Customize() {
  const { storeSettings } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("template") || storeSettings.templateId || "1";
  
  const currentPlan = storeSettings.activePlan || "Free";

  const [device, setDevice] = useState("Desktop");
  const [productsPerRow, setProductsPerRow] = useState(storeSettings.productsPerRow || 3);
  const [cardRadius, setCardRadius] = useState(storeSettings.cardRadius || 14);
  const [cardShadow, setCardShadow] = useState(storeSettings.cardShadow || "Medium");
  const [containerWidth, setContainerWidth] = useState(storeSettings.containerWidth || "Standard (1200px)");
  const [hoverAnimation, setHoverAnimation] = useState(storeSettings.hoverAnimation || "None");
  
  const shopify = useAppBridge();
  const submit = useSubmit();
  const mockProducts = [1, 2, 3, 4, 5, 6];

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

  const activeTemplate = templates.find(t => t.id === templateId) || templates[0];

  const handleSave = () => {
    submit({
      productsPerRow: String(productsPerRow),
      containerWidth,
      cardRadius: String(cardRadius),
      cardShadow,
      hoverAnimation
    }, { method: "post" });
    shopify.toast.show("Layout settings saved successfully!");
  };

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
          onClick={handleSave}
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
            <h2 style={{ textAlign: 'center', marginBottom: '32px', fontSize: '24px', fontWeight: 700 }}>{activeTemplate.name} Preview</h2>
            
            {/* Live Rendered Template Designs */}
            <TemplateRenderer 
              template={activeTemplate}
              mockProducts={mockProducts}
              cardRadius={cardRadius}
              cardShadow={cardShadow}
              getGridColumns={getGridColumns()}
              device={device}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
