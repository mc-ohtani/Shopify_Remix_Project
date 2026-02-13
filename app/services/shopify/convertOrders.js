export function convertOrders(target, orders) {
  if (target === "freee") {
    return {
      headers: ["取引日", "取引先", "金額"],
      rows: orders.map(order => ({
        "取引日": order.createdAt.split("T")[0],
        "取引先":
          order.customer
            ? `${order.customer.lastName ?? ""}${order.customer.firstName ?? ""}`
            : "ゲスト",
        "金額": order.totalPriceSet.shopMoney.amount,
      })),
    };
  }

  if (target === "moneyforward") {
    return {
      headers: ["取引先名", "取引日", "金額"],
      rows: orders.map(order => ({
        "取引先名":
          order.customer
            ? `${order.customer.lastName ?? ""}${order.customer.firstName ?? ""}`
            : "ゲスト",
        "取引日": order.createdAt.split("T")[0],
        "金額": order.totalPriceSet.shopMoney.amount,
      })),
    };
  }
}
