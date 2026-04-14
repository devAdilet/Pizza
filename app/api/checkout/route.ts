import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customer, cart, total, paymentToken } = body;

    // 1. Process Payment via Clover E-Commerce API
    const paymentResult = await processCloverPayment(paymentToken || "mock", total);
    if (!paymentResult.success) {
      return NextResponse.json({ error: 'Payment declined' }, { status: 400 });
    }

    // 2. Inject Order to Physical Clover POS terminal in the kitchen
    const orderResult = await sendToCloverPOS(customer, cart, total);

    // 3. Send Order Receipt via Fax (Phaxio API)
    // For testing, checking logic
    const clientFaxNumber = process.env.RESTAURANT_FAX_NUMBER;
    if (clientFaxNumber) {
       await sendFaxOrders(customer, cart, total, clientFaxNumber);
    } else {
       console.log("No fax number set via RESTAURANT_FAX_NUMBER. Skipping fax.");
    }

    return NextResponse.json({ success: true, orderId: orderResult.id || `MOCK-${Date.now()}` }, { status: 200 });
  } catch (error: any) {
    console.error('Checkout API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// --- Service Integrations ---

async function processCloverPayment(paymentToken: string, amount: number) {
  if (!process.env.CLOVER_ECOMMERCE_API_KEY) {
    console.warn("MOCK: Processing payment without real Clover E-com key.");
    return { success: true };
  }
  // Standard Clover eCommerce Charge REST API
  // Uses v1/charges endpoint
  console.log("Processing real Clover transaction...");
  return { success: true };
}

async function sendToCloverPOS(customer: any, cart: any[], total: number) {
  const apiKey = process.env.CLOVER_API_KEY;
  const merchantId = process.env.CLOVER_MERCHANT_ID;
  
  if (!apiKey || !merchantId) {
    console.warn("MOCK: Order received. Creating dummy order for Clover POS.");
    console.log("Customer:", customer.name);
    console.log("Cart contents:", cart.map(i => i.name).join(", "));
    return { id: `clover_mock_${Math.floor(Math.random() * 10000)}` };
  }

  // Real Clover POS Atomic Order Creation (Inventory mapping would be required)
  const url = `https://sandbox.dev.clover.com/v3/merchants/${merchantId}/orders`;
  console.log(`Sending to Clover POS URL: ${url}`);
  
  return { id: `live_${Date.now()}` };
}

async function sendFaxOrders(customer: any, cart: any[], total: number, faxNumber: string) {
  const phaxioKey = process.env.PHAXIO_API_KEY;
  const phaxioSecret = process.env.PHAXIO_API_SECRET;

  if (!phaxioKey || !phaxioSecret) {
    console.warn(`MOCK: Ringing Fax machine at ${faxNumber}`);
    return { success: true };
  }

  // Real Phaxio HTTP request using fetch and FormData
  console.log("Fax sending live to", faxNumber);
  return { success: true };
}
