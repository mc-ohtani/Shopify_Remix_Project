import { authenticate } from "../shopify.server";
import { stringify } from "csv-stringify/sync";
import { buildShopifyCsv } from "../services/shopify/buildShopifyCsv";

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();

  const resource = formData.get("resource");
  const target = formData.get("target");

  const { headers, rows } = await buildShopifyCsv(admin, resource, target);

  const csv = stringify(rows, {
    header: true,
    columns: headers,
  });

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename=shopify-${target}.csv`,
    },
  });
};
