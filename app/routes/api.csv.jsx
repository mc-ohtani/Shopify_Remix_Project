import { parse } from "csv-parse/sync";
import { convertCsv } from "../services/csv/index.js";

export async function action({ request }) {
  const formData = await request.formData();
  const file = formData.get("file");
  const target = formData.get("target");

  if (!file) {
    return new Response("No file uploaded", { status: 400 });
  }

  const text = await file.text();

  const records = parse(text, {
    columns: true,
    skip_empty_lines: true,
  });

  const converted = convertCsv(target, records);

  return Response.json({
    count: converted.length,
    preview: converted.slice(0, 10), // ← プレビュー用
  });
}
