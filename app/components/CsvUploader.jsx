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
    if (!file) {
      alert("CSVファイルを選択してください");
      return;
    }

    // 1. 新しいリクエストの前に、前回の結果（プレビューとエラー）をリセット
    setResult(null);
    setDownloadLocked(false);

    try {
      const res = await fetch("/api/csv/preview", {
        method: "POST",
        body: buildFormData(),
      });

      const json = await res.json();

      // 2. 結果をセット
      setResult(json);

      // 3. エラーがある場合の処理
      if (json.errors && json.errors.length > 0) {
        setDownloadLocked(true);
        // エラーがある時は、プレビューデータが入っていたとしてもクリアする
        setResult(prev => ({ ...prev, preview: null }));
      }
    } catch (error) {
      alert("プレビューの取得に失敗しました");
    }
  }

  async function handleDownload() {
    if (!file) {
      alert("CSVファイルを選択してください");
      return;
    }

    try {
      const checkRes = await fetch("/api/csv/preview", {
        method: "POST",
        body: buildFormData(),
      });
      const checkJson = await checkRes.json();

      // 不備が見つかった場合
      if (checkJson.errors && checkJson.errors.length > 0) {
        setResult({
          ...checkJson,
          preview: null
        });

        setDownloadLocked(true);

        setTimeout(() => {
          alert("項目に不備があるためダウンロードできません。エラー内容を確認してください。");
        }, 100);

        return;
      }

      // --- 以下、不備がない場合のダウンロード処理 ---
      const res = await fetch("/api/csv/download", {
        method: "POST",
        body: buildFormData(),
      });

      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${target}.csv`;
      a.click();
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error(error);
      alert("通信エラーが発生しました。");
    }
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

      <div style={{ marginTop: 8, display: 'flex', gap: '8px' }}>
        <button type="button" onClick={handlePreview}>
          プレビュー
        </button>

        <button
          type="button"
          onClick={handleDownload}
          // downloadLocked が true になった時だけグレーアウト
          disabled={downloadLocked}
          style={{
            cursor: downloadLocked ? 'not-allowed' : 'pointer',
            opacity: downloadLocked ? 0.5 : 1,
            backgroundColor: downloadLocked ? '#ebebeb' : '' // グレー背景を強調
          }}
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
