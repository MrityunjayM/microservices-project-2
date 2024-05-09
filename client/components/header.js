import Link from "next/link";
import { useState } from "react";

export default ({ currentUser }) => {
  const [isNavActive, setIsNavActive] = useState(false);

  const navToggler = () => setIsNavActive((ps) => !ps); // ps - previous state

  const links = [
    !currentUser && { label: "Sign Up", href: "/auth/signup" },
    !currentUser && { label: "Sign In", href: "/auth/signin" },
    currentUser && { label: "Create Ticket", href: "/tickets/new" },
    currentUser && { label: "Orders", href: "/orders" },
    currentUser && { label: "About", href: "/about" },
    currentUser && { label: "Sign Out", href: "/auth/signout" },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => (
      <Link key={href} className="navbar-item" href={href}>
        {label}
      </Link>
    ));

  return (
    <nav className="navbar is-info">
      <div className="container">
        <div className="navbar-brand">
          <Link href="/" className="navbar-item">
            Microservices
          </Link>

          <button
            className={`navbar-burger ${isNavActive ? "is-active" : ""}`}
            aria-label="menu"
            aria-expanded="false"
            data-target="navMenu"
            onClick={navToggler}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
        <div
          id="navMenu"
          className={`navbar-menu ${isNavActive ? "is-active" : ""}`}
        >
          <div className="navbar-end">{links}</div>
        </div>
      </div>
    </nav>
  );
};
