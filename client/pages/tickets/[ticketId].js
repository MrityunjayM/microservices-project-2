import Router from "next/router";
import Link from "next/link";
import useRequest from "../../hooks/use-request";

const ShowTicket = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) => Router.push("/orders/[orderId]", `/orders/${order.id}`),
  });
  return (
    <div>
      <h2>title: {ticket.title}</h2>
      <h4>price: ${ticket.price}</h4>

      {ticket?.orderId && (
        <div>
          <Link href="/orders/[orderId]" as={`/orders/${ticket.orderId}`}>
            see order
          </Link>
        </div>
      )}

      {errors}
      <button className="button" onClick={doRequest}>
        order
      </button>
    </div>
  );
};

ShowTicket.getInitialProps = async (context, client) => {
  const { data } = await client.get(`/api/tickets/${context.query.ticketId}`);
  return { ticket: data };
};

export default ShowTicket;
