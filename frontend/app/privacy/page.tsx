export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold text-pcd-text mb-6">Privacy Policy</h1>
      <div className="prose max-w-none space-y-4 text-pcd-muted">
        <p>At PC Deals India, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information.</p>
        
        <h3 className="text-lg font-bold text-pcd-text mt-6">Information We Collect</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Name, email address, phone number</li>
          <li>Shipping and billing address</li>
          <li>GSTIN (if provided)</li>
          <li>Payment information (processed securely via Razorpay)</li>
          <li>Order history and communication preferences</li>
        </ul>

        <h3 className="text-lg font-bold text-pcd-text mt-6">How We Use Your Information</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>To process and deliver your orders</li>
          <li>To send product keys via email and WhatsApp</li>
          <li>To generate GST invoices</li>
          <li>To provide customer support</li>
          <li>To improve our services</li>
        </ul>

        <h3 className="text-lg font-bold text-pcd-text mt-6">Data Protection</h3>
        <p>We implement appropriate security measures to protect your personal information. We do not store credit/debit card details. All payments are processed through Razorpay&apos;s secure payment gateway.</p>

        <h3 className="text-lg font-bold text-pcd-text mt-6">Contact</h3>
        <p>If you have any questions about this Privacy Policy, please contact us at info@pcdealsindia.com or call 97286-22667.</p>
      </div>
    </div>
  );
}
