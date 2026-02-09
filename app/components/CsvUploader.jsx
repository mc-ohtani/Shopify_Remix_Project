import { useState } from "react";

export default function CsvUploader() {
  const [file, setFile] = useState(null);
  const [target, setTarget] = useState("freee");
  const [result, setResult] = useState(null);

  function buildFormData() {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("target", target);
    return formData;
  }

  async function handlePreview(e) {
    e.preventDefault();

    const res = await fetch("/api/csv/preview", {
      method: "POST",
      body: buildFormData(),
    });

    setResult(await res.json());
  }

  async function handleDownload(e) {
    e.preventDefault();

    const res = await fetch("/api/csv/download", {
      method: "POST",
      body: buildFormData(),
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${target}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
  }


  return (
    <div>
      <form>
        <select value={target} onChange={(e) => setTarget(e.target.value)}>
          <option value="freee">freee</option>
          <option value="moneyforward">マネーフォワード</option>
        </select>

        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button type="button" onClick={handlePreview}>
          プレビュー
        </button>

        <button type="button" onClick={handleDownload}
          disabled={result?.errors?.length > 0}>
          CSVをダウンロード
        </button>
      </form>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>プレビュー（{result.count}件）</h3>

          {result.errors.length > 0 ? (
            // エラーがある場合
            <div style={{ color: "red", marginBottom: 10 }}>
              <strong>エラーがあります：</strong>
              <ul>
                {result.errors.map((e) => (
                  <li key={e.row}>
                    {e.row}行目：{e.messages.join(" / ")}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            // エラーがない場合だけプレビュー表示
            <pre>{JSON.stringify(result.preview, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  );
}
