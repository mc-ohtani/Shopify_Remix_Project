import { useEffect } from "react";
import { useFetcher, Link } from "@remix-run/react"; // ここを react-router から @remix-run/react に修正
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  InlineStack,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import CsvUploader from "../components/CsvUploader";
import ShopifyConverter from "../components/ShopifyConverter";

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return null;
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];
  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($product: ProductCreateInput!) {
        productCreate(product: $product) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`,
    {
      variables: {
        product: {
          title: `${color} Snowboard`,
        },
      },
    },
  );
  const responseJson = await response.json();
  const product = responseJson.data.productCreate.product;
  const variantId = product.variants.edges[0].node.id;
  const variantResponse = await admin.graphql(
    `#graphql
    mutation shopifyRemixTemplateUpdateVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        productVariants {
          id
          price
          barcode
          createdAt
        }
      }
    }`,
    {
      variables: {
        productId: product.id,
        variants: [{ id: variantId, price: "100.00" }],
      },
    },
  );
  const variantResponseJson = await variantResponse.json();

  return {
    product: responseJson.data.productCreate.product,
    variant: variantResponseJson.data.productVariantsBulkUpdate.productVariants,
  };
};

export default function Index() {
  const fetcher = useFetcher();
  const shopify = useAppBridge();
  const isLoading =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";
  const productId = fetcher.data?.product?.id.replace(
    "gid://shopify/Product/",
    "",
  );

  useEffect(() => {
    if (productId) {
      shopify.toast.show("Product created");
    }
  }, [productId, shopify]);
  const generateProduct = () => fetcher.submit({}, { method: "POST" });

return (
    <Page title="注文データ変換アプリ">
      <TitleBar title="Remix app template">
        <button variant="primary" onClick={generateProduct}>
          Generate a product
        </button>
      </TitleBar>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <BlockStack gap="500">
              {/* セクション1: アプリの説明 */}
              <Card>
                <BlockStack gap="500">
                  <BlockStack gap="200">
                    <Text as="h2" variant="headingMd">
                      csvデータを指定形式に変換するアプリ
                    </Text>
                    <Text variant="bodyMd" as="p">
                      ・csvデータを指定して指定形式に変換する
                    </Text>
                    <Text variant="bodyMd" as="p">
                      ・Shopifyデータを指定形式に変換する
                    </Text>
                  </BlockStack>

                </BlockStack>
              </Card>

              {/* セクション2: 指定CSVの変換機能 */}
              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    指定CSVの変換機能
                  </Text>
                  <Box padding="400" background="bg-surface-secondary" borderRadius="200">
                    <CsvUploader />
                  </Box>
                </BlockStack>
              </Card>

              {/* セクション3: Shopifyデータの変換機能 */}
              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    Shopifyデータの変換機能
                  </Text>
                  <Box padding="400" background="bg-surface-secondary" borderRadius="200">
                    <ShopifyConverter />
                  </Box>
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
