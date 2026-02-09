import { useState } from "react";

export default function CsvUploader() {
  const [file, setFile] = useState(null);
  const [target, setTarget] = useState("freee");
  const [result, setResult] = useState(null);

  // エラー確定後に true
  const [downloadLocked, setDownloadLocked] = useState(false);

  function buildFormData() {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("target", target);
    return formData;
  }

  async function handlePreview(e) {
    e.preventDefault();
    if (!file) return;

    const res = await fetch("/api/csv/preview", {
      method: "POST",
      body: buildFormData(),
    });

    const json = await res.json();
    setResult(json);
  }

  async function handleDownload(e) {
    e.preventDefault();

    if (downloadLocked) return;

    if (!file) {
      alert("CSVファイルを選択してください。");
      return;
    }

    // ★ ダウンロード前に validation 専用 API を叩く
    const validateRes = await fetch("/api/csv/preview", {
      method: "POST",
      body: buildFormData(),
    });

    const validateJson = await validateRes.json();

    if (validateJson.errors?.length > 0) {
      // ① ダイアログ表示
      alert(
        "CSVにエラーがあるためダウンロードできません。\n" +
        "内容を修正するか、別のCSVを選択してください。"
      );

      // ② ダウンロードさせない
      // ③ ボタンをロック
      setDownloadLocked(true);
      setResult(validateJson);

      return;
    }

    // エラーなし → ダウンロード
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
        <select
          value={target}
          onChange={(e) => setTarget(e.target.value)}
        >
          <option value="freee">freee</option>
          <option value="moneyforward">マネーフォワード</option>
        </select>

        <input
          type="file"
          accept=".csv"
          onChange={(e) => {
            setFile(e.target.files[0]);
            setResult(null);
            setDownloadLocked(false); // ★ CSV変更で解除
          }}
        />

        <button type="button" onClick={handlePreview}>
          プレビュー
        </button>

        <button
          type="button"
          onClick={handleDownload}
          disabled={downloadLocked}
        >
          CSVをダウンロード
        </button>
      </form>

      {result?.errors?.length > 0 && (
        <div style={{ color: "red", marginTop: 20 }}>
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
    </div>
  );
}
