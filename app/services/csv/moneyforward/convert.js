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
      "取引先名（カナ）": "",
      "取引先コード": get(row, "品目コード"),
      "敬称": "御中",
      "郵便番号": "",
      "都道府県": "",
      "市区町村・番地": "",
      "建物名・部屋番号": "",
      "電話番号": "",
      "FAX番号": "",
      "メールアドレス": "",
      "備考": "",
    };

    // 列順・列保証
    return headers.reduce((acc, h) => {
      acc[h] = data[h] ?? "";
      return acc;
    }, {});
  });
}
