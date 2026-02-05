export function convertMoneyForward(records) {
  return records.map((row) => ({
    title: row["品目"],
    price: row["金額"],
    sku: row["品目コード"],
  }));
}