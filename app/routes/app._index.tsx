import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import { useAppBridge } from "@shopify/app-bridge-react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return { storeName: "My Awesome Store" };
};

export default function Dashboard() {
  const { storeName } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const shopify = useAppBridge();

  const layouts = [
    { id: 1, name: "Summer Collection", status: "Published", updated: "2 hrs ago", img: "https://via.placeholder.com/300x200" },
    { id: 2, name: "Winter Sale", status: "Draft", updated: "1 day ago", img: "https://via.placeholder.com/300x200" },
    { id: 3, name: "New Arrivals", status: "Published", updated: "3 days ago", img: "https://via.placeholder.com/300x200" },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 8px 0' }}>Good Morning, {storeName} 👋</h2>
          <p style={{ color: 'var(--color-secondary-text)', margin: 0 }}>Here is what's happening with your layouts today.</p>
        </div>
        <button className="premium-button" onClick={() => navigate("/app/templates")}>
          + Create New Layout
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '48px' }}>
        {layouts.map((layout) => (
          <div key={layout.id} className="premium-card" style={{ overflow: 'hidden' }}>
            <div style={{ height: '160px', backgroundColor: '#e2e8f0', backgroundImage: `url(${layout.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 600 }}>{layout.name}</h3>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-secondary-text)' }}>Updated {layout.updated}</p>
                </div>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  backgroundColor: layout.status === 'Published' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  color: layout.status === 'Published' ? 'var(--color-success)' : 'var(--color-warning)'
                }}>
                  {layout.status}
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
                  onClick={() => shopify.toast.show(`Previewing ${layout.name}`)}
                  style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)', backgroundColor: 'transparent', cursor: 'pointer' }}
                >
                  👁️
                </button>
                <button 
                  onClick={() => shopify.toast.show(`Deleted ${layout.name}`)}
                  style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)', backgroundColor: 'transparent', cursor: 'pointer' }}
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
          <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', borderRadius: '8px' }}>
            <p style={{ color: 'var(--color-secondary-text)' }}>Chart Placeholder</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="premium-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 16px 0' }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                onClick={() => navigate("/app/colors-typography")}
                style={{ padding: '12px', textAlign: 'left', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: 500 }}
              >
                🎨 Customize Theme Colors
              </button>
              <button 
                onClick={() => navigate("/app/pricing")}
                style={{ padding: '12px', textAlign: 'left', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: 500 }}
              >
                ✨ Upgrade to Premium
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
