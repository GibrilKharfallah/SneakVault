export async function processPaymentMock(payment) {
  console.log('Traitement du paiement', payment.id);
  await new Promise((resolve) => setTimeout(resolve, 200));
  return { success: true, transactionId: 'TX-' + payment.id };
}
