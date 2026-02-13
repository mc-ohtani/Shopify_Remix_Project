import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const formData = await request.formData();
  const resource = formData.get("resource");

  if (resource !== "customers") {
    return Response.json(
      { error: "unsupported resource" },
      { status: 400 }
    );
  }

  // Shopify 顧客取得
  const response = await admin.graphql(`
    query {
      customers(first: 50) {
        edges {
          node {
            id
            firstName
            lastName
            email
            phone
            createdAt
          }
        }
      }
    }
  `);

  const json = await response.json();

  const customers = json.data.customers.edges.map((e) => e.node);

  return Response.json({
    count: customers.length,
    preview: customers.slice(0, 5),
    raw: customers,
  });
};
