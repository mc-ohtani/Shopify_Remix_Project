import { useFetcher } from "react-router";
import { useEffect, useState } from "react";

export default function ShopifyConverter() {
  const fetcher = useFetcher();
  const [resource, setResource] = useState("customers");
  const [target, setTarget] = useState("freee");

  const isLoading =
    fetcher.state === "submitting" || fetcher.state === "loading";

  const result = fetcher.data;

  return (
    <s-section heading="Shopifyデータ変換">
      <s-paragraph>
        Shopifyのデータを取得して、freee / マネーフォワード用CSVに変換します。
      </s-paragraph>

      <div style={{ marginTop: 16 }}>
        <strong>取得対象</strong>
        <div>
          <label>
            <input
              type="radio"
              value="customers"
              checked={resource === "customers"}
              onChange={() => setResource("customers")}
            />
            顧客
          </label>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <strong>出力先</strong>
        <div>
          <label>
            <input
              type="radio"
              value="freee"
              checked={target === "freee"}
              onChange={() => setTarget("freee")}
            />
            freee
          </label>
          <label style={{ marginLeft: 16 }}>
            <input
              type="radio"
              value="moneyforward"
              checked={target === "moneyforward"}
              onChange={() => setTarget("moneyforward")}
            />
            マネーフォワード
          </label>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <fetcher.Form method="post" action="/app/shopify-fetch">
          <input type="hidden" name="resource" value={resource} />
          <input type="hidden" name="target" value={target} />

          <s-button loading={isLoading}>
            Shopifyから取得
          </s-button>
        </fetcher.Form>
      </div>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>プレビュー（{result.count}件）</h3>
          <pre>{JSON.stringify(result.preview, null, 2)}</pre>
        </div>
      )}
    </s-section>
  );
}
