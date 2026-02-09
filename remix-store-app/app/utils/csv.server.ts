// CSV文字列を生成するユーティリティ関数

export function toCsv(rows: string[][]): string {
  return rows
    .map(row =>
      row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");
}
