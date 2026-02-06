import { useState } from "react";

export default function CsvUploader() {
  const [file, setFile] = useState(null);
  const [target, setTarget] = useState("freee");
  const [result, setResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("target", target);

    const res = await fetch("/api/csv", {
      method: "POST",
      body: formData,
    });

    const json = await res.json();
    setResult(json);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <select value={target} onChange={(e) => setTarget(e.target.value)}>
          <option value="freee">freee</option>
          <option value="moneyforward">マネーフォワード</option>
        </select>

        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button type="submit">変換</button>
      </form>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>プレビュー（{result.count}件）</h3>
          <pre>{JSON.stringify(result.preview, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
