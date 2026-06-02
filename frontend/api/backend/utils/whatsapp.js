const axios = require('axios');

const sendWhatsAppMessage = async ({ phone, message, templateName, parameters }) => {
  try {
    const url = `${process.env.WHATSAPP_API_URL}/msg`;
    const payload = {
      channel: 'whatsapp',
      source: process.env.WHATSAPP_PHONE_NUMBER,
      destination: phone,
      message: {
        type: 'text',
        text: message,
      },
    };
    if (templateName && parameters) {
      payload.message = {
        type: 'template',
        template: {
          id: templateName,
          params: parameters,
        },
      };
    }
    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.WHATSAPP_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error('WhatsApp send error:', error.response?.data || error.message);
    return { error: error.message };
  }
};

const sendKeyWhatsApp = async ({ phone, customerName, productName, key, orderId }) => {
  const message = `Hi ${customerName},\n\nYour product key for ${productName} is ready!\n\nKey: ${key}\nOrder ID: ${orderId}\n\nThank you for choosing PC Deals India!`;
  return sendWhatsAppMessage({ phone, message });
};

module.exports = { sendWhatsAppMessage, sendKeyWhatsApp };
