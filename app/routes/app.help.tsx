export default function HelpCenter() {
  const faqs = [
    { q: "How do I apply a layout to a specific collection?", a: "You can apply a layout by going to the Preview & Publish tab and selecting the target Shopify collection before clicking publish." },
    { q: "Can I use custom CSS?", a: "Yes! The Professional and Premium plans allow you to inject custom CSS in the Settings tab." },
    { q: "How do hover animations work on mobile?", a: "Hover animations are automatically converted to tap-to-reveal interactions on touch devices." }
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 8px 0' }}>Help Center</h2>
      <p style={{ color: 'var(--color-secondary-text)', margin: '0 0 32px 0' }}>Find answers, tutorials, and get in touch with our support team.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        <div className="premium-card" style={{ padding: '24px', textAlign: 'center', cursor: 'pointer' }}>
          <span style={{ fontSize: '32px', display: 'block', marginBottom: '12px' }}>📖</span>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>Documentation</h3>
          <p style={{ margin: 0, color: 'var(--color-secondary-text)', fontSize: '14px' }}>Read our detailed setup guides.</p>
        </div>
        <div className="premium-card" style={{ padding: '24px', textAlign: 'center', cursor: 'pointer' }}>
          <span style={{ fontSize: '32px', display: 'block', marginBottom: '12px' }}>💬</span>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>Live Chat</h3>
          <p style={{ margin: 0, color: 'var(--color-secondary-text)', fontSize: '14px' }}>Talk to our support team.</p>
        </div>
      </div>

      <div className="premium-card" style={{ padding: '32px' }}>
        <h3 style={{ margin: '0 0 24px 0', fontSize: '20px' }}>Frequently Asked Questions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {faqs.map((faq, index) => (
            <div key={index} style={{ borderBottom: index === faqs.length - 1 ? 'none' : '1px solid var(--color-border)', paddingBottom: index === faqs.length - 1 ? 0 : '16px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 600 }}>{faq.q}</h4>
              <p style={{ margin: 0, color: 'var(--color-secondary-text)' }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
