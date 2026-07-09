import { useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { login } from "../../shopify.server";
import { loginErrorMessage } from "./error.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const errors = loginErrorMessage(await login(request));
  return { errors };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const errors = loginErrorMessage(await login(request));
  return { errors };
};

export default function Auth() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [shop, setShop] = useState("");
  const { errors } = actionData || loaderData;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', // Premium dark gradient
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '24px'
    }}>
      <style dangerouslySetInnerHTML={{__html: `
        .login-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 48px;
          width: 100%;
          max-width: 480px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          color: white;
          text-align: center;
        }
        .login-input {
          width: 100%;
          padding: 16px;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: white;
          font-size: 16px;
          margin-top: 8px;
          margin-bottom: 24px;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }
        .login-input:focus {
          outline: none;
          border-color: #818cf8;
          box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.2);
        }
        .login-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4);
        }
        .error-msg {
          color: #f87171;
          font-size: 14px;
          margin-bottom: 16px;
          text-align: left;
        }
      `}} />
      
      <div className="login-card">
        <div style={{ marginBottom: '32px' }}>
          <img 
            src="/collection%20buildeer%20icon.jpg" 
            alt="Collection Builder Pro" 
            style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '20px', 
              objectFit: 'cover',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
              marginBottom: '24px'
            }} 
          />
          <h1 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 12px 0', letterSpacing: '-0.5px' }}>
            Collection Builder Pro
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '16px', lineHeight: '1.5' }}>
            Design beautiful, high-converting collection layouts for your Shopify store.
          </p>
        </div>

        <Form method="post" style={{ textAlign: 'left' }}>
          <label style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
            Shopify Store URL
          </label>
          <input
            type="text"
            name="shop"
            placeholder="e.g. my-awesome-store.myshopify.com"
            value={shop}
            onChange={(e) => setShop(e.target.value)}
            className="login-input"
            autoComplete="on"
            required
          />
          {errors?.shop && (
            <div className="error-msg">{errors.shop}</div>
          )}
          <button type="submit" className="login-btn">
            Log in to Dashboard
          </button>
        </Form>
        
        <p style={{ marginTop: '32px', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
          Secure login via Shopify
        </p>
      </div>
    </div>
  );
}
