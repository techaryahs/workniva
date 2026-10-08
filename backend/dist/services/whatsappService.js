"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWhatsApp = void 0;
const env_1 = require("../config/env");
const sendWhatsApp = async (to, templateName, parameters) => {
    if (!env_1.config.whatsapp.token || !env_1.config.whatsapp.phoneId) {
        console.log(`[MOCK WHATSAPP] To: ${to} | Template: ${templateName} | Params: `, parameters);
        return 'mock-wa-id-' + Date.now();
    }
    const response = await fetch(`https://graph.facebook.com/v17.0/${env_1.config.whatsapp.phoneId}/messages`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${env_1.config.whatsapp.token}`,
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
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to send WhatsApp message');
    }
    return data.messages?.[0]?.id || 'unknown-wa-id';
};
exports.sendWhatsApp = sendWhatsApp;
