import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../../components/checkout-form";

const stripe = loadStripe(
  "pk_test_51PD8pYSFAbrYC1aBRRPmwi7ArI8cG87273vRRmZyxg2Z1gW3TRplZEEUAdyOfmhWB1DSdUshAlH1aVD0zCOgOyDw00ZzwANqIq"
);

const ShowOrder = ({ order, paymentInfo, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const updateTimeLeft = () => {
      const remainingTime = (new Date(order.expiresAt) - new Date()) / 1000;

      if (remainingTime < 0) {
        clearInterval(intervalId);
        return;
      }

      setTimeLeft(Math.round(remainingTime));
    };

    const intervalId = setInterval(updateTimeLeft, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div>
      <h2>title: {order.ticket.title}</h2>
      <h4>price: {order.ticket.price}</h4>
      <h4>status: {order.status}</h4>
      <h4>
        expires in: <em>{timeLeft} seconds</em>
      </h4>

      <Elements
        stripe={stripe}
        options={{
          appearance: { theme: "stripe" },
          clientSecret: paymentInfo.clientSecret,
        }}
      >
        <CheckoutForm classes="mt-5" currentUser={currentUser} payload={{ orderId: order.id }} />
      </Elements>
    </div>
  );
};

ShowOrder.getInitialProps = async (context, client) => {
  const { data } = await client.get(`/api/orders/${context.query.orderId}`);
  const { data: paymentInfo } = await client.post("/api/payments", {
    orderId: context.query.orderId,
  });

  return { order: data, paymentInfo };
};

export default ShowOrder;
