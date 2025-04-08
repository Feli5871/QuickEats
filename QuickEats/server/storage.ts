import {
  type Restaurant,
  type MenuItem,
  type Order,
  type InsertRestaurant,
  type InsertMenuItem,
  type InsertOrder,
  restaurants,
  menuItems,
  orders
} from "@shared/schema";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";

// Interface defining the required storage operations
export interface IStorage {
  // Restaurant operations
  getRestaurants(): Promise<Restaurant[]>;
  getRestaurant(id: number): Promise<Restaurant | undefined>;

  // Menu operations
  getMenuItems(restaurantId: number): Promise<MenuItem[]>;

  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: number): Promise<Order | undefined>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;

  // Database setup
  setupDB(): Promise<void>;
}

// Implementation of IStorage using PostgreSQL and Drizzle ORM
class PostgresStorage implements IStorage {
  private db;   // Drizzle ORM database instance
  private sql;  // Low-level SQL client for running raw SQL queries

  constructor() {
    this.sql = postgres(process.env.DATABASE_URL!); // Connect using DATABASE_URL env variable
    this.db = drizzle(this.sql);                    // Initialize Drizzle with the SQL client
  }

  // Initialize or reset the database schema and seed it with data
  async setupDB(): Promise<void> {
    try {
      console.log('Running migrations...');

      const sql = this.sql;

      // Drop all existing tables to reset the database
      try {
        console.log('Dropping existing tables...');
        await sql`DROP TABLE IF EXISTS "orders"`;
        await sql`DROP TABLE IF EXISTS "menu_items"`;
        await sql`DROP TABLE IF EXISTS "restaurants"`;
      } catch (e) {
        console.error('Error dropping tables:', e);
      }

      // Create "restaurants" table with proper schema
      await sql`
        CREATE TABLE IF NOT EXISTS "restaurants" (
          "id" SERIAL PRIMARY KEY,
          "name" TEXT NOT NULL,
          "description" TEXT NOT NULL,
          "image" TEXT NOT NULL,
          "cuisine" TEXT[] NOT NULL,
          "price_range" TEXT NOT NULL,
          "rating" DOUBLE PRECISION NOT NULL,
          "address" TEXT NOT NULL,
          "delivery_time" INTEGER NOT NULL,
          "drone_delivery_available" BOOLEAN NOT NULL,
          "featured" BOOLEAN NOT NULL DEFAULT false
        );
      `;

      // Create "menu_items" table with foreign key reference to "restaurants"
      await sql`
        CREATE TABLE IF NOT EXISTS "menu_items" (
          "id" SERIAL PRIMARY KEY,
          "restaurant_id" INTEGER NOT NULL REFERENCES "restaurants"("id"),
          "name" TEXT NOT NULL,
          "description" TEXT NOT NULL,
          "price" DOUBLE PRECISION NOT NULL,
          "image" TEXT NOT NULL,
          "category" TEXT NOT NULL,
          "popular" BOOLEAN NOT NULL DEFAULT false
        );
      `;

      // Create "orders" table with foreign key and additional order metadata
      await sql`
        CREATE TABLE IF NOT EXISTS "orders" (
          "id" SERIAL PRIMARY KEY,
          "restaurant_id" INTEGER NOT NULL REFERENCES "restaurants"("id"),
          "items" JSONB NOT NULL,
          "total_amount" DOUBLE PRECISION NOT NULL,
          "status" TEXT NOT NULL DEFAULT 'pending',
          "drone_delivery" BOOLEAN NOT NULL,
          "coordinates" JSONB NOT NULL,
          "customer_name" TEXT NOT NULL,
          "customer_email" TEXT NOT NULL,
          "customer_phone" TEXT NOT NULL,
          "delivery_address" TEXT NOT NULL,
          "payment_method" TEXT NOT NULL,
          "payment_status" TEXT NOT NULL DEFAULT 'pending',
          "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `;

      console.log('Migrations complete.');

      // Seed the database with initial data after schema setup
      console.log('Seeding database with initial data...');
      await this.seedDatabase();
    } catch (error) {
      console.error('Error setting up database:', error);
      throw error;
    }
  }
  
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
      await this.db.insert(restaurants).values(restaurant);
    }
    
    // Get all restaurants to get their IDs for menu items
    const insertedRestaurants = await this.getRestaurants();
    
    // Create menu items for each restaurant
    for (const restaurant of insertedRestaurants) {
      const menuItemsData: InsertMenuItem[] = [];
      
      if (restaurant.name === "Burger Haven") {
        menuItemsData.push(
          {
            restaurantId: restaurant.id,
            name: "Classic Burger",
            description: "100% beef patty with fresh vegetables and our special sauce",
            price: 12.99,
            image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1602&q=80",
            category: "Burgers",
            popular: true
          },
          {
            restaurantId: restaurant.id,
            name: "Cheese Burger",
            description: "Our classic burger topped with cheddar cheese",
            price: 14.99,
            image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
            category: "Burgers",
            popular: true
          },
          {
            restaurantId: restaurant.id,
            name: "French Fries",
            description: "Crispy golden fries with sea salt",
            price: 5.99,
            image: "https://images.unsplash.com/photo-1576107232684-1285f173d114?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
            category: "Sides",
            popular: false
          }
        );
      } else if (restaurant.name === "Pizza Paradise") {
        menuItemsData.push(
          {
            restaurantId: restaurant.id,
            name: "Margherita Pizza",
            description: "Classic pizza with tomato sauce, mozzarella, and basil",
            price: 15.99,
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1598&q=80",
            category: "Pizzas",
            popular: true
          },
          {
            restaurantId: restaurant.id,
            name: "Pepperoni Pizza",
            description: "Margherita pizza topped with pepperoni slices",
            price: 17.99,
            image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
            category: "Pizzas",
            popular: true
          },
          {
            restaurantId: restaurant.id,
            name: "Garlic Bread",
            description: "Freshly baked bread with garlic butter",
            price: 6.99,
            image: "https://plus.unsplash.com/premium_photo-1668618296300-37256b19f540?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
            category: "Sides",
            popular: false
          }
        );
      } else if (restaurant.name === "Jersey Mike's") {
        menuItemsData.push(
          {
            restaurantId: restaurant.id,
            name: "Original Italian",
            description: "Provolone, ham, prosciuttini, cappacuolo, salami, and pepperoni with onions, lettuce, tomatoes, vinegar, oil and spices",
            price: 11.99,
            image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
            category: "Cold Subs",
            popular: true
          },
          {
            restaurantId: restaurant.id,
            name: "Club Supreme",
            description: "Turkey, bacon, and mayo with lettuce and tomatoes",
            price: 10.99,
            image: "https://images.unsplash.com/photo-1550507992-eb63ffee0847?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
            category: "Cold Subs",
            popular: true
          },
          {
            restaurantId: restaurant.id,
            name: "Chipotle Chicken Cheesesteak",
            description: "Grilled chicken, pepper jack cheese with chipotle mayo",
            price: 12.99,
            image: "https://images.unsplash.com/photo-1539252554873-9e918320f1b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1674&q=80",
            category: "Hot Subs",
            popular: true
          },
          {
            restaurantId: restaurant.id,
            name: "Potato Chips",
            description: "Crispy kettle-cooked chips",
            price: 2.49,
            image: "https://images.unsplash.com/photo-1613914153594-49047b5e96da?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
            category: "Sides",
            popular: false
          }
        );
      } else if (restaurant.name === "Thai Delight") {
        menuItemsData.push(
          {
            restaurantId: restaurant.id,
            name: "Pad Thai",
            description: "Stir-fried rice noodles with eggs, tofu, bean sprouts, peanuts in tamarind sauce",
            price: 15.99,
            image: "https://images.unsplash.com/photo-1600314732556-c0c9b77b41d9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
            category: "Noodles",
            popular: true
          },
          {
            restaurantId: restaurant.id,
            name: "Green Curry",
            description: "Coconut milk based curry with bamboo shoots, bell peppers, and basil leaves",
            price: 16.99,
            image: "https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
            category: "Curry",
            popular: true
          },
          {
            restaurantId: restaurant.id,
            name: "Thai Spring Rolls",
            description: "Crispy rolls filled with vegetables and glass noodles, served with sweet chili sauce",
            price: 8.99,
            image: "https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
            category: "Appetizers",
            popular: true
          },
          {
            restaurantId: restaurant.id,
            name: "Mango Sticky Rice",
            description: "Sweet sticky rice with fresh mango slices and coconut cream",
            price: 7.99,
            image: "https://images.unsplash.com/photo-1621939814912-b5dad3bde9f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
            category: "Desserts",
            popular: false
          }
        );
      } else if (restaurant.name === "Cafe Aroma") {
        menuItemsData.push(
          {
            restaurantId: restaurant.id,
            name: "Avocado Toast",
            description: "Sourdough toast with mashed avocado, cherry tomatoes, and microgreens",
            price: 10.99,
            image: "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
            category: "Breakfast",
            popular: true
          },
          {
            restaurantId: restaurant.id,
            name: "Cappuccino",
            description: "Espresso with steamed milk and foam",
            price: 4.99,
            image: "https://images.unsplash.com/photo-1534778101976-62847782c213?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
            category: "Beverages",
            popular: true
          },
          {
            restaurantId: restaurant.id,
            name: "Chicken Pesto Sandwich",
            description: "Grilled chicken, pesto, roasted red peppers, and mozzarella on ciabatta bread",
            price: 12.99,
            image: "https://images.unsplash.com/photo-1559304822-9eb2813c9844?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1936&q=80",
            category: "Lunch",
            popular: true
          },
          {
            restaurantId: restaurant.id,
            name: "Chocolate Croissant",
            description: "Buttery flaky pastry filled with chocolate",
            price: 4.50,
            image: "https://images.unsplash.com/photo-1600348759986-339eca7ee8ee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80",
            category: "Pastries",
            popular: false
          }
        );
      } else {
        // Generic menu items for other restaurants
        menuItemsData.push(
          {
            restaurantId: restaurant.id,
            name: "Special Item 1",
            description: "Our most popular dish",
            price: 14.99,
            image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
            category: "Specials",
            popular: true
          },
          {
            restaurantId: restaurant.id,
            name: "Special Item 2",
            description: "Chef's recommendation",
            price: 16.99,
            image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1965&q=80",
            category: "Specials",
            popular: true
          },
          {
            restaurantId: restaurant.id,
            name: "Side Dish",
            description: "Perfect accompaniment to any meal",
            price: 7.99,
            image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
            category: "Sides",
            popular: false
          }
        );
      }
      
      // Insert menu items for this restaurant
      for (const item of menuItemsData) {
        await this.db.insert(menuItems).values(item);
      }
    }
    
    console.log('Database seeded successfully!');
  }

  // Retrieve all restaurants from the database
async getRestaurants(): Promise<Restaurant[]> {
  return await this.db.select().from(restaurants); // Select all rows from the "restaurants" table
}

// Retrieve a single restaurant by its ID
async getRestaurant(id: number): Promise<Restaurant | undefined> {
  const result = await this.db
    .select()
    .from(restaurants)
    .where(eq(restaurants.id, id)); // Filter by restaurant ID
  return result[0]; // Return the first (and only) result, or undefined
}

// Retrieve all menu items for a given restaurant
async getMenuItems(restaurantId: number): Promise<MenuItem[]> {
  return await this.db
    .select()
    .from(menuItems)
    .where(eq(menuItems.restaurantId, restaurantId)); // Filter by restaurant_id
}

// Insert a new order into the "orders" table and return the created order
async createOrder(order: InsertOrder): Promise<Order> {
  const result = await this.db
    .insert(orders)
    .values(order)
    .returning(); // Return all columns of the inserted order
  return result[0]; // Return the first inserted order
}

// Retrieve a specific order by its ID
async getOrder(id: number): Promise<Order | undefined> {
  const result = await this.db
    .select()
    .from(orders)
    .where(eq(orders.id, id)); // Filter by order ID
  return result[0]; // Return the first (and only) result, or undefined
}

// Update the status of a specific order and return the updated order
async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
  const result = await this.db
    .update(orders)
    .set({ status }) // Set new status
    .where(eq(orders.id, id)) // Find order by ID
    .returning(); // Return updated row(s)
    
  return result[0]; // Return the updated order
}

// Export a singleton instance of the PostgresStorage class
export const storage = new PostgresStorage();
