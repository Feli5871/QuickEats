import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { MenuItem } from "@shared/schema";
import { PiDrone } from "react-icons/pi";
import DeliveryMap from "@/components/delivery-map";

// Make sure to call loadStripe outside of a component's render to avoid making the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface CartData {
  cart: (MenuItem & { quantity: number })[];
  restaurantId: number;
}

const formSchema = z.object({
  address: z.string().min(1, "Address is required"),
  droneDelivery: z.boolean(),
  lat: z.number(),
  lng: z.number(),
});

type FormData = z.infer<typeof formSchema>;

// Payment form with Stripe integration
const PaymentForm = ({ clientSecret, onPaymentSuccess }: { clientSecret: string, onPaymentSuccess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/confirmation`,
      },
      redirect: 'always'
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
    } else {
      // Payment is being processed or requires additional steps
      localStorage.setItem('pendingOrderData', JSON.stringify(orderData));
      // The page will be redirected by Stripe
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isLoading} 
        className="w-full"
        size="lg"
      >
        {isLoading ? "Processing..." : "Pay Now"}
      </Button>
    </form>
  );
};

export default function Checkout() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [orderData, setOrderData] = useState<FormData | null>(null);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        const restaurantIdFromLocalStorage = localStorage.getItem('restaurantId');
        
        if (parsedCart && parsedCart.length > 0 && restaurantIdFromLocalStorage) {
          setCartData({
            cart: parsedCart.map((item: any) => ({
              id: 0, // We'll use the name for identification
              name: item.item,
              price: item.price,
              quantity: item.quantity,
              restaurantId: parseInt(restaurantIdFromLocalStorage)
            })),
            restaurantId: parseInt(restaurantIdFromLocalStorage)
          });
        } else {
          navigate('/');
          toast({
            title: "No items in cart",
            description: "Please add items to your cart before checking out.",
            variant: "destructive",
          });
        }
      } catch (e) {
        console.error("Error parsing cart data", e);
        navigate('/');
        toast({
          title: "Error loading cart",
          description: "There was an error with your cart data.",
          variant: "destructive",
        });
      }
    } else {
      navigate('/');
      toast({
        title: "No items in cart",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      });
    }
  }, [navigate, toast]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      droneDelivery: false,
      lat: 40.6976, //  Union NJ coordinates. Default map location
      lng: -74.2632,
    },
  });

  const handleLocationSelect = (lat: number, lng: number) => {
    form.setValue('lat', lat);
    form.setValue('lng', lng);

    //  Geocode to get address
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      .then(res => res.json())
      .then(data => {
        if (data.display_name) {
          form.setValue('address', data.display_name);
        }
      });
  };

  const handleAddressChange = async (address: string) => {
    form.setValue('address', address);

    if (address.length > 3) {
      setIsAddressLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
        );
        const data = await response.json();

        if (data[0]) {
          form.setValue('lat', parseFloat(data[0].lat));
          form.setValue('lng', parseFloat(data[0].lon));
        }
      } catch (error) {
        console.error('Error geocoding address:', error);
      } finally {
        setIsAddressLoading(false);
      }
    }
  };

  const { mutate: placeOrder, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      if (!cartData) throw new Error("No cart data");

      const response = await apiRequest("POST", "/api/orders", {
        restaurantId: cartData.restaurantId,
        items: cartData.cart.map(item => ({ id: item.id, quantity: item.quantity })),
        totalAmount: cartData.cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        status: "pending",
        droneDelivery: data.droneDelivery,
        coordinates: { lat: data.lat, lng: data.lng },
      });
      return response.json();
    },
    onSuccess: (data) => {
      sessionStorage.removeItem('cartData');
      // Store order details for confirmation page
      sessionStorage.setItem('lastOrder', JSON.stringify({
        items: cartData.cart,
        totalAmount: data.totalAmount,
        orderId: data.id,
        timestamp: new Date().toLocaleString()
      }));
      
      toast({
        title: "Order placed successfully!",
        description: "Your order has been confirmed.",
      });
      navigate('/confirmation');
    },
    onError: (error) => {
      toast({
        title: "Failed to place order",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Initialize payment intent when needed
  const createPaymentIntent = async () => {
    if (!cartData) return;
    
    try {
      const amount = cartData.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });
      
      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error('Error creating payment intent:', error);
      toast({
        title: "Payment Error",
        description: "Could not initialize payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = (data: FormData) => {
    setOrderData(data);
    setShowPayment(true);
    createPaymentIntent();
  };

  const handlePaymentSuccess = () => {
    if (!orderData || !cartData) return;
    
    placeOrder(orderData);
    import('@/lib/cartUtils').then(cartUtils => {
      cartUtils.clearCart();
    });
  };

  if (!cartData) return null;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {cartData.cart.map((item, index) => (
                <div key={index} className="flex justify-between py-2">
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>
                    ${cartData.cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {showPayment && clientSecret ? (
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <PaymentForm 
                    clientSecret={clientSecret} 
                    onPaymentSuccess={handlePaymentSuccess} 
                  />
                </Elements>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Delivery Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delivery Address</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your delivery address" 
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                handleAddressChange(e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="h-[400px] rounded-lg overflow-hidden">
                      <DeliveryMap 
                        center={[form.watch('lat'), form.watch('lng')]}
                        onLocationSelect={handleLocationSelect}
                        interactive={true}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="droneDelivery"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel>Drone Delivery</FormLabel>
                            <div className="text-sm text-muted-foreground">
                              Get your order delivered faster by drone
                            </div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-primary"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg" 
                      disabled={isPending || isAddressLoading}
                    >
                      {isPending ? (
                        "Processing..."
                      ) : (
                        <>
                          Continue to Payment
                          {form.watch("droneDelivery") && <PiDrone className="ml-2" />}
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
