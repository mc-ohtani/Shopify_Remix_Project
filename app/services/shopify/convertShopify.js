export function convertShopify(target, customers) {
  if (target === "freee") {
    return {
      headers: ["名前（通称）", "取引先コード"],
      rows: customers.map((c) => ({
        "名前（通称）": c.displayName ?? "",
        "取引先コード": c.id,
      })),
    };
  }

  if (target === "moneyforward") {
    return {
      headers: ["取引先名", "取引先コード"],
      rows: customers.map((c) => ({
        "取引先名": c.displayName ?? "",
        "取引先コード": c.id,
      })),
    };
  }

  throw new Error("unknown target");
}
