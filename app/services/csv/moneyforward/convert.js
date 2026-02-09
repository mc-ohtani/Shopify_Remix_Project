import { headers } from "./headers.js";

export function convert(records) {
  return records.map((row) => ({
    "取引先名": row["品目"],
    "取引先コード": row["品目コード"] ?? "",
    "電話番号": "",
    "メールアドレス": "",
  }));
}
