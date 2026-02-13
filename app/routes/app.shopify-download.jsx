import { authenticate } from "../shopify.server";
import { buildShopifyCsv } from "../services/shopify/buildShopifyCsv.js";

export async function action({ request }) {
  const { admin } = await authenticate.admin(request);

  const formData = await request.formData();
  const resource = formData.get("resource");
  const target = formData.get("target");

  const { headers, rows } = await buildShopifyCsv(
    admin,
    resource,
    target
  );

  const csv =
    headers.join(",") +
    "\n" +
    rows.map(r => headers.map(h => r[h]).join(",")).join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename=${resource}.csv`,
    },
  });
}
