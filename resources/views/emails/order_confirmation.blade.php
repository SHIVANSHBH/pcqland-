<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #007bff; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
        .content { border: 1px solid #ddd; padding: 20px; border-radius: 0 0 5px 5px; }
        .order-section { margin: 20px 0; padding: 15px; background: #f8f9fa; border-left: 4px solid #007bff; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2 style="margin: 0;">Order Confirmation</h2>
            <p style="margin: 10px 0 0 0;">Order #{{ $order->order_no }}</p>
        </div>

        <div class="content">
            <p>Dear {{ $order->billing_json['name'] ?? 'Customer' }},</p>

            <p>Thank you for your order! We've received your payment and are processing your order.</p>

            <div class="order-section">
                <strong>Order Details:</strong>
                <p>Order Number: <strong>{{ $order->order_no }}</strong></p>
                <p>Order Date: <strong>{{ $order->created_at->format('d M Y H:i') }}</strong></p>
                <p>Total Amount: <strong>₹{{ number_format($order->total, 2) }}</strong></p>
            </div>

            <div class="order-section">
                <strong>Items Ordered:</strong>
                <ul>
                    @foreach($order->items as $item)
                        <li>{{ $item->product_name_snapshot }} (Qty: {{ $item->qty }}) - ₹{{ number_format($item->total, 2) }}</li>
                    @endforeach
                </ul>
            </div>

            <p>Your license keys will be delivered to this email shortly. You will also receive a WhatsApp message with your activation details.</p>

            <div class="footer">
                <p>If you have any questions, please contact us at support@pcqland.com</p>
                <p>&copy; {{ date('Y') }} PCQLand. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
