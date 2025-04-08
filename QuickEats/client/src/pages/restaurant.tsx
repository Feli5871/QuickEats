import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import Layout from "@/components/layout";
import MenuItemCard from "@/components/menu-item-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { Restaurant, MenuItem } from "@shared/schema";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FiShoppingCart } from "react-icons/fi";
import { Badge } from "@/components/ui/badge";
import { GiHamburger, GiFullPizza, GiSushis, GiTacos, GiNoodles } from "react-icons/gi";

export default function RestaurantPage() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [cart, setCart] = useState<(MenuItem & { quantity: number })[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  
  // Mock data for featured restaurants with text-based logos
  const featuredRestaurants = [
    {
      name: "Burger Haven",
      image: "", // We'll use a text-based approach instead
    },
    {
      name: "Pizza Paradise",
      image: "",
    },
    {
      name: "Sushi Supreme",
      image: "",
    },
    {
      name: "Taco Time",
      image: "",
    },
    {
      name: "Pasta Palace",
      image: "",
    }
  ];

  const { data: restaurant, isLoading: isLoadingRestaurant } = useQuery<Restaurant>({
    queryKey: [`/api/restaurants/${id}`],
  });

  const { data: menuItems, isLoading: isLoadingMenu } = useQuery<MenuItem[]>({
    queryKey: [`/api/restaurants/${id}/menu`],
  });
  
  // Check if this restaurant is featured when data is loaded
  useEffect(() => {
    if (restaurant) {
      const featured = featuredRestaurants.find(
        fr => fr.name.toLowerCase() === restaurant.name.toLowerCase()
      );
      
      if (featured) {
        setIsFeatured(true);
      }
    }
  }, [restaurant]);

  const addToCart = (item: MenuItem) => {
    setCart(current => {
      const existing = current.find(i => i.id === item.id);
      if (existing) {
        return current.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...current, { ...item, quantity: 1 }];
    });

    // Use cartUtils to update the cart
    import('@/lib/cartUtils').then(cartUtils => {
      cartUtils.addToCart(item.name, item.price);
    });

    // Store restaurant ID in localStorage
    if (restaurant) {
      localStorage.setItem('restaurantId', restaurant.id.toString());
    }
    
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const handleCheckout = () => {
    if (!restaurant) return;
    // Use localStorage for cart persistence
    if (restaurant) {
      localStorage.setItem('restaurantId', restaurant.id.toString());
    }
    navigate("/checkout");
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (isLoadingRestaurant || isLoadingMenu) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-[200px] mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-[300px]" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (!restaurant || !menuItems) return null;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <h1 className="text-4xl font-bold mr-3">{restaurant.name}</h1>
            {isFeatured && (
              <Badge variant="outline" className="bg-primary/10 text-primary">
                Featured
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">{restaurant.description}</p>
          
          {/* Conditionally display the featured logo for better consistency with home page */}
          {isFeatured && (
            <div className="mt-4 mb-6 flex items-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full p-2 mr-4 flex items-center justify-center shadow-sm border">
                <div className="text-center">
                  <div className="text-4xl mb-1 text-primary">
                    {restaurant.name.toLowerCase().includes('burger') && <GiHamburger />}
                    {restaurant.name.toLowerCase().includes('pizza') && <GiFullPizza />}
                    {restaurant.name.toLowerCase().includes('sushi') && <GiSushis />}
                    {restaurant.name.toLowerCase().includes('taco') && <GiTacos />}
                    {restaurant.name.toLowerCase().includes('pasta') && <GiNoodles />}
                  </div>
                  <div className="font-bold text-primary text-sm">{restaurant.name}</div>
                </div>
              </div>
              <div>
                <p className="font-medium">Official Restaurant Logo</p>
                <p className="text-sm text-muted-foreground">Proud partner of QuickEats</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuItems.map((item) => (
            <MenuItemCard key={item.id} item={item} onAddToCart={addToCart} />
          ))}
        </div>

        {cart.length > 0 && (
          <Sheet>
            <SheetTrigger asChild>
              <Button className="fixed bottom-8 right-8 px-6" size="lg">
                <FiShoppingCart className="mr-2" />
                Cart ({cart.length}) - ${total.toFixed(2)}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Your Cart</SheetTitle>
              </SheetHeader>
              <div className="mt-8">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between py-4 border-b">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                <div className="mt-8">
                  <Button className="w-full" size="lg" onClick={handleCheckout}>
                    Checkout (${total.toFixed(2)})
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </Layout>
  );
}