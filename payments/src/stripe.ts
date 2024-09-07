import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_KEY!, {
  apiVersion: "2024-04-10",
});

export async function cleanupPendingPayments() {
  const paymentIntents = await stripe.paymentIntents.list({
    limit: 5,
  });

  for (const payment_intent of paymentIntents.data) {
    if (payment_intent.status === "succeeded") continue;
    await stripe.paymentIntents.cancel(payment_intent.id);
  }
}
