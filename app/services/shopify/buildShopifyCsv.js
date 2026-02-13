import { fetchCustomers } from "./fetchCustomers.js";
import { fetchOrders } from "./fetchOrders.js";
import { convertShopify } from "./convertShopify.js";
import { convertOrders } from "./convertOrders.js";

export async function buildShopifyCsv(admin, resource, target) {
  if (resource === "customers") {
    const customers = await fetchCustomers(admin);
    return convertShopify(target, customers);
  }

  if (resource === "orders") {
    const orders = await fetchOrders(admin);
    return convertOrders(target, orders);
  }
}