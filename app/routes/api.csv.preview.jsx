import { parse } from "csv-parse/sync";
import { convertCsv } from "../services/csv/index.js";

export async function action({ request }) {
  const formData = await request.formData();
  const file = formData.get("file");
  const target = formData.get("target");

  const records = parse(await file.text(), {
    columns: true,
    skip_empty_lines: true,
  });

  const { rows } = convertCsv(target, records);

  return Response.json({
    count: rows.length,
    preview: rows.slice(0, 10),
  });
}
