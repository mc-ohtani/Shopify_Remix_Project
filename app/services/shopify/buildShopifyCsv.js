import { fetchCustomers } from "./fetchCustomers";
import { convertShopify } from "./convert";

export async function buildShopifyCsv(admin, resource, target) {
  let records = [];

  if (resource === "customers") {
    records = await fetchCustomers(admin);
  } else {
    throw new Error("unsupported resource");
  }

  const { headers, rows } = convertShopify(target, records);

  return { headers, rows };
}
