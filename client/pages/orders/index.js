const OrdersList = ({ orders }) => {
  const orderRows = orders.map((o) => (
    <tr key={o.id}>
      <td>{o.ticket.title}</td>
      <td>{o.ticket.price}</td>
      <td>{o.status}</td>
      <td>{new Date(o.expiresAt).toLocaleString("en-IN")}</td>
    </tr>
  ));

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Price</th>
          <th>Status</th>
          <th>ExpiresAt</th>
        </tr>
      </thead>
      <tbody>{orderRows}</tbody>
    </table>
  );
};

OrdersList.getInitialProps = async (ctx, client) => {
  const { data } = await client.get("/api/orders");

  return { orders: data };
};

export default OrdersList;
