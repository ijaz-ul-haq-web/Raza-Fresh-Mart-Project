// Naye order par Hassan ko WhatsApp message. Fail ho to order phir bhi save rehta hai.
export async function notifyOwner(text) {
  try {
    if (process.env.CALLMEBOT_APIKEY) {
      const url =
        'https://api.callmebot.com/whatsapp.php?phone=' + process.env.OWNER_PHONE +
        '&text=' + encodeURIComponent(text) + '&apikey=' + process.env.CALLMEBOT_APIKEY;
      await fetch(url);
    } else if (process.env.WA_TOKEN && process.env.WA_PHONE_ID) {
      await fetch('https://graph.facebook.com/v20.0/' + process.env.WA_PHONE_ID + '/messages', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + process.env.WA_TOKEN, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: process.env.OWNER_PHONE,
          type: 'text',
          text: { body: text },
        }),
      });
    }
  } catch (e) {
    console.error('WhatsApp error:', e.message);
  }
}
