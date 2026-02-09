export function validateRows(target, rows) {
  const errors = [];

  rows.forEach((row, index) => {
    const rowErrors = [];

    if (target === "moneyforward") {
      if (!row["取引先名"]) {
        rowErrors.push("取引先名が空です");
      }
    }

    if (target === "freee") {
      if (!row["名前（通称）"]) {
        rowErrors.push("名前（通称）が空です");
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
