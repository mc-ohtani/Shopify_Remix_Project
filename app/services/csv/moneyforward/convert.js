import { headers } from "./headers.js";

/**
 * キー名の揺れ・空白・文字化けを吸収
 */
function get(row, key) {
  const foundKey = Object.keys(row).find(
    (k) => k.trim() === key
  );
  return foundKey ? row[foundKey] : "";
}

export function convert(records) {
  return records.map((row) => {
    const data = {
      "取引先名": get(row, "品目"),
      "取引先コード": get(row, "品目コード"),
      "電話番号": "",
      "メールアドレス": "",
    };

    // headers に存在する列だけを、順番保証で出力
    return headers.reduce((acc, h) => {
      acc[h] = data[h] ?? "";
      return acc;
    }, {});
  });
}
