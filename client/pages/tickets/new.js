import { useRef } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";

const NewTicket = ({}) => {
  const titleRef = useRef("");
  const priceRef = useRef("");
  const { doRequest, errors } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: {
      title: titleRef.current.value,
      price: priceRef.current.value,
    },
    onSuccess: (ticket) => Router.push("/"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titleRef.current.value || !priceRef.current.value) {
      return;
    }

    await doRequest();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="title" className="label">
          Title
        </label>
        <div className="control">
          <input
            type="text"
            className="input"
            ref={titleRef}
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
            ref={priceRef}
            placeholder="Enter a price(in dollars), e.g. 35"
          />
        </div>
      </div>

      {errors}

      <button type="submit" className="button">
        submit
      </button>
    </form>
  );
};

export default NewTicket;
