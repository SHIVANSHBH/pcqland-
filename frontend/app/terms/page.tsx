export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold text-pcd-text mb-6">Terms & Conditions</h1>
      <div className="prose max-w-none space-y-4 text-pcd-muted">
        <h3 className="text-lg font-bold text-pcd-text mt-6">1. Acceptance of Terms</h3>
        <p>By using the PC Deals India website and services, you agree to these terms and conditions. If you do not agree, please do not use our services.</p>

        <h3 className="text-lg font-bold text-pcd-text mt-6">2. Products & Services</h3>
        <p>We sell digital license keys for software products. These are digital goods delivered electronically via email and WhatsApp. No physical products are shipped.</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>All keys are 100% genuine and sourced from authorized distributors</li>
          <li>Keys are delivered instantly upon successful payment</li>
          <li>GST invoice is provided for all orders</li>
          <li>No refunds after the key has been delivered, unless the key is defective</li>
        </ul>

        <h3 className="text-lg font-bold text-pcd-text mt-6">3. Pricing</h3>
        <p>All prices are in Indian Rupees (INR) and include GST. We reserve the right to change prices at any time without prior notice.</p>

        <h3 className="text-lg font-bold text-pcd-text mt-6">4. Payment</h3>
        <p>Payments are processed through Razorpay payment gateway. We accept UPI, Credit/Debit Cards, Net Banking, and Wallets.</p>

        <h3 className="text-lg font-bold text-pcd-text mt-6">5. Refund Policy</h3>
        <p>Due to the digital nature of our products, refunds are not provided after the key has been delivered. If you receive a defective or non-working key, contact us within 48 hours for a replacement.</p>

        <h3 className="text-lg font-bold text-pcd-text mt-6">6. Limitation of Liability</h3>
        <p>PC Deals India shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services.</p>

        <h3 className="text-lg font-bold text-pcd-text mt-6">7. Contact</h3>
        <p>For any questions or concerns, contact us at info@pcdealsindia.com or call 97286-22667.</p>
      </div>
    </div>
  );
}
