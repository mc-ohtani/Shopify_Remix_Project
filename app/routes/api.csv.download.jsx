import iconv from "iconv-lite";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import { convertCsv } from "../services/csv/index.js";

export async function action({ request }) {
  const formData = await request.formData();
  const file = formData.get("file");
  const target = formData.get("target");

  const records = parse(await file.text(), {
    columns: true,
    skip_empty_lines: true,
    // delimiter: "\t" が残っていたら削除（または自動認識に任せる）
    trim: true,
  });

  const { headers, rows } = convertCsv(target, records);

  // string設定でCSV生成
  const csvUtf8 = stringify(rows, {
    header: true,
    columns: headers,
  });

  // マネーフォワードはShift_JIS、freeeはUTF-8で出力
  const isMoneyForward = target === "moneyforward";
  const body = isMoneyForward
    ? iconv.encode(csvUtf8, "cp932") // Buffer
    : csvUtf8; // string

  return new Response(body, {
    headers: {
      "Content-Type": isMoneyForward
        ? "text/csv; charset=Shift_JIS"
        : "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename=${target}.csv`,
    },
  });
}
