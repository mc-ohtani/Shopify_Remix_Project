export async function fetchOrders(admin) {
  const response = await admin.graphql(
    `#graphql
    query {
      orders(first: 50) {
        edges {
          node {
            id
            name
            createdAt
            totalPriceSet {
              shopMoney {
                amount
              }
            }
            customer {
              firstName
              lastName
              email
            }
          }
        }
      }
    }`
  );

  const json = await response.json();

  return json.data.orders.edges.map(e => e.node);
}
