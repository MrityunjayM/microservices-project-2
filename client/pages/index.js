import Link from "next/link";

const LandingView = ({ tickets }) => {
  const ticketsList = tickets.map((t) => (
    <tr key={t.id}>
      <td colSpan={2}>{t.title}</td>
      <td>{t.price}</td>
      <td>
        <Link href="/tickets/[ticketId]" as={`/tickets/${t.id}`}>
          view
        </Link>
      </td>
    </tr>
  ));

  return (
    <table className="table">
      <thead>
        <tr>
          <th colSpan={2}>Title</th>
          <th>Price</th>
          <th>Link</th>
        </tr>
      </thead>
      <tbody>{ticketsList}</tbody>
    </table>
  );
};

LandingView.getInitialProps = async (context, client) => {
  console.log("LANDING PAGE!");
  const { data } = await client.get("/api/tickets");

  return { tickets: data };
};

export default LandingView;
