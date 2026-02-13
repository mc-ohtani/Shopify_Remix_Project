import { headers } from "./headers.js";

export function convert(records) {
  return records.map((row) => {
    // どのキーが「品目」に該当するか探す（トリムして一致を確認）
    const getVal = (possibleKeys) => {
      const foundKey = Object.keys(row).find(key => possibleKeys.includes(key.trim()));
      return foundKey ? row[foundKey] : "";
    };

    const hinmoku = getVal(["品目", "品目名", "item"]);
    const code = getVal(["品目コード", "code"]);

    const data = {
      "名前（通称）": hinmoku,
      "取引先コード": code,
      "正式名称（帳票出力時に使用される名称）": hinmoku,
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