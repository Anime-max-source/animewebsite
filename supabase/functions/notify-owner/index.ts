// Supabase Edge Function: notify-owner
// Triggered on new order insert into public.orders table via Database Webhook or invoked from frontend

/// <reference path="../deno.d.ts" />

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OrderPayload {
  record: {
    id: string
    buyer_name: string
    buyer_phone: string
    buyer_whatsapp: string
    buyer_address: string
    total_amount: number
    items: Array<{ name: string; qty: number; price: number }>
    created_at: string
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload: OrderPayload = await req.json()
    const order = payload.record || payload

    console.log(`[Order Alert] New order received: #${order.id} from ${order.buyer_name} for ₹${order.total_amount}`)

    const ownerPhone = Deno.env.get('OWNER_WHATSAPP_NUMBER') || '+919876543210'
    const message = `🔔 *New AnimeMax Order Alert!*\n\n` +
      `*Order ID:* ${order.id.slice(0, 8)}...\n` +
      `*Buyer:* ${order.buyer_name}\n` +
      `*Phone/WhatsApp:* ${order.buyer_whatsapp}\n` +
      `*Total:* ₹${order.total_amount}\n` +
      `*Items:* ${order.items?.map(i => `${i.name} (x${i.qty})`).join(', ') || 'N/A'}\n` +
      `*Address:* ${order.buyer_address}\n\n` +
      `👉 Open admin panel to send UPI QR code: https://animemax.store/admin/orders`

    // If Twilio or WhatsApp Business API credentials are configured:
    const twilioSid = Deno.env.get('TWILIO_ACCOUNT_SID')
    const twilioToken = Deno.env.get('TWILIO_AUTH_TOKEN')
    const twilioFrom = Deno.env.get('TWILIO_WHATSAPP_FROM')

    if (twilioSid && twilioToken && twilioFrom) {
      const url = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`
      const body = new URLSearchParams()
      body.append('From', `whatsapp:${twilioFrom}`)
      body.append('To', `whatsapp:${ownerPhone}`)
      body.append('Body', message)

      await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${twilioSid}:${twilioToken}`),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      })
    }

    return new Response(JSON.stringify({ success: true, message: 'Notification processed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
