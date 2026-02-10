import { useState } from "react";

export default function ShopifyConverter() {
  const [resource, setResource] = useState("customers");
  const [target, setTarget] = useState("freee");

  return (
    <div>
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
                name="resource"
                value="customers"
                checked={resource === "customers"}
                onChange={() => setResource("customers")}
              />
              顧客
            </label>
            <label style={{ marginLeft: 16 }}>
              <input type="radio" disabled />
              商品（準備中）
            </label>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <strong>出力先</strong>
          <div>
            <label>
              <input
                type="radio"
                name="target"
                value="freee"
                checked={target === "freee"}
                onChange={() => setTarget("freee")}
              />
              freee
            </label>
            <label style={{ marginLeft: 16 }}>
              <input
                type="radio"
                name="target"
                value="moneyforward"
                checked={target === "moneyforward"}
                onChange={() => setTarget("moneyforward")}
              />
              マネーフォワード
            </label>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <s-button disabled>Shopifyから取得</s-button>
          <s-button disabled style={{ marginLeft: 8 }}>
            CSVをダウンロード
          </s-button>
        </div>

        <p style={{ color: "#666", marginTop: 8 }}>
          ※ 現在はUIのみ。次にShopify API連携を実装します。
        </p>
      </s-section>
    </div>
  );
}
