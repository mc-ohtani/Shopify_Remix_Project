import { headers } from "./headers.js";

/**
 * キー名の揺れ（空白・改行・微妙な表記違い）を吸収して値を取得
 * @param {Object} row - CSVの1行データ
 * @param {Array} possibleKeys - 許可するヘッダー名の候補リスト
 */
function safeGet(row, possibleKeys) {
  // 1. rowのキー一覧から、possibleKeysのいずれかと（トリムした状態で）一致するものを探す
  const foundKey = Object.keys(row).find((k) =>
    possibleKeys.some(target => k.trim() === target)
  );
  
  // 2. 値を返し、値自体の前後空白も消しておく（undefined/nullなら空文字）
  const value = foundKey ? row[foundKey] : "";
  return typeof value === "string" ? value.trim() : value;
}

export function convert(records) {
  return records.map((row) => {
    // 候補を複数持たせることで、元データの微細な違いを許容する
    const name = safeGet(row, ["品目", "品目名", "取引先名"]);
    const code = safeGet(row, ["品目コード", "コード"]);

    const data = {
      "取引先名": name,
      "取引先名（カナ）": "",
      "取引先コード": code,
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

    // 列順・列保証（headers.js で定義された順番に並べ替える）
    return headers.reduce((acc, h) => {
      acc[h] = data[h] ?? "";
      return acc;
    }, {});
  });
}