import Link from "next/link";

const LandingView = ({ tickets }) => {
  const ticketsList = tickets.map((t) => (
    <tr key={t.id}>
      <td>{t.title}</td>
      <td>{t.price}</td>
      <td>
        <Link href="/tickets/[ticketId]" as={`/tickets/${t.id}`}>
          view
        </Link>
      </td>
    </tr>
  ));

  return (
    <>
      <Link href="/tickets/new">new ticket</Link>

      <table className="table m-auto">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketsList}</tbody>
      </table>
    </>
  );
};

LandingView.getInitialProps = async (context, client) => {
  console.log("LANDING PAGE!");
  const { data } = await client.get("/api/tickets");

  return { tickets: data };
};

export default LandingView;
