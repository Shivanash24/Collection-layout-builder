import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { useSubmit, Form } from "@remix-run/react";
import { authenticate, PLAN_STARTER, PLAN_PROFESSIONAL, PLAN_PREMIUM } from "../shopify.server";
import prisma from "../db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return json({});
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { billing, session } = await authenticate.admin(request);
  const formData = await request.formData();
  const planName = formData.get("plan") as string;

  let targetPlan = "";
  if (planName === "Starter") targetPlan = PLAN_STARTER;
  if (planName === "Professional") targetPlan = PLAN_PROFESSIONAL;
  if (planName === "Premium") targetPlan = PLAN_PREMIUM;

  if (targetPlan) {
    await billing.require({
      plans: [targetPlan],
      isTest: true,
      onFailure: async () => billing.request({
        plan: targetPlan,
        isTest: true,
        returnUrl: `https://${session.shop}/admin/apps/collection-layout-builder/app/billing`
      }),
    });
  } else if (planName === "Free") {
    // Optionally handle downgrade to free plan
    await prisma.storeSettings.upsert({
      where: { shop: session.shop },
      create: { shop: session.shop, activePlan: "Free" },
      update: { activePlan: "Free" }
    });
  }

  return null;
};

export default function Pricing() {
  const submit = useSubmit();
  const plans = [
    {
      name: "Free",
      price: "$0",
      popular: false,
      features: [
        "3 Free Templates",
        "Classic Grid Layout",
        "Community Support",
        "No Analytics"
      ]
    },
    {
      name: "Starter",
      price: "$39",
      popular: false,
      features: [
        "5 Templates",
        "Basic Customization",
        "Banner Builder",
        "Email Support",
        "Analytics"
      ]
    },
    {
      name: "Professional",
      price: "$49",
      popular: true,
      features: [
        "10 Templates",
        "Advanced Customization",
        "Typography Controls",
        "Color Controls",
        "Banner Builder",
        "Priority Support",
        "Analytics"
      ]
    },
    {
      name: "Premium",
      price: "$89",
      popular: false,
      features: [
        "All 15 Templates",
        "Unlimited Layouts",
        "Unlimited Publishing",
        "Premium Animations",
        "Priority Support",
        "Future Updates",
        "Advanced Settings"
      ]
    }
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
      <h2 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 16px 0' }}>Simple, transparent pricing</h2>
      <p style={{ color: 'var(--color-secondary-text)', fontSize: '18px', margin: '0 0 48px 0' }}>Choose the plan that fits your business needs.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', alignItems: 'center' }}>
        {plans.map((plan) => (
          <div key={plan.name} className="premium-card" style={{ 
            padding: '32px 24px', 
            position: 'relative',
            border: plan.popular ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
            transform: plan.popular ? 'scale(1.05)' : 'scale(1)',
            zIndex: plan.popular ? 2 : 1
          }}>
            {plan.popular && (
              <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--color-primary)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.5px' }}>
                MOST POPULAR
              </div>
            )}
            <h3 style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 16px 0' }}>{plan.name}</h3>
            <div style={{ marginBottom: '32px' }}>
              <span style={{ fontSize: '48px', fontWeight: 800 }}>{plan.price}</span>
              <span style={{ color: 'var(--color-secondary-text)' }}>/month</span>
            </div>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {plan.features.map(feature => (
                <li key={feature} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-text)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            
            <Form method="post">
              <input type="hidden" name="plan" value={plan.name} />
              <button 
                type="submit"
                className="premium-button" 
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  fontSize: '16px',
                  backgroundColor: plan.popular ? 'var(--color-primary)' : 'transparent',
                  color: plan.popular ? 'white' : 'var(--color-primary)',
                  border: plan.popular ? 'none' : '1px solid var(--color-primary)'
                }}
              >
                {plan.popular ? 'Upgrade Now' : 'Choose Plan'}
              </button>
            </Form>
          </div>
        ))}
      </div>
    </div>
  );
}

