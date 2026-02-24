// Related: https://github.com/remix-run/remix/issues/2835#issuecomment-1144102176
if (
  process.env.HOST &&
  (!process.env.SHOPIFY_APP_URL ||
    process.env.SHOPIFY_APP_URL === process.env.HOST)
) {
  process.env.SHOPIFY_APP_URL = process.env.HOST;
  delete process.env.HOST;
}

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  appDirectory: "app",
  // 💡 ESM形式に変更して、最新のJavaScript構文を扱えるようにします
  serverModuleFormat: "esm",
  dev: { port: process.env.HMR_SERVER_PORT || 8002 },
  // 💡 Shopifyのライブラリが依存するモジュールを適切にビルド対象に含めます
  serverDependenciesToBundle: "all",
  future: {
    v3_fetcherPersist: true,
    v3_relativeSplatPath: true,
    v3_throwAbortReason: true,
    v3_singleFetch: true,
    v3_lazyRouteDiscovery: true,
  },
};