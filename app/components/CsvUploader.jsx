import { useState } from "react";

export default function CsvUploader() {
  const [file, setFile] = useState(null);
  const [target, setTarget] = useState("freee");
  const [result, setResult] = useState(null);
  const [downloadLocked, setDownloadLocked] = useState(false);

  function buildFormData() {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("target", target);
    return fd;
  }

  async function handlePreview() {
    if (!file) return;

    const res = await fetch("/api/csv/preview", {
      method: "POST",
      body: buildFormData(),
    });

    const json = await res.json();
    setResult(json);

    if (json.errors?.length > 0) {
      setDownloadLocked(true);
    }
  }

  async function handleDownload() {
    if (!file) {
      alert("CSVファイルを選択してください");
      return;
    }

    if (downloadLocked) {
      alert("エラーがあるためダウンロードできません");
      return;
    }

    const res = await fetch("/api/csv/download", {
      method: "POST",
      body: buildFormData(),
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${target}.csv`;
    a.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <select value={target} onChange={(e) => setTarget(e.target.value)}>
        <option value="freee">freee</option>
        <option value="moneyforward">マネーフォワード</option>
      </select>

      <input
        type="file"
        accept=".csv"
        onChange={(e) => {
          setFile(e.target.files[0]);
          setResult(null);
          setDownloadLocked(false);
        }}
      />

      <div style={{ marginTop: 8 }}>
        <button type="button" onClick={handlePreview}>
          プレビュー
        </button>
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloadLocked}
        >
          CSVダウンロード
        </button>
      </div>

      {result?.errors?.length > 0 && (
        <div style={{ color: "red", marginTop: 12 }}>
          <strong>エラーがあります：</strong>
          <ul>
            {result.errors.map((e) => (
              <li key={e.row}>
                {e.row}行目：{e.messages.join(" / ")}
              </li>
            ))}
          </ul>
        </div>
      )}

      {result?.preview && (
        <pre style={{ marginTop: 12 }}>
          {JSON.stringify(result.preview, null, 2)}
        </pre>
      )}
    </div>
  );
}
