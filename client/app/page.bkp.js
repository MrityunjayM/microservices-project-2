import TicketTile from "../components/ticket-tile";

const LandingView = ({ tickets }) => {
  const ticketsList = tickets.map((t) => <TicketTile ticket={t} />);

  return (
    <div className="is-flex is-flex-wrap-wrap" style={{ gap: "10px" }}>
      {ticketsList.length ? ticketsList : <p>No Tickets Available At The Moments.</p>}
    </div>
  );
};

LandingView.getInitialProps = async (context, client) => {
  const { data } = await client.get("/api/tickets");

  return { tickets: data };
};

export default LandingView;
