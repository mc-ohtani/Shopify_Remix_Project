import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify";
import { convertCsv } from "../services/csv/index.js";

export async function action({ request }) {
  const formData = await request.formData();
  const file = formData.get("file");
  const target = formData.get("target");

  const records = parse(await file.text(), {
    columns: true,
    skip_empty_lines: true,
  });

  const { headers, rows } = convertCsv(target, records);

  const csv = stringify(rows, {
    header: true,
    columns: headers,
  });

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename=${target}.csv`,
    },
  });
}
