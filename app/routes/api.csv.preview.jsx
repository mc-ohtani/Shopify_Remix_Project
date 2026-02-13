import { parse } from "csv-parse/sync";
import { convertCsv } from "../services/csv/index.js";
import { validateRows } from "../services/csv/validate.js";

export async function action({ request }) {
  const formData = await request.formData();
  const file = formData.get("file");
  const target = formData.get("target");

  const records = parse(await file.text(), {
    columns: true,
    skip_empty_lines: true,
    // delimiter: "\t" を削除するか、以下のようにリラックスさせます
    relax_column_count: true,
    trim: true, // 前後の空白を自動除去
  });

  const { rows } = convertCsv(target, records);
  const errors = validateRows(target, rows);

  return Response.json({
    count: rows.length,
    preview: rows.slice(0, 5),
    errors,
  });
}
