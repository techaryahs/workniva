import { config } from '../config/env';

export const sendWhatsApp = async (to: string, templateName: string, parameters: any[]): Promise<string> => {
  if (!config.whatsapp.token || !config.whatsapp.phoneId) {
    console.log(`[MOCK WHATSAPP] To: ${to} | Template: ${templateName} | Params: `, parameters);
    return 'mock-wa-id-' + Date.now();
  }

  const response = await fetch(
    `https://graph.facebook.com/v17.0/${config.whatsapp.phoneId}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.whatsapp.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'template',
        template: {
          name: templateName,
          language: { code: 'en' },
          components: [
            {
              type: 'body',
              parameters,
            },
          ],
        },
      }),
    }
  );

  const data: any = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to send WhatsApp message');
  }

  return data.messages?.[0]?.id || 'unknown-wa-id';
};
