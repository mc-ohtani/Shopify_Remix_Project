// app/services/shopify/fetchCustomers.js

export async function fetchCustomers(admin) {
  const response = await admin.graphql(`
    #graphql
    query {
      customers(first: 50) {
        edges {
          node {
            id
            displayName
            email
            phone
            createdAt
          }
        }
      }
    }
  `);

  const json = await response.json();

  return json.data.customers.edges.map((e) => e.node);
}
