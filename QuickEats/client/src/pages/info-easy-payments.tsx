import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { FiChevronLeft, FiCreditCard, FiLock, FiSmartphone, FiRepeat, FiGift } from "react-icons/fi";

export default function EasyPaymentsPage() {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-10 px-4">
        <Link href="/">
          <Button variant="ghost" className="mb-6 flex items-center gap-2">
            <FiChevronLeft /> Back to Home
          </Button>
        </Link>
        
        <div className="flex items-center gap-3 mb-8">
          <FiCreditCard className="text-4xl text-primary" />
          <h1 className="text-4xl font-bold">Easy Payments</h1>
        </div>
        
        <div className="grid md:grid-cols-2 gap-10 mb-10">
          <div>
            <img 
              src="https://cdn.vectorstock.com/i/500p/33/79/100-secure-grunge-badge-with-a-check-mark-label-vector-51493379.jpg" 
              alt="Easy and Secure Payments" 
              className="rounded-lg shadow-lg w-full h-auto object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Secure & Seamless Transactions</h2>
            <p className="text-lg text-muted-foreground mb-4">
              At QuickEats, we believe the payment process should be as enjoyable as the food itself. That's why we've designed
              our payment system to be secure, flexible, and incredibly easy to use.
            </p>
            <p className="text-lg text-muted-foreground">
              With state-of-the-art encryption and multiple payment options, you can order your favorite meals with confidence,
              knowing your financial information is protected while enjoying a hassle-free checkout experience.
            </p>
          </div>
        </div>
        
        <div className="bg-muted p-8 rounded-lg mb-10">
          <h2 className="text-2xl font-semibold mb-6">Payment Methods We Accept</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-lg shadow">
              <FiCreditCard className="text-4xl text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Credit & Debit Cards</h3>
              <p className="text-muted-foreground">
                We accept all major credit and debit cards, including Visa, Mastercard, American Express, and Discover.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow">
              <FiSmartphone className="text-4xl text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Digital Wallets</h3>
              <p className="text-muted-foreground">
                Pay with Apple Pay, Google Pay, or Samsung Pay for an even faster checkout experience.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow">
              <FiGift className="text-4xl text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Gift Cards & Promo Codes</h3>
              <p className="text-muted-foreground">
                Easily redeem QuickEats gift cards or apply promotional codes at checkout for instant savings.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-6">Benefits of Our Payment System</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border p-6 rounded-lg">
              <FiLock className="text-3xl text-primary mb-3" />
              <h3 className="text-xl font-semibold mb-2">Enhanced Security</h3>
              <p className="text-muted-foreground">
                Our payment processing uses 256-bit encryption and complies with PCI-DSS standards to ensure your payment information remains secure.
              </p>
            </div>
            <div className="border p-6 rounded-lg">
              <FiRepeat className="text-3xl text-primary mb-3" />
              <h3 className="text-xl font-semibold mb-2">One-Click Reordering</h3>
              <p className="text-muted-foreground">
                Save your payment details securely for faster checkout on future orders, making reordering your favorites a breeze.
              </p>
            </div>
            <div className="border p-6 rounded-lg">
              <svg className="w-8 h-8 text-primary mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 className="text-xl font-semibold mb-2">Split Payments</h3>
              <p className="text-muted-foreground">
                Easily split the bill with friends and family when ordering group meals, with each person paying their share directly.
              </p>
            </div>
            <div className="border p-6 rounded-lg">
              <svg className="w-8 h-8 text-primary mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
              <h3 className="text-xl font-semibold mb-2">Digital Receipts</h3>
              <p className="text-muted-foreground">
                Receive instant digital receipts via email for all your transactions, making expense tracking and reimbursements simple.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-primary/5 p-8 rounded-lg mb-10">
          <h2 className="text-2xl font-semibold mb-4">Payment FAQs</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold">Is my payment information secure?</h3>
              <p className="text-muted-foreground">
                Absolutely. We use bank-level encryption and never store your full credit card details on our servers. All payment processing is handled by secure, certified payment processors.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold">Can I save my payment methods for future orders?</h3>
              <p className="text-muted-foreground">
                Yes, you can securely save your preferred payment methods in your account for faster checkout on future orders. You can manage your saved payment methods at any time from your account settings.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold">What happens if I need a refund?</h3>
              <p className="text-muted-foreground">
                If there's an issue with your order, you can request a refund through our app or website. Approved refunds are processed back to the original payment method, typically within 3-5 business days.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold">Can I use multiple payment methods for a single order?</h3>
              <p className="text-muted-foreground">
                Yes, you can split your payment between a gift card and a credit card, or apply a promotional discount and pay the remaining balance with your preferred payment method.
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-6">Ready to Experience Hassle-Free Ordering?</h2>
          <Link href="/restaurants">
            <Button size="lg" className="font-semibold">
              Order Now With Secure Payment
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}