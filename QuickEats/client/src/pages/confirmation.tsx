import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import Layout from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiCheck, FiPrinter, FiClock } from "react-icons/fi";
import type { CartItem } from "@/lib/cartUtils";
import { useToast } from "@/hooks/use-toast";

interface OrderDetails {
  items: CartItem[];
  totalAmount: number;
  orderId: string;
  timestamp: string;
  estimatedTime: number;
}

export default function ConfirmationPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    // Check localStorage for cart data
    const cart = localStorage.getItem('cart');
    if (cart) {
      try {
        const cartItems = JSON.parse(cart);
        const totalAmount = cartItems.reduce((sum: number, item: CartItem) => 
          sum + (item.price * item.quantity), 0);

        // Generate order details
        const randomOrderId = Math.floor(100000 + Math.random() * 900000).toString();
        const estimatedMinutes = Math.floor(25 + Math.random() * 20);

        setOrderDetails({
          items: cartItems,
          totalAmount: totalAmount,
          orderId: randomOrderId,
          timestamp: new Date().toLocaleString(),
          estimatedTime: estimatedMinutes
        });

        // Clear cart after order is complete
        localStorage.removeItem('cart');
        localStorage.removeItem('pendingOrderData');
        localStorage.removeItem('amazonPayOrder');

        toast({
          title: "Order Confirmed",
          description: "Thank you for your order! We'll start preparing it right away.",
        });
      } catch (error) {
        console.error('Error processing order:', error);
        toast({
          title: "Error",
          description: "There was a problem processing your order.",
          variant: "destructive",
        });
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate, toast]);

  if (!orderDetails) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <FiCheck className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold">Thank You for Your Order!</h1>
          <p className="text-muted-foreground mt-2">We're excited to serve you today.</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <p className="text-sm font-medium">Order #{orderDetails.orderId}</p>
                <p className="text-sm text-muted-foreground">{orderDetails.timestamp}</p>
                <div className="flex items-center gap-2 mt-2 text-sm text-blue-600">
                  <FiClock />
                  <span>Estimated delivery time: {orderDetails.estimatedTime} minutes</span>
                </div>
              </div>

              {orderDetails.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex-1 flex items-center gap-4">
                    <span className="text-base font-semibold">{item.name}</span>
                    <span className="text-sm text-muted-foreground">
                      ({item.quantity} × ${item.price.toFixed(2)})
                    </span>
                  </div>
                  <div className="font-medium text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}

              <div className="border-t pt-4">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${orderDetails.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button onClick={handlePrint} variant="outline" className="flex items-center gap-2">
            <FiPrinter /> Print Receipt
          </Button>
        </div>
      </div>
    </Layout>
  );
}
