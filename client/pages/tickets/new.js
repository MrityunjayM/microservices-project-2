import { useRef, useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";

const NewTicket = ({}) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  const { doRequest, errors } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: {
      title: title,
      price: price,
    },
    onSuccess: (ticket) => Router.push("/"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !price) {
      return;
    }

    await doRequest();
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "640px" }}>
      <div className="field">
        <label htmlFor="title" className="label">
          Title
        </label>
        <div className="control">
          <input
            type="text"
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give a title, e.g: movie or concert"
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor="price" className="label">
          Price
        </label>
        <div className="control">
          <input
            type="number"
            className="input"
            value={price}
            onChange={(e) => setPrice(e.target.valueAsNumber)}
            placeholder="Enter a price(in dollars), e.g. 35"
          />
        </div>
      </div>

      {errors}

      <button type="submit" className="button is-info">
        submit
      </button>
    </form>
  );
};

export default NewTicket;
