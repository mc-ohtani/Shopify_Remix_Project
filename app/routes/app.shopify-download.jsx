import { json } from "@remix-run/node";
import { useFetcher } from "@remix-run/react"; // 追加
import { useEffect } from "react"; // 追加
import { authenticate } from "../shopify.server";
import { buildShopifyCsv } from "../services/shopify/buildShopifyCsv.js";

/**
 * CSV用エスケープ処理
 */
function escapeCsvValue(value) {
  if (value === null || value === undefined) return "";
  const stringValue = String(value);
  if (
    stringValue.includes(",") ||
    stringValue.includes("\n") ||
    stringValue.includes('"')
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

// --- バックエンド処理 (Action) ---
export async function action({ request }) {
  const { admin } = await authenticate.admin(request);

  const formData = await request.formData();
  const resource = formData.get("resource") || "orders"; // デフォルト値を設定
  const target = formData.get("target");

  if (!target) {
    return json({ error: "変換先(target)を指定してください" }, { status: 400 });
  }

  try {
    const { headers, rows } = await buildShopifyCsv(
      admin,
      resource,
      target
    );

    const headerLine = headers.map(escapeCsvValue).join(",");
    const dataLines = rows.map((row) =>
      headers.map((h) => escapeCsvValue(row[h])).join(",")
    );

    const BOM = "\uFEFF";
    const csv = BOM + headerLine + "\n" + dataLines.join("\n");

    return json({
      csv,
      filename: `${resource}-${target}.csv`,
    });
  } catch (error) {
    console.error("CSV Build Error:", error);
    return json({ error: error.message }, { status: 500 });
  }
}

// --- フロントエンド処理 (UI) ---
export default function ShopifyDownloadPage() {
  const fetcher = useFetcher();

  // ダウンロード処理の監視
  useEffect(() => {
    if (fetcher.data?.csv && fetcher.state === "idle") {
      const blob = new Blob([fetcher.data.csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fetcher.data.filename || "export.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [fetcher.data, fetcher.state]);

  const handleDownload = (targetType) => {
    const formData = new FormData();
    formData.append("resource", "orders");
    formData.append("target", targetType);
    
    // fetcher.submitを使うことでShopifyの認証（Session Token）が自動付与される
    fetcher.submit(formData, { method: "POST" });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Shopify 注文データ出力</h2>
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <button 
          onClick={() => handleDownload("freee")}
          disabled={fetcher.state !== "idle"}
        >
          {fetcher.state !== "idle" ? "作成中..." : "freee形式で出力"}
        </button>

        <button 
          onClick={() => handleDownload("moneyforward")}
          disabled={fetcher.state !== "idle"}
        >
          {fetcher.state !== "idle" ? "作成中..." : "マネーフォワード形式で出力"}
        </button>
      </div>

      {fetcher.data?.error && (
        <p style={{ color: "red", marginTop: "10px" }}>エラー: {fetcher.data.error}</p>
      )}
    </div>
  );
}