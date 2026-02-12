import { authenticate } from "../shopify.server";
import { buildShopifyCsv } from "../services/shopify/buildShopifyCsv";

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();

  const resource = formData.get("resource");
  const target = formData.get("target");

  const { rows } = await buildShopifyCsv(admin, resource, target);

  return Response.json({
    count: rows.length,
    preview: rows.slice(0, 5),
  });
};
