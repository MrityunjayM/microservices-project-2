import Stripe from "stripe";

// export const stripe = new Stripe(process.env.STRIPE_KEY!, {
//   apiVersion: "2024-04-10",
// });

// console.log(process.env.STRIPE_KEY);

export const stripe = new Stripe(
  "sk_test_51PD8pYSFAbrYC1aBEYZAYS0BEETgHwK4JebWc4ZAi2XJ9ou4g01eVToDOBEXMG2jIYpD9lOSpvRSKP2BJhp2ItWD00zI1qHtOy",
  { apiVersion: "2024-04-10" }
);

async function cleanupPendingPayments() {
  const paymentIntents = await stripe.paymentIntents.list({
    limit: 5,
  });

  paymentIntents.data.forEach(({ id }) => {
    stripe.paymentIntents.cancel(id);
  });
}
