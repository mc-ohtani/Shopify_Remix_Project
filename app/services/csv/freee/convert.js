import { headers } from "./headers.js";

export function convert(records) {
  return records.map((row) => {
    const data = {
      "名前（通称）": row["品目"],
      "取引先コード": row["品目コード"] ?? "",
      "正式名称（帳票出力時に使用される名称）": row["品目"],
      "敬称": "御中",
      "事業所種別": "法人",
      "顧客として利用する": "利用する",
      "請求先として利用する": "利用する",
    };

    return headers.reduce((acc, h) => {
      acc[h] = data[h] ?? "";
      return acc;
    }, {});
  });
}