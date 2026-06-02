const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

const generateInvoice = async (order, user) => {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  let page = doc.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();

  // Header
  page.drawText('TAX INVOICE', { x: 50, y: height - 50, size: 24, font: fontBold, color: rgb(0.15, 0.39, 0.92) });
  page.drawText(process.env.SHOP_NAME || 'Shree Hira Computer & Communication', { x: 50, y: height - 80, size: 12, font: fontBold });
  page.drawText(process.env.SHOP_ADDRESS || 'Your Shop Address', { x: 50, y: height - 95, size: 10, font });
  page.drawText(`GSTIN: ${process.env.GSTIN || 'N/A'}`, { x: 50, y: height - 110, size: 10, font });

  // Invoice details
  page.drawText(`Invoice #: ${order.orderId}`, { x: 350, y: height - 50, size: 12, font: fontBold });
  page.drawText(`Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`, { x: 350, y: height - 65, size: 10, font });
  page.drawText(`Payment: ${order.paymentStatus.toUpperCase()}`, { x: 350, y: height - 80, size: 10, font });

  // Billing info
  page.drawText('Bill To:', { x: 50, y: height - 150, size: 12, font: fontBold });
  page.drawText(`Name: ${order.customerInfo?.name || user.name}`, { x: 50, y: height - 168, size: 10, font });
  page.drawText(`Email: ${order.customerInfo?.email || user.email}`, { x: 50, y: height - 183, size: 10, font });
  page.drawText(`Phone: ${order.customerInfo?.phone || user.phone}`, { x: 50, y: height - 198, size: 10, font });
  if (order.customerInfo?.gstin) {
    page.drawText(`GSTIN: ${order.customerInfo.gstin}`, { x: 50, y: height - 213, size: 10, font });
  }

  // Table header
  const tableTop = height - 260;
  page.drawRectangle({ x: 50, y: tableTop - 5, width: 495, height: 25, color: rgb(0.9, 0.93, 0.98) });
  page.drawText('#', { x: 55, y: tableTop, size: 10, font: fontBold });
  page.drawText('Product', { x: 80, y: tableTop, size: 10, font: fontBold });
  page.drawText('Qty', { x: 300, y: tableTop, size: 10, font: fontBold });
  page.drawText('Rate', { x: 345, y: tableTop, size: 10, font: fontBold });
  page.drawText('Amount', { x: 430, y: tableTop, size: 10, font: fontBold });

  // Table rows
  let yPos = tableTop - 25;
  order.items.forEach((item, index) => {
    page.drawText(String(index + 1), { x: 55, y: yPos, size: 10, font });
    page.drawText(item.productName, { x: 80, y: yPos, size: 10, font });
    page.drawText(String(item.quantity), { x: 300, y: yPos, size: 10, font });
    page.drawText(`Rs. ${item.unitPrice.toFixed(2)}`, { x: 345, y: yPos, size: 10, font });
    page.drawText(`Rs. ${item.totalPrice.toFixed(2)}`, { x: 430, y: yPos, size: 10, font });
    yPos -= 20;
  });

  // Totals
  yPos -= 15;
  page.drawLine({ start: { x: 50, y: yPos }, end: { x: 545, y: yPos }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
  yPos -= 20;
  page.drawText(`Subtotal: Rs. ${order.subtotal.toFixed(2)}`, { x: 400, y: yPos, size: 10, font });
  yPos -= 18;
  if (order.discount > 0) {
    page.drawText(`Discount: -Rs. ${order.discount.toFixed(2)}`, { x: 400, y: yPos, size: 10, font });
    yPos -= 18;
  }
  page.drawText(`Tax (${process.env.GST_PERCENTAGE || 18}%): Rs. ${order.tax.toFixed(2)}`, { x: 400, y: yPos, size: 10, font });
  yPos -= 18;
  page.drawText(`Total: Rs. ${order.amount.toFixed(2)}`, { x: 400, y: yPos, size: 12, font: fontBold, color: rgb(0.15, 0.39, 0.92) });

  // Footer
  page.drawText('Thank you for your business!', { x: 50, y: 80, size: 10, font, color: rgb(0.5, 0.5, 0.5) });
  page.drawText('This is a computer-generated invoice.', { x: 50, y: 65, size: 8, font, color: rgb(0.7, 0.7, 0.7) });

  return Buffer.from(await doc.save());
};

module.exports = { generateInvoice };
