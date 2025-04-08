import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { FiChevronLeft } from "react-icons/fi";
import { IoLeaf } from "react-icons/io5";

export default function FreshOrganicPage() {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-10 px-4">
        <Link href="/">
          <Button variant="ghost" className="mb-6 flex items-center gap-2">
            <FiChevronLeft /> Back to Home
          </Button>
        </Link>
        
        <div className="flex items-center gap-3 mb-8">
          <IoLeaf className="text-4xl text-primary" />
          <h1 className="text-4xl font-bold">Fresh & Organic</h1>
        </div>
        
        <div className="grid md:grid-cols-2 gap-10 mb-10">
          <div>
            <img 
              src="https://grist.org/wp-content/uploads/2015/11/organic.jpg?quality=75&strip=all&w=1200" 
              alt="Fresh & Organic" 
              className="rounded-lg shadow-lg w-full h-auto object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Our Commitment to Quality</h2>
            <p className="text-lg text-muted-foreground mb-4">
              At QuickEats, we believe that fast food doesn't have to compromise on quality. That's why we've formed exclusive partnerships
              with restaurants that share our commitment to using fresh, locally-sourced, and organic ingredients.
            </p>
            <p className="text-lg text-muted-foreground">
              We regularly audit our restaurant partners to ensure they maintain the highest standards in food quality,
              sustainability practices, and ethical sourcing. When you order through QuickEats, you can trust that you're getting
              food that's not just delicious, but also good for you and the planet.
            </p>
          </div>
        </div>
        
        <div className="bg-muted p-8 rounded-lg mb-10">
          <h2 className="text-2xl font-semibold mb-6">Our Fresh & Organic Standards</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">Local Sourcing</h3>
              <p className="text-muted-foreground">
                We prioritize restaurants that source ingredients from within a 100-mile radius, supporting local farmers and reducing carbon footprint.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">Organic Certification</h3>
              <p className="text-muted-foreground">
                Our partner restaurants use USDA certified organic ingredients whenever possible, minimizing your exposure to pesticides and chemicals.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">Seasonal Menus</h3>
              <p className="text-muted-foreground">
                We encourage our partners to create seasonal menus that showcase ingredients at their peak of freshness and flavor.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-6">Benefits of Fresh & Organic Food</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Better Taste</h3>
              <p className="text-muted-foreground">
                Fresh, in-season produce simply tastes better. Organic growing methods allow fruits and vegetables to develop fuller flavor profiles.
              </p>
            </div>
            <div className="border p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Health Benefits</h3>
              <p className="text-muted-foreground">
                Organic foods often contain higher levels of antioxidants and fewer pesticide residues, providing more nutritional benefits than conventionally grown alternatives.
              </p>
            </div>
            <div className="border p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Environmental Impact</h3>
              <p className="text-muted-foreground">
                Organic farming methods promote biodiversity, improve soil health, and reduce pollution from synthetic fertilizers and pesticides.
              </p>
            </div>
            <div className="border p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Support Local Economy</h3>
              <p className="text-muted-foreground">
                By prioritizing locally sourced ingredients, we help support local farmers, producers, and the regional economy.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-primary/5 p-8 rounded-lg mb-10">
          <h2 className="text-2xl font-semibold mb-4">Fresh & Organic FAQs</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold">How do you verify that restaurants use organic ingredients?</h3>
              <p className="text-muted-foreground">
                We require documentation of organic certification from suppliers and conduct regular quality control visits to ensure compliance with our standards.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold">Are all restaurants on QuickEats organic?</h3>
              <p className="text-muted-foreground">
                While not all restaurants are 100% organic, all partners must meet minimum standards for ingredient quality and sourcing. Restaurants with our "Certified Organic" badge use at least 70% certified organic ingredients.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold">Does organic food cost more?</h3>
              <p className="text-muted-foreground">
                While organic ingredients may sometimes cost more than conventional ones, we work with our partners to keep prices reasonable. Many of our restaurants offer organic options at competitive prices.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold">How do you keep food fresh during delivery?</h3>
              <p className="text-muted-foreground">
                Our specialized delivery containers and efficient delivery methods ensure that food stays at the optimal temperature and arrives as fresh as possible. Our drone delivery system significantly reduces transit time, preserving freshness.
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-6">Ready to Enjoy Fresh, Organic Food?</h2>
          <Link href="/restaurants">
            <Button size="lg" className="font-semibold">
              Browse Our Organic Restaurant Partners
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}