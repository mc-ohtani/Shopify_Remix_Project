
import { parse } from "csv-parse/sync";
import { convertCsv } from "../services/csv/index";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get("file");
  const target = formData.get("target");

  const text = await file.text();
  const records = parse(text, { columns: true });

  const result = convertCsv(target, records);

  return Response.json({ result });
}