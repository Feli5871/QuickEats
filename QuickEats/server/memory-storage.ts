import {
  type Restaurant,
  type MenuItem,
  type Order,
  type InsertRestaurant,
  type InsertMenuItem,
  type InsertOrder,
} from "@shared/schema";

// Interface defining storage operations
export interface IStorage {
  // Restaurant operations
  getRestaurants(): Promise<Restaurant[]>;                        // Retrieve all restaurants
  getRestaurant(id: number): Promise<Restaurant | undefined>;    // Retrieve a specific restaurant by ID

  // Menu operations
  getMenuItems(restaurantId: number): Promise<MenuItem[]>;       // Retrieve menu items for a restaurant

  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;               // Create a new order
  getOrder(id: number): Promise<Order | undefined>;              // Retrieve a specific order by ID
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>; // Update the status of an order

  // Database setup
  setupDB(): Promise<void>;                                      // Initialize or reset the in-memory database
}

// In-memory implementation of the IStorage interface
class MemoryStorage implements IStorage {
  // Internal data stores
  private restaurants: Restaurant[] = [];
  private menuItems: MenuItem[] = [];
  private orders: Order[] = [];

  // Counters to generate unique IDs
  private restaurantIdCounter = 1;
  private menuItemIdCounter = 1;
  private orderIdCounter = 1;

  constructor() {}

  // Setup or reset the in-memory database
  async setupDB(): Promise<void> {
    try {
      console.log('Setting up in-memory database...');

      // Clear all existing data
      this.restaurants = [];
      this.menuItems = [];
      this.orders = [];

      // Reset ID counters
      this.restaurantIdCounter = 1;
      this.menuItemIdCounter = 1;
      this.orderIdCounter = 1;

      // Seed database with initial data (implementation not shown)
      await this.seedDatabase();

      console.log('In-memory database setup complete.');
    } catch (error) {
      console.error('Error setting up in-memory database:', error);
      throw error;
    }
  }

  // Additional methods like getRestaurants, createOrder, etc., would go here...


  private async seedDatabase() {
    // Sample restaurant data
    const restaurantData: InsertRestaurant[] = [
      {
        name: "Burger Haven",
        description: "Best burgers in town with premium ingredients and chef-crafted recipes.",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1602&q=80",
        cuisine: ["American", "Fast Food"],
        priceRange: "$10-$20",
        rating: 4.5,
        address: "123 Main St, New York, NY",
        deliveryTime: 30,
        droneDeliveryAvailable: true,
        featured: true
      },
      {
        name: "Pizza Paradise",
        description: "Authentic Italian pizzas made with traditional recipes and imported ingredients.",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1598&q=80",
        cuisine: ["Italian", "Pizza"],
        priceRange: "$15-$25",
        rating: 4.7,
        address: "456 Pizza Ave, New York, NY",
        deliveryTime: 25,
        droneDeliveryAvailable: true,
        featured: true
      },
      {
        name: "Sushi Supreme",
        description: "Premium sushi and Japanese cuisine prepared by expert chefs.",
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
        cuisine: ["Japanese", "Sushi"],
        priceRange: "$20-$40",
        rating: 4.8,
        address: "789 Sushi St, New York, NY",
        deliveryTime: 35,
        droneDeliveryAvailable: false,
        featured: true
      },
      {
        name: "Taco Time",
        description: "Authentic Mexican street food with homemade salsa and fresh ingredients.",
        image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
        cuisine: ["Mexican", "Fast Food"],
        priceRange: "$8-$15",
        rating: 4.3,
        address: "101 Taco Rd, New York, NY",
        deliveryTime: 20,
        droneDeliveryAvailable: true,
        featured: false
      },
      {
        name: "Pasta Palace",
        description: "Fresh homemade pasta and Italian specialties in a cozy atmosphere.",
        image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
        cuisine: ["Italian", "Pasta"],
        priceRange: "$15-$30",
        rating: 4.6,
        address: "222 Pasta Ln, New York, NY",
        deliveryTime: 40,
        droneDeliveryAvailable: false,
        featured: false
      },
      // New restaurants
      {
        name: "Jersey Mike's",
        description: "Premium sub sandwiches made fresh to order with high-quality ingredients.",
        image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
        cuisine: ["American", "Sandwiches"],
        priceRange: "$8-$15",
        rating: 4.4,
        address: "1001 Morris Ave, Union, NJ",
        deliveryTime: 25,
        droneDeliveryAvailable: true,
        featured: true
      },
      {
        name: "Thai Delight",
        description: "Authentic Thai cuisine with fresh ingredients and traditional recipes from Bangkok.",
        image: "https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
        cuisine: ["Thai", "Asian"],
        priceRange: "$12-$25",
        rating: 4.6,
        address: "222 Stuyvesant Ave, Union, NJ",
        deliveryTime: 35,
        droneDeliveryAvailable: false,
        featured: true
      },
      {
        name: "Cafe Aroma",
        description: "Cozy cafe offering specialty coffee, breakfast, pastries, and light lunch options.",
        image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1741&q=80",
        cuisine: ["Cafe", "Breakfast", "Desserts"],
        priceRange: "$5-$15",
        rating: 4.7,
        address: "500 Chestnut St, Union, NJ",
        deliveryTime: 20,
        droneDeliveryAvailable: true,
        featured: false
      }
    ];

    // Insert restaurants first
    for (const restaurant of restaurantData) {
      const newRestaurant: Restaurant = {
        id: this.restaurantIdCounter++,
        name: restaurant.name,
        description: restaurant.description,
        image: restaurant.image,
        cuisine: restaurant.cuisine || [],
        priceRange: restaurant.priceRange,
        rating: restaurant.rating,
        address: restaurant.address,
        deliveryTime: restaurant.deliveryTime,
        droneDeliveryAvailable: restaurant.droneDeliveryAvailable,
        featured: restaurant.featured !== undefined ? restaurant.featured : false
      };
      this.restaurants.push(newRestaurant);
    }

    // Create menu items for each restaurant
    for (const restaurant of this.restaurants) {
      if (restaurant.name === "Burger Haven") {
        this.insertMenuItem({
          restaurantId: restaurant.id,
          name: "Classic Burger",
          description: "100% beef patty with fresh vegetables and our special sauce",
          price: 12.99,
          image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1602&q=80",
          category: "Burgers",
          popular: true
        });

        this.insertMenuItem({
          restaurantId: restaurant.id,
          name: "Cheese Burger",
          description: "Our classic burger topped with cheddar cheese",
          price: 14.99,
          image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
          category: "Burgers",
          popular: true
        });

        this.insertMenuItem({
          restaurantId: restaurant.id,
          name: "French Fries",
          description: "Crispy golden fries with sea salt",
          price: 5.99,
          image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
          category: "Sides",
          popular: false
        });
      } else if (restaurant.name === "Pizza Paradise") {
        this.insertMenuItem({
          restaurantId: restaurant.id,
          name: "Margherita Pizza",
          description: "Classic pizza with tomato sauce, mozzarella, and basil",
          price: 15.99,
          image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1598&q=80",
          category: "Pizzas",
          popular: true
        });

        this.insertMenuItem({
          restaurantId: restaurant.id,
          name: "Pepperoni Pizza",
          description: "Margherita pizza topped with pepperoni slices",
          price: 17.99,
          image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
          category: "Pizzas",
          popular: true
        });

        this.insertMenuItem({
          restaurantId: restaurant.id,
          name: "Garlic Bread",
          description: "Freshly baked bread with garlic butter",
          price: 6.99,
          image: "https://images.unsplash.com/photo-1619531038896-defd9b1fc473?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
          category: "Sides",
          popular: false
        });
      } else if (restaurant.name === "Jersey Mike's") {
        this.insertMenuItem({
          restaurantId: restaurant.id,
          name: "Original Italian",
          description: "Provolone, ham, prosciuttini, cappacuolo, salami, and pepperoni with onions, lettuce, tomatoes, vinegar, oil and spices",
          price: 11.99,
          image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
          category: "Cold Subs",
          popular: true
        });

        this.insertMenuItem({
          restaurantId: restaurant.id,
          name: "Club Supreme",
          description: "Turkey, bacon, and mayo with lettuce and tomatoes",
          price: 10.99,
          image: "https://images.unsplash.com/photo-1550507992-eb63ffee0847?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
          category: "Cold Subs",
          popular: true
        });

        this.insertMenuItem({
          restaurantId: restaurant.id,
          name: "Chipotle Chicken Cheesesteak",
          description: "Grilled chicken, pepper jack cheese with chipotle mayo",
          price: 12.99,
          image: "https://images.unsplash.com/photo-1539252554873-9e918320f1b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1674&q=80",
          category: "Hot Subs",
          popular: true
        });

        this.insertMenuItem({
          restaurantId: restaurant.id,
          name: "Potato Chips",
          description: "Crispy kettle-cooked chips",
          price: 2.49,
          image: "https://images.unsplash.com/photo-1613914153594-49047b5e96da?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
          category: "Sides",
          popular: false
        });
      } else if (restaurant.name === "Thai Delight") {
        this.insertMenuItem({
          restaurantId: restaurant.id,
          name: "Pad Thai",
          description: "Stir-fried rice noodles with eggs, tofu, bean sprouts, peanuts in tamarind sauce",
          price: 15.99,
          image: "https://images.unsplash.com/photo-1600314732556-c0c9b77b41d9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
          category: "Noodles",
          popular: true
        });

        this.insertMenuItem({
          restaurantId: restaurant.id,
          name: "Green Curry",
          description: "Coconut milk based curry with bamboo shoots, bell peppers, and basil leaves",
          price: 16.99,
          image: "https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
          category: "Curry",
          popular: true
        });

        this.insertMenuItem({
          restaurantId: restaurant.id,
          name: "Thai Spring Rolls",
          description: "Crispy rolls filled with vegetables and glass noodles, served with sweet chili sauce",
          price: 8.99,
          image: "https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
          category: "Appetizers",
          popular: true
        });

        this.insertMenuItem({
          restaurantId: restaurant.id,
          name: "Mango Sticky Rice",
          description: "Sweet sticky rice with fresh mango slices and coconut cream",
          price: 7.99,
          image: "https://images.unsplash.com/photo-1621939814912-b5dad3bde9f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
          category: "Desserts",
          popular: false
        });
      } else if (restaurant.name === "Cafe Aroma") {
        this.insertMenuItem({
          restaurantId: restaurant.id,
          name: "Avocado Toast",
          description: "Sourdough toast with mashed avocado, cherry tomatoes, and microgreens",
          price: 10.99,
          image: "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
          category: "Breakfast",
          popular: true
        });

        this.insertMenuItem({
          restaurantId: restaurant.id,
          name: "Cappuccino",
          description: "Espresso with steamed milk and foam",
          price: 4.99,
          image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
          category: "Beverages",
          popular: true
        });

        this.insertMenuItem({
          restaurantId: restaurant.id,
          name: "Chicken Salad Sandwich",
          description: "House-made chicken salad with grapes and walnuts on whole grain bread",
          price: 11.99,
          image: "https://images.unsplash.com/photo-1554941829-202a0b2403b8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
          category: "Lunch",
          popular: false
        });

        this.insertMenuItem({
          restaurantId: restaurant.id,
          name: "Blueberry Muffin",
          description: "Freshly baked blueberry muffin with streusel topping",
          price: 3.99,
          image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
          category: "Pastries",
          popular: true
        });
      } else {
        // Add a generic menu item for other restaurants
        this.insertMenuItem({
          restaurantId: restaurant.id,
          name: "Signature Dish",
          description: "Our most popular and delicious specialty",
          price: 14.99,
          image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80",
          category: "Main Course",
          popular: true
        });

        this.insertMenuItem({
          restaurantId: restaurant.id,
          name: "Side Dish",
          description: "Perfect accompaniment to any meal",
          price: 7.99,
          image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
          category: "Sides",
          popular: false
        });
      }
    }

    console.log('In-memory database seeded successfully!');
  }

  // Internal helper to insert a menu item into the in-memory store
private insertMenuItem(menuItem: InsertMenuItem): MenuItem {
  const newMenuItem: MenuItem = {
    id: this.menuItemIdCounter++, // Generate a unique ID
    name: menuItem.name,
    description: menuItem.description,
    image: menuItem.image,
    restaurantId: menuItem.restaurantId,
    price: menuItem.price,
    category: menuItem.category,
    // Set default value of `popular` to false if not provided
    popular: menuItem.popular !== undefined ? menuItem.popular : false
  };
  this.menuItems.push(newMenuItem); // Store the new item
  return newMenuItem;
}

// Fetch all restaurants
async getRestaurants(): Promise<Restaurant[]> {
  return this.restaurants;
}

// Fetch a single restaurant by its ID
async getRestaurant(id: number): Promise<Restaurant | undefined> {
  return this.restaurants.find(restaurant => restaurant.id === id);
}

// Fetch all menu items belonging to a given restaurant
async getMenuItems(restaurantId: number): Promise<MenuItem[]> {
  return this.menuItems.filter(menuItem => menuItem.restaurantId === restaurantId);
}

// Create a new order and store it in memory
async createOrder(order: InsertOrder): Promise<Order> {
  const timestamp = new Date(); // Record creation time

  const newOrder: Order = {
    id: this.orderIdCounter++, // Generate a unique ID
    restaurantId: order.restaurantId,
    items: order.items,
    totalAmount: order.totalAmount,
    status: order.status || 'pending', // Default status if not provided
    droneDelivery: order.droneDelivery,
    coordinates: order.coordinates,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    deliveryAddress: order.deliveryAddress,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus || 'pending', // Default payment status
    createdAt: timestamp
  };

  this.orders.push(newOrder); // Store the order
  return newOrder;
}

// Retrieve a specific order by ID
async getOrder(id: number): Promise<Order | undefined> {
  return this.orders.find(order => order.id === id);
}

// Update the status of an existing order
async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
  const order = this.orders.find(o => o.id === id);
  if (order) {
    order.status = status; // Apply new status
  }
  return order; // Return updated order (or undefined if not found)
}

// Export a singleton instance of MemoryStorage
export const storage = new MemoryStorage();
