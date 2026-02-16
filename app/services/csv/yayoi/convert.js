// app/services/csv/yayoi/convert.js (新規作成)
import { headers } from "./headers.js";

function safeGet(row, possibleKeys) {
  const foundKey = Object.keys(row).find((k) =>
    possibleKeys.some(target => k.trim() === target)
  );
  const value = foundKey ? row[foundKey] : "";
  return typeof value === "string" ? value.trim() : value;
}

export function convert(records) {
  return records.map((row) => {
    const item = safeGet(row, ["品目", "商品名"]);
    const price = safeGet(row, ["金額", "単価"]);
    const date = new Date().toLocaleDateString("ja-JP"); // 本来はCSVの日付を取得

    const data = {
      "識別フラグ": "2000", // 通常の仕訳
      "取引日付": date,
      "借方勘定科目": "売掛金",
      "借方税区分": "課税売上10%",
      "借方金額": price,
      "貸方勘定科目": "売上高",
      "貸方税区分": "課税売上10%",
      "貸方金額": price,
      "摘要": item,
      "タイプ": "0",
      "生成元": "Shopifyアプリ"
    };

    return headers.reduce((acc, h) => {
      acc[h] = data[h] ?? "";
      return acc;
    }, {});
  });
}