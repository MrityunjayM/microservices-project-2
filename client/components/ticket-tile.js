import Link from "next/link";

const TicketTile = ({ ticket }) => {
  return (
    <div className="box" style={{ maxWidth: "640px" }}>
      <article className="media">
        <div className="media-left">
          <figure className="image is-64x64">
            <img src={"/images/ticket-icon.webp"} alt="ticket" />
          </figure>
        </div>
        <div className="media-content">
          <div className="content">
            <span>
              <strong>{ticket.title}</strong>&#160; <small>&#8377;{ticket.price}</small>
            </span>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean efficitur sit amet massa fringilla egestas.
              Nullam condimentum luctus turpis.
            </p>
          </div>
          <nav className="level is-mobile">
            <div className="level-left">
              <Link href={"/tickets/[ticketId]"} as={`/tickets/${ticket.id}`}>
                View
              </Link>
            </div>
          </nav>
        </div>
      </article>
    </div>
  );
};

export default TicketTile;
