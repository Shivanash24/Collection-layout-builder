import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate, Form, useSubmit } from "@remix-run/react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
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
  const { billing } = await authenticate.admin(request);
  const formData = await request.formData();
  
  if (formData.get("action") === "cancel") {
    const subscriptionId = formData.get("subscriptionId") as string;
    if (subscriptionId) {
      await billing.cancel({
        subscriptionId,
        isTest: true,
        prorate: true
      });
    }
  }

  return null;
};

export default function Billing() {
  const shopify = useAppBridge();
  const navigate = useNavigate();
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

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 8px 0' }}>Billing & Invoices</h2>
      <p style={{ color: 'var(--color-secondary-text)', margin: '0 0 32px 0' }}>Manage your subscription and billing details.</p>

      <div className="premium-card" style={{ padding: '32px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
          <button 
            onClick={() => navigate("/app/pricing")}
            className="premium-button"
          >
            Upgrade Plan
          </button>
        </div>
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
