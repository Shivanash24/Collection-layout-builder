import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.public.appProxy(request);

  if (!session) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await prisma.storeSettings.findUnique({
    where: { shop: session.shop },
  });

  return json({ 
    settings: settings || {
      templateId: "1",
      cardRadius: 14,
      cardShadow: "Medium",
      hoverAnimation: "None",
      productsPerRow: 3,
      containerWidth: "Standard (1200px)",
    }
  });
};
