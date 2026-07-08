import { useNavigate } from "@remix-run/react";
import { useAppBridge } from "@shopify/app-bridge-react";

export default function Billing() {
  const shopify = useAppBridge();
  const navigate = useNavigate();
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 8px 0' }}>Billing & Invoices</h2>
      <p style={{ color: 'var(--color-secondary-text)', margin: '0 0 32px 0' }}>Manage your subscription and billing details.</p>

      <div className="premium-card" style={{ padding: '32px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>Current Plan: <strong>Professional</strong></h3>
          <p style={{ margin: 0, color: 'var(--color-secondary-text)' }}>$49/month • Next billing date: Aug 12, 2026</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => shopify.toast.show("Cancellation requested")}
            style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--color-danger)', color: 'var(--color-danger)', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: 600 }}
          >
            Cancel Plan
          </button>
          <button 
            onClick={() => navigate("/app/pricing")}
            className="premium-button"
          >
            Upgrade Plan
          </button>
        </div>
      </div>

      <h3 style={{ margin: '32px 0 16px 0', fontSize: '20px' }}>Available Plans</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
        {[
          { name: "Free", price: "$0/mo", current: false, features: ["3 Free Templates", "Classic Grid Layout", "Community Support", "No Analytics"] },
          { name: "Starter", price: "$39/mo", current: false, features: ["5 Templates", "Basic Customization", "Banner Builder", "Email Support", "Analytics"] },
          { name: "Professional", price: "$49/mo", current: true, features: ["10 Templates", "Advanced Customization", "Typography Controls", "Color Controls", "Banner Builder", "Priority Support", "Analytics"] },
          { name: "Premium", price: "$89/mo", current: false, features: ["All 15 Templates", "Unlimited Layouts", "Unlimited Publishing", "Premium Animations", "Priority Support", "Future Updates", "Advanced Settings"] }
        ].map(plan => (
          <div key={plan.name} className="premium-card" style={{ padding: '24px', border: plan.current ? '2px solid var(--color-primary)' : '1px solid var(--color-border)', display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{plan.name}</h4>
            <div style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>{plan.price}</div>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
              {plan.features.map(feature => (
                <li key={feature} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text)', fontSize: '14px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <button 
              onClick={() => {
                if (!plan.current) {
                  shopify.toast.show(`Successfully switched to ${plan.name} plan!`);
                }
              }}
              className="premium-button" style={{ 
              width: '100%', 
              backgroundColor: plan.current ? 'transparent' : 'var(--color-primary)',
              color: plan.current ? 'var(--color-primary)' : 'white',
              border: plan.current ? '1px solid var(--color-primary)' : 'none',
              marginTop: 'auto'
            }}>
              {plan.current ? 'Current Plan' : 'Switch Plan'}
            </button>
          </div>
        ))}
      </div>

      <div className="premium-card" style={{ padding: '32px' }}>
        <h3 style={{ margin: '0 0 24px 0', fontSize: '18px' }}>Invoice History</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-secondary-text)' }}>
              <th style={{ padding: '12px 0', fontWeight: 600 }}>Date</th>
              <th style={{ padding: '12px 0', fontWeight: 600 }}>Amount</th>
              <th style={{ padding: '12px 0', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '12px 0', fontWeight: 600, textAlign: 'right' }}>Invoice</th>
            </tr>
          </thead>
          <tbody>
            {[
              { date: 'Jul 12, 2026', amount: '$49.00', status: 'Paid' },
              { date: 'Jun 12, 2026', amount: '$49.00', status: 'Paid' },
              { date: 'May 12, 2026', amount: '$49.00', status: 'Paid' }
            ].map(inv => (
              <tr key={inv.date} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '16px 0' }}>{inv.date}</td>
                <td style={{ padding: '16px 0', fontWeight: 500 }}>{inv.amount}</td>
                <td style={{ padding: '16px 0' }}>
                  <span style={{ padding: '4px 8px', borderRadius: '12px', backgroundColor: 'rgba(34,197,94,0.1)', color: 'var(--color-success)', fontSize: '12px', fontWeight: 600 }}>{inv.status}</span>
                </td>
                <td style={{ padding: '16px 0', textAlign: 'right' }}>
                  <button 
                    onClick={() => shopify.toast.show("Downloading invoice...")}
                    style={{ border: 'none', background: 'none', color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
