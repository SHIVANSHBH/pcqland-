<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #28a745; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
        .content { border: 1px solid #ddd; padding: 20px; border-radius: 0 0 5px 5px; }
        .key-section { margin: 20px 0; padding: 15px; background: #f8f9fa; border-left: 4px solid #28a745; }
        .key-box { background: white; border: 1px solid #ddd; padding: 10px; margin: 5px 0; font-family: monospace; word-break: break-all; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2 style="margin: 0;">Your License Keys</h2>
            <p style="margin: 10px 0 0 0;">Order #{{ $order->order_no }}</p>
        </div>

        <div class="content">
            <p>Dear {{ $order->billing_json['name'] ?? 'Customer' }},</p>

            <p>Your order has been processed and your license keys are ready for activation!</p>

            <div class="key-section">
                <strong>Your License Keys:</strong>
                @foreach($keys as $key)
                    <div style="margin: 10px 0;">
                        <p><strong>{{ $key['product'] }}:</strong></p>
                        <div class="key-box">{{ $key['key'] }}</div>
                    </div>
                @endforeach
            </div>

            <p><strong>How to Activate:</strong></p>
            <ol>
                <li>Copy the license key above</li>
                <li>Open your software application</li>
                <li>Go to Activate or Registration menu</li>
                <li>Paste the key and follow the prompts</li>
            </ol>

            <div class="key-section">
                <strong>Support:</strong>
                <p>If you have any issues activating your keys, please contact us:</p>
                <p>Email: support@pcqland.com<br>WhatsApp: +91-XXXXXXXXXX</p>
            </div>

            <div class="footer">
                <p>&copy; {{ date('Y') }} PCQLand. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
