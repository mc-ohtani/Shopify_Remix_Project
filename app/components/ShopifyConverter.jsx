import { useFetcher } from "@remix-run/react";
import { useState, useEffect } from "react";

export default function ShopifyConverter() {
    const fetcher = useFetcher();

    const [resource, setResource] = useState("orders");
    const [target, setTarget] = useState("freee");

    const isLoading =
        fetcher.state === "submitting" || fetcher.state === "loading";

    const result = fetcher.data;
    const hasNoData = result && result.count === 0;
    const hasData = result && result.count > 0;

    /**
     * CSVダウンロード処理
     * actionから { csv, filename } が返ってきたら実行
     */
    useEffect(() => {
        if (fetcher.data?.csv) {
            const blob = new Blob([fetcher.data.csv], {
                type: "text/csv;charset=utf-8;",
            });

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fetcher.data.filename || "export.csv");
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
        }
    }, [fetcher.data]);

    return (
        <div>
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

                <label style={{ marginLeft: 12 }}>
                    <input
                        type="radio"
                        value="orders"
                        checked={resource === "orders"}
                        onChange={() => setResource("orders")}
                    />
                    注文
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

            {/* ダウンロード（fetcherのまま） */}
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
