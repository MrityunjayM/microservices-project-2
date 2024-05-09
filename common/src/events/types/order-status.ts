export enum OrderStatus {
  // when the order has been created but the ticket has not been reserved for the same
  Created = "created",
  // when ticket is already reserved or user cancelled the order
  Cancelled = "cancelled",
  // When the order has reseved the ticket succefully
  AwaitingPayment = "awaiting:payment",
  // When the order has reserved the ticket and user has made the payment succesfully
  Complete = "complete",
}
