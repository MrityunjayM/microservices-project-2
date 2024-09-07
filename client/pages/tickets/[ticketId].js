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
    <section className="section">
      <h1 className="title">{ticket.title}</h1>
      <p className="subtitle">&#8377;{ticket.price}</p>

      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium vel itaque qui iste et fugiat consequatur nisi
        animi rerum maiores error eveniet eligendi ipsa adipisci doloremque praesentium, necessitatibus modi iusto.
      </p>

      <div className="mt-3">
        {ticket.orderId ? (
          <Link href="/orders/[orderId]" as={`/orders/${ticket.orderId}`} className="button is-link">
            See Order Details
          </Link>
        ) : (
          <button className="button is-info" onClick={doRequest}>
            Make Order
          </button>
        )}
      </div>

      {errors}
    </section>
  );
};

ShowTicket.getInitialProps = async (context, client) => {
  const { data } = await client.get(`/api/tickets/${context.query.ticketId}`);
  return { ticket: data };
};

export default ShowTicket;
