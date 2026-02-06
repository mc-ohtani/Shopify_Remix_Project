
import { useFetcher } from "react-router";

export default function CsvUploader() {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="post" action="/api/csv" encType="multipart/form-data">
      <select name="target">
        <option value="freee">freee</option>
        <option value="moneyforward">マネーフォワード</option>
      </select>

      <input type="file" name="file" accept=".csv" />

      <button type="submit">変換</button>

      {fetcher.data && (
        <pre>{JSON.stringify(fetcher.data.result, null, 2)}</pre>
      )}
    </fetcher.Form>
  );
}