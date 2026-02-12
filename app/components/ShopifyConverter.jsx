import { useFetcher } from "react-router";
import { useState } from "react";

export default function ShopifyConverter() {
  const fetcher = useFetcher();
  const [resource, setResource] = useState("customers");
  const [target, setTarget] = useState("freee");

  const isLoading =
    fetcher.state === "submitting" || fetcher.state === "loading";

  const result = fetcher.data;
  const hasNoData = result && result.count === 0;
  const hasData = result && result.count > 0;

  return (
    <div>
      <div>
        <strong>取得対象</strong>
        <label>
          <input
            type="radio"
            checked={resource === "customers"}
            onChange={() => setResource("customers")}
          />
          顧客
        </label>
      </div>

      <div style={{ marginTop: 8 }}>
        <strong>出力先</strong>
        <label>
          <input
            type="radio"
            checked={target === "freee"}
            onChange={() => setTarget("freee")}
          />
          freee
        </label>
        <label style={{ marginLeft: 12 }}>
          <input
            type="radio"
            checked={target === "moneyforward"}
            onChange={() => setTarget("moneyforward")}
          />
          マネーフォワード
        </label>
      </div>

      {/* プレビュー */}
      <fetcher.Form method="post" action="/app/shopify-preview">
        <input type="hidden" name="resource" value={resource} />
        <input type="hidden" name="target" value={target} />
        <button type="submit" disabled={isLoading}>
          プレビュー
        </button>
      </fetcher.Form>

      {/* ダウンロード */}
      <fetcher.Form method="post" action="/app/shopify-download">
        <input type="hidden" name="resource" value={resource} />
        <input type="hidden" name="target" value={target} />
        <button
          type="submit"
          disabled={isLoading || hasNoData}
        >
          CSVダウンロード
        </button>
      </fetcher.Form>

      {/* 結果表示 */}
      {hasNoData && (
        <div style={{ marginTop: 20, color: "gray" }}>
          Shopifyに該当データがありません。
        </div>
      )}

      {hasData && (
        <div style={{ marginTop: 20 }}>
          <h3>プレビュー（{result.count}件）</h3>
          <pre>{JSON.stringify(result.preview, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
