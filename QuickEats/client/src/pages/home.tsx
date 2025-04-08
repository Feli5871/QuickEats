import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useEffect, useRef, useState } from "react";
import Layout from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import type { Restaurant } from "@shared/schema";
import { FiClock, FiShield } from "react-icons/fi";
import { PiDrone } from "react-icons/pi";
import { sortRestaurants, getPriceTier } from "@/lib/restaurantUtils";
import { GiHamburger, GiFullPizza, GiSushis, GiTacos, GiNoodles } from "react-icons/gi";

// Featured restaurant type
type FeaturedRestaurant = {
  name: string;
  image: string;
  rating: string;
};

export default function Home() {
  const { data: restaurants, isLoading } = useQuery<Restaurant[]>({
    queryKey: ["/api/restaurants"],
  });
  
  // For sorting functionality
  const [sortBy, setSortBy] = useState("default");
  const [displayedRestaurants, setDisplayedRestaurants] = useState<Restaurant[]>([]);
  
  // For carousel functionality
  const [index, setIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Mock data for featured restaurants with text logos
  const featuredRestaurants: FeaturedRestaurant[] = [
    {
      name: "Burger Haven",
      image: "", // We'll render this text-based in the component
      rating: "4.5 Stars"
    },
    {
      name: "Pizza Paradise",
      image: "",
      rating: "4.4 Stars"
    },
    {
      name: "Sushi Supreme",
      image: "",
      rating: "4.7 Stars"
    },
    {
      name: "Taco Time",
      image: "",
      rating: "4.3 Stars"
    },
    {
      name: "Pasta Palace",
      image: "",
      rating: "4.6 Stars"
    }
  ];
  
  // Carousel navigation functions
  const nextSlide = () => {
    setIndex((prevIndex) => (prevIndex + 1) % featuredRestaurants.length);
  };
  
  const prevSlide = () => {
    setIndex((prevIndex) => (prevIndex - 1 + featuredRestaurants.length) % featuredRestaurants.length);
  };
  
  // Update carousel position when index changes
  useEffect(() => {
    if (carouselRef.current) {
      const cardWidth = 250; // Match the width in CSS
      carouselRef.current.style.transform = `translateX(${-index * cardWidth}px)`;
    }
  }, [index]);
  
  // Add a 'featured' property to our Restaurant type
  type EnhancedRestaurant = Restaurant & { featured?: boolean };
  
  // Create virtual restaurants from the featured list
  const createVirtualRestaurantsFromFeatured = (realRestaurants: Restaurant[]): EnhancedRestaurant[] => {
    // Find real restaurants that match our featured restaurants by name
    const existingIds = new Set<number>();
    const enhancedRestaurants = [...realRestaurants] as EnhancedRestaurant[];
    
    // For each featured restaurant, find if it already exists in the data
    featuredRestaurants.forEach((featured) => {
      // Try to find a matching restaurant in real data
      const match = enhancedRestaurants.find(r => 
        r.name.toLowerCase().includes(featured.name.toLowerCase()) || 
        featured.name.toLowerCase().includes(r.name.toLowerCase())
      );
      
      if (match) {
        // If found, mark as featured and record the ID
        existingIds.add(match.id);
        match.featured = true;
        
        // Don't update the image - keep the original food image
        // match.image = featured.image;
      }
    });
    
    return enhancedRestaurants;
  };

  // Handle sorting when restaurants data or sortBy changes
  useEffect(() => {
    if (restaurants) {
      // Create a copy to avoid mutating the original data
      const enhancedRestaurants = createVirtualRestaurantsFromFeatured([...restaurants]);
      
      // Apply sorting based on selected option
      if (sortBy !== "default") {
        const sortedData = sortRestaurants(enhancedRestaurants, sortBy);
        setDisplayedRestaurants(sortedData);
      } else {
        setDisplayedRestaurants(enhancedRestaurants);
      }
    }
  }, [restaurants, sortBy]);

  return (
    <Layout>
      <div id="home" className="section active">
        <div className="home-section">
          <h2 className="text-4xl font-bold">Welcome to QuickEats</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Order your favorite food and get it delivered by drone!
          </p>
          
          <div className="featured-section">
            <h2 className="text-2xl font-bold">Featured Restaurants</h2>
            <div className="carousel-container">
              <button className="carousel-btn left" onClick={prevSlide}>❮</button>
              <div className="carousel">
                <div className="carousel-inner" ref={carouselRef}>
                  {featuredRestaurants.map((restaurant, i) => (
                    <div 
                      key={i} 
                      className="featured-card cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => {
                        // Find the restaurant in the API data based on name
                        const restaurantData = restaurants?.find(r => 
                          r.name.toLowerCase().includes(restaurant.name.toLowerCase()) || 
                          restaurant.name.toLowerCase().includes(r.name.toLowerCase())
                        );
                        
                        if (restaurantData) {
                          window.location.href = `/restaurant/${restaurantData.id}`;
                        } else {
                          // If match not found, navigate to restaurants page
                          window.location.href = '/restaurants';
                        }
                      }}
                    >
                      <div className="logo-container">
                        <div className="text-center">
                          <div className="text-5xl mb-2 text-primary">
                            {restaurant.name.toLowerCase().includes('burger') && <GiHamburger />}
                            {restaurant.name.toLowerCase().includes('pizza') && <GiFullPizza />}
                            {restaurant.name.toLowerCase().includes('sushi') && <GiSushis />}
                            {restaurant.name.toLowerCase().includes('taco') && <GiTacos />}
                            {restaurant.name.toLowerCase().includes('pasta') && <GiNoodles />}
                          </div>
                          <h3 className="font-bold text-2xl text-primary">{restaurant.name}</h3>
                          <div className="mt-2 border-t pt-2 text-sm">Official Partner</div>
                        </div>
                      </div>
                      <h3 className="font-semibold px-4 mt-2">{restaurant.name}</h3>
                      <p className="text-yellow-500 px-4 pb-4">{restaurant.rating}</p>
                    </div>
                  ))}
                </div>
              </div>
              <button className="carousel-btn right" onClick={nextSlide}>❯</button>
            </div>
          </div>
          
          <Button 
            size="lg" 
            className="font-semibold"
            onClick={() => {
              // Show the restaurants section
              document.querySelectorAll(".section").forEach(s => 
                s.classList.remove("active"));
              const section = document.getElementById("restaurants");
              if (section) section.classList.add("active");
              
              // Update the URL
              window.history.pushState(null, '', '/restaurants');
            }}
          >
            Explore Restaurants
          </Button>
        </div>
        
        <div className="features-section">
          <div className="features-grid">
            <div className="feature-card">
              <img src="https://grist.org/wp-content/uploads/2015/11/organic.jpg?quality=75&strip=all&w=1200" alt="Fresh & Organic" />
              <h3 className="text-xl font-semibold mb-2">Fresh & Organic</h3>
              <p className="text-muted-foreground mb-4">
                We deliver high-quality, organic food directly from the best restaurants.
              </p>
              <Link href="/info/fresh-organic">
                <button className="text-primary hover:text-primary/80 bg-transparent border border-primary px-4 py-2 rounded hover:bg-primary/5">
                  Read More
                </button>
              </Link>
            </div>
            
            <div className="feature-card">
              <img src="https://modernrestaurantmanagement.com/assets/media/2020/07/Getty_526233045-1200x655.jpg" alt="Drone Delivery" />
              <h3 className="text-xl font-semibold mb-2">Drone Delivery</h3>
              <p className="text-muted-foreground mb-4">
                Enjoy fast and free delivery with our advanced drone technology.
              </p>
              <Link href="/info/drone-delivery">
                <button className="text-primary hover:text-primary/80 bg-transparent border border-primary px-4 py-2 rounded hover:bg-primary/5">
                  Read More
                </button>
              </Link>
            </div>
            
            <div className="feature-card">
              <img src="https://cdn.vectorstock.com/i/500p/33/79/100-secure-grunge-badge-with-a-check-mark-label-vector-51493379.jpg" alt="Easy Payments" />
              <h3 className="text-xl font-semibold mb-2">Easy Payments</h3>
              <p className="text-muted-foreground mb-4">
                Secure and hassle-free payment options for a seamless experience.
              </p>
              <Link href="/info/easy-payments">
                <button className="text-primary hover:text-primary/80 bg-transparent border border-primary px-4 py-2 rounded hover:bg-primary/5">
                  Read More
                </button>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="reviews">
          <div className="review-card">
            <div className="stars">★★★★★</div>
            <h4 className="font-semibold mb-2">John D.</h4>
            <p className="text-muted-foreground">"QuickEats is amazing! The food arrived in under 20 minutes, and it was still hot. Highly recommend!"</p>
          </div>
          <div className="review-card">
            <div className="stars">★★★★★</div>
            <h4 className="font-semibold mb-2">Sarah L.</h4>
            <p className="text-muted-foreground">"The service is fantastic, and the delivery is always on time. I love the variety of restaurants available."</p>
          </div>
          <div className="review-card">
            <div className="stars">★★★★★</div>
            <h4 className="font-semibold mb-2">Mike T.</h4>
            <p className="text-muted-foreground">"The drone delivery is so cool! The food is always fresh, and the app is super easy to use."</p>
          </div>
          <div className="review-card">
            <div className="stars">★★★★★</div>
            <h4 className="font-semibold mb-2">Emily R.</h4>
            <p className="text-muted-foreground">"I've never had a bad experience with QuickEats. The delivery is fast, and the food is delicious!"</p>
          </div>
        </div>
      </div>
      
      <div id="restaurants" className="section">
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">All Restaurants</h2>
            <select 
              id="sort-by" 
              className="border rounded p-2"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="price-low">Price ($ to $$$$)</option>
              <option value="price-high">Price ($$$$ to $)</option>
              <option value="rating-asc">Rating (Lowest to Highest)</option>
              <option value="rating-desc">Rating (Highest to Lowest)</option>
            </select>
          </div>
          
          {isLoading ? (
            <div className="restaurant-grid">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-[300px]" />
              ))}
            </div>
          ) : (
            <div className="restaurant-grid" id="restaurant-grid">
              {displayedRestaurants.map((restaurant) => (
                <div key={restaurant.id} className="restaurant-card">
                  <img src={restaurant.image} alt={restaurant.name} className="restaurant-img" />
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold">{restaurant.name}</h3>
                      {(restaurant as EnhancedRestaurant).featured && (
                        <div className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                          Featured
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{restaurant.description}</p>
                    <p className="text-sm">Rating: {restaurant.rating}</p>
                    <p className="text-sm mb-4">Delivery Time: {restaurant.deliveryTime} mins</p>
                    {/* Add price tier indicators */}
                    <p className="text-sm mb-2">
                      Price: 
                      <span className="ml-1 text-green-600 font-medium">
                        {restaurant.priceRange && restaurant.priceRange.startsWith('$') 
                          ? restaurant.priceRange 
                          : Array(getPriceTier(restaurant.priceRange || '')).fill('$').join('')}
                      </span>
                    </p>
                    <Link href={`/restaurant/${restaurant.id}`}>
                      <Button size="sm" className="w-full">View Menu</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div id="profile" className="section">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="auth-forms w-full max-w-md p-8 bg-card rounded-lg shadow-lg" id="login-form">
            <h2 className="text-2xl font-bold mb-6 text-center">Login to QuickEats</h2>
            <input type="email" placeholder="Email" className="w-full p-3 border rounded mb-4" />
            <input type="password" placeholder="Password" className="w-full p-3 border rounded mb-6" />
            <Button className="w-full py-3">Login</Button>
            <p className="mt-6 text-center">Don't have an account? <a href="#" className="text-primary hover:underline">Register</a></p>
          </div>
        </div>
      </div>
      
      <div id="contact" className="section">
        <div className="max-w-2xl mx-auto p-6">
          <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
          <p className="text-muted-foreground mb-6">
            Have questions? Fill out the form below and we'll get back to you.
          </p>
          <form id="contact-form" className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-1">Name:</label>
              <input type="text" id="name" placeholder="Your Name" required 
                className="w-full p-2 border rounded" />
            </div>
            <div>
              <label htmlFor="email" className="block mb-1">Email:</label>
              <input type="email" id="email" placeholder="Your Email" required 
                className="w-full p-2 border rounded" />
            </div>
            <div>
              <label htmlFor="message" className="block mb-1">Message:</label>
              <textarea id="message" placeholder="Your Message" rows={5} required 
                className="w-full p-2 border rounded" />
            </div>
            <Button type="submit" className="w-full">Send Message</Button>
          </form>
          <div id="contact-success" className="hidden text-green-500 mt-4">
            Message sent successfully! We will contact you soon.
          </div>
        </div>
      </div>
    </Layout>
  );
}