import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { PiDrone } from "react-icons/pi";
import { FiChevronLeft } from "react-icons/fi";

export default function DroneDeliveryPage() {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-10 px-4">
        <Link href="/">
          <Button variant="ghost" className="mb-6 flex items-center gap-2">
            <FiChevronLeft /> Back to Home
          </Button>
        </Link>
        
        <div className="flex items-center gap-3 mb-8">
          <PiDrone className="text-4xl text-primary" />
          <h1 className="text-4xl font-bold">Drone Delivery</h1>
        </div>
        
        <div className="grid md:grid-cols-2 gap-10 mb-10">
          <div>
            <img 
              src="https://modernrestaurantmanagement.com/assets/media/2020/07/Getty_526233045-1200x655.jpg" 
              alt="Drone Delivery" 
              className="rounded-lg shadow-lg w-full h-auto object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Revolutionizing Food Delivery</h2>
            <p className="text-lg text-muted-foreground mb-4">
              QuickEats is proud to be at the forefront of food delivery innovation with our cutting-edge drone delivery service. 
              We're changing the way food is delivered, making it faster, more efficient, and environmentally friendly.
            </p>
            <p className="text-lg text-muted-foreground">
              Our drone delivery service eliminates traffic concerns, reduces carbon emissions, and ensures your food arrives hot and fresh, 
              exactly as the chef intended.
            </p>
          </div>
        </div>
        
        <div className="bg-muted p-8 rounded-lg mb-10">
          <h2 className="text-2xl font-semibold mb-6">How Drone Delivery Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-lg shadow">
              <div className="text-3xl text-primary font-bold mb-4">01</div>
              <h3 className="text-xl font-semibold mb-2">Place Your Order</h3>
              <p className="text-muted-foreground">
                Browse our restaurant partners and select your favorite items. Choose "Drone Delivery" at checkout.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow">
              <div className="text-3xl text-primary font-bold mb-4">02</div>
              <h3 className="text-xl font-semibold mb-2">Food Preparation</h3>
              <p className="text-muted-foreground">
                The restaurant prepares your food fresh and packages it in our special temperature-controlled containers.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow">
              <div className="text-3xl text-primary font-bold mb-4">03</div>
              <h3 className="text-xl font-semibold mb-2">Drone Delivery</h3>
              <p className="text-muted-foreground">
                Our autonomous drones pick up your order and fly directly to your location, avoiding traffic and obstacles.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-6">Drone Delivery Benefits</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Speed</h3>
              <p className="text-muted-foreground">
                Our drones travel at an average speed of 45 mph and take the most direct route to your location, reducing delivery time by up to 70% compared to traditional methods.
              </p>
            </div>
            <div className="border p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Eco-Friendly</h3>
              <p className="text-muted-foreground">
                Drone delivery produces zero carbon emissions during flight, helping reduce the environmental impact of food delivery services.
              </p>
            </div>
            <div className="border p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Temperature Control</h3>
              <p className="text-muted-foreground">
                Our proprietary delivery containers maintain optimal food temperature throughout the journey, ensuring your meal arrives at the perfect temperature.
              </p>
            </div>
            <div className="border p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Safety</h3>
              <p className="text-muted-foreground">
                All deliveries are contactless, and our drones are equipped with advanced obstacle detection and weather monitoring systems for safe operation.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-primary/5 p-8 rounded-lg mb-10">
          <h2 className="text-2xl font-semibold mb-4">Drone Delivery FAQs</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold">How far can drones deliver?</h3>
              <p className="text-muted-foreground">
                Our drones can deliver up to 5 miles from partner restaurants, covering most urban and suburban areas in our service regions.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold">What if I live in an apartment?</h3>
              <p className="text-muted-foreground">
                For apartment dwellers, we deliver to designated landing zones in your complex, and you'll receive a notification when your order arrives.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold">Is drone delivery available in all weather?</h3>
              <p className="text-muted-foreground">
                Drone delivery may be limited during severe weather conditions like heavy rain, snow, or high winds. In these cases, we'll switch to our traditional delivery methods at no extra cost.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold">Is there an extra cost for drone delivery?</h3>
              <p className="text-muted-foreground">
                Drone delivery is available for a small premium over standard delivery fees, but members of our QuickEats Premium program enjoy unlimited free drone deliveries.
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-6">Ready to Experience the Future of Food Delivery?</h2>
          <Link href="/restaurants">
            <Button size="lg" className="font-semibold">
              Order Now with Drone Delivery
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}