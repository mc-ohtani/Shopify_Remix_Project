export function validateRows(target, rows) {
  const errors = [];

  rows.forEach((row, index) => {
    const rowErrors = [];

    // --- マネーフォワード用 ---
    if (target === "moneyforward") {
      if (!row["取引先名"]) {
        rowErrors.push("取引先名が空です");
      }
    }

    // --- freee用 ---
    if (target === "freee") {
      if (!row["名前（通称）"]) {
        rowErrors.push("名前（通称）が空です");
      }
    }
    
    // --- 弥生会計用 ---
    if (target === "yayoi") {
      // 弥生会計のインポートに最低限必要な「主キー」的項目
      if (!row["取引日付"]) {
        rowErrors.push("取引日付が空です");
      }
      if (!row["借方勘定科目"]) {
        rowErrors.push("借方勘定科目が空です");
      }
      if (!row["貸方勘定科目"]) {
        rowErrors.push("貸方勘定科目が空です");
      }
      if (!row["借方金額"] || Number(row["借方金額"]) <= 0) {
        rowErrors.push("金額が0または空です");
      }
    }

    if (rowErrors.length > 0) {
      errors.push({
        row: index + 1, // CSVは1始まり
        messages: rowErrors,
      });
    }
  });

  return errors;
}