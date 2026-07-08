import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate, Form, useSubmit } from "@remix-run/react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate, PLAN_STARTER, PLAN_PROFESSIONAL, PLAN_PREMIUM } from "../shopify.server";
import prisma from "../db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { billing, session } = await authenticate.admin(request);
  const billingCheck = await billing.check();
  
  const hasActivePayment = billingCheck.hasActivePayment;
  const appSubscriptions = billingCheck.appSubscriptions;

  const activePlan = hasActivePayment && appSubscriptions.length > 0 
    ? appSubscriptions[0].name 
    : "Free";

  const storeSettings = await prisma.storeSettings.findUnique({
    where: { shop: session.shop }
  });

  if (!storeSettings || storeSettings.activePlan !== activePlan) {
    await prisma.storeSettings.upsert({
      where: { shop: session.shop },
      create: { shop: session.shop, activePlan },
      update: { activePlan }
    });
  }

  return json({ activePlan, appSubscriptions });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { billing, session } = await authenticate.admin(request);
  const formData = await request.formData();
  const formAction = formData.get("action") as string;
  
  if (formAction === "cancel") {
    const subscriptionId = formData.get("subscriptionId") as string;
    if (subscriptionId) {
      await billing.cancel({
        subscriptionId,
        isTest: true,
        prorate: true
      });
    }
    return null;
  }

  if (formAction === "upgrade") {
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
      await prisma.storeSettings.upsert({
        where: { shop: session.shop },
        create: { shop: session.shop, activePlan: "Free" },
        update: { activePlan: "Free" }
      });
    }
  }

  return null;
};

export default function Billing() {
  const shopify = useAppBridge();
  const { activePlan, appSubscriptions } = useLoaderData<typeof loader>();
  const submit = useSubmit();

  const handleCancel = (subscriptionId: string) => {
    submit({ action: "cancel", subscriptionId }, { method: "post" });
    shopify.toast.show("Cancellation requested");
  };

  const getPlanPrice = (plan: string) => {
    switch (plan) {
      case "Starter Plan": return "$39/mo";
      case "Professional Plan": return "$49/mo";
      case "Premium Plan": return "$89/mo";
      default: return "$0/mo";
    }
  };

  const getCleanPlanName = (plan: string) => {
    return plan.replace(" Plan", "");
  };

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
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 8px 0' }}>Billing & Invoices</h2>
      <p style={{ color: 'var(--color-secondary-text)', margin: '0 0 32px 0' }}>Manage your subscription and billing details.</p>

      <div className="premium-card" style={{ padding: '32px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>Current Plan: <strong>{activePlan}</strong></h3>
          <p style={{ margin: 0, color: 'var(--color-secondary-text)' }}>{getPlanPrice(activePlan)}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {appSubscriptions.length > 0 && (
            <button 
              onClick={() => handleCancel(appSubscriptions[0].id)}
              style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--color-danger)', color: 'var(--color-danger)', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: 600 }}
            >
              Cancel Plan
            </button>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .upgrade-btn-custom {
          width: 100%;
          padding: 10px;
          font-size: 14px;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .upgrade-btn-popular {
          background-color: var(--color-primary);
          color: white;
          border: none;
        }
        .upgrade-btn-popular:hover {
          background-color: var(--color-primary-hover);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(91, 75, 255, 0.3);
        }
        .upgrade-btn-standard {
          background-color: transparent;
          color: var(--color-primary);
          border: 1px solid var(--color-primary);
        }
        .upgrade-btn-standard:hover:not(:disabled) {
          background-color: var(--color-primary);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(91, 75, 255, 0.2);
        }
        .upgrade-btn-current {
          background-color: transparent;
          color: var(--color-primary);
          border: 1px solid var(--color-primary);
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}} />

      <h3 style={{ margin: '32px 0 16px 0', fontSize: '20px' }}>Available Plans</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
        {plans.map((plan) => {
          const isCurrent = getCleanPlanName(activePlan) === plan.name;
          return (
            <div key={plan.name} className="premium-card" style={{ 
              padding: '24px', 
              position: 'relative',
              border: plan.popular ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
              transform: plan.popular ? 'scale(1.02)' : 'scale(1)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {plan.popular && (
                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--color-primary)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.5px' }}>
                  MOST POPULAR
                </div>
              )}
              <h3 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 12px 0' }}>{plan.name}</h3>
              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: '32px', fontWeight: 800 }}>{plan.price}</span>
                <span style={{ color: 'var(--color-secondary-text)' }}>/mo</span>
              </div>
              
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                {plan.features.map(feature => (
                  <li key={feature} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text)', fontSize: '13px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Form method="post">
                <input type="hidden" name="action" value="upgrade" />
                <input type="hidden" name="plan" value={plan.name} />
                <button 
                  type="submit"
                  disabled={isCurrent}
                  className={`upgrade-btn-custom ${isCurrent ? 'upgrade-btn-current' : plan.popular ? 'upgrade-btn-popular' : 'upgrade-btn-standard'}`}
                >
                  {isCurrent ? 'Current Plan' : 'Upgrade Now'}
                </button>
              </Form>
            </div>
          );
        })}
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
            <tr>
              <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: 'var(--color-secondary-text)' }}>
                You can view detailed invoices in your Shopify admin settings.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
