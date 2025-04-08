import type { Express } from "express"; // Import Express type for type safety
import { createServer, type Server } from "http"; // Import HTTP server utilities
import { storage } from "./memory-storage"; // In-memory storage instance
import { insertOrderSchema } from "@shared/schema"; // Zod schema for order validation
import { z } from "zod"; // Zod for input validation
import Stripe from "stripe"; // Stripe for payment processing

// Ensure that the Stripe secret key is available at runtime
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Register all routes and return the HTTP server instance
export async function registerRoutes(app: Express): Promise<Server> {

  // Route for resetting and reseeding the in-memory database (for development only)
  app.post('/api/admin/reset-db', async (_req, res) => {
    try {
      await storage.setupDB(); // Reset and seed the database
      res.json({ success: true, message: 'Database reset and reseeded successfully' });
    } catch (error) {
      console.error('Error resetting database:', error);
      res.status(500).json({ error: 'Failed to reset database' });
    }
  });

  // Route to get all restaurants
  app.get("/api/restaurants", async (_req, res) => {
    const restaurants = await storage.getRestaurants(); // Fetch all restaurants
    res.json(restaurants); // Return as JSON
  });

  // Route to get a single restaurant by ID
  app.get("/api/restaurants/:id", async (req, res) => {
    const restaurant = await storage.getRestaurant(Number(req.params.id)); // Parse ID and fetch restaurant
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" }); // Handle not found
    }
    res.json(restaurant); // Return restaurant data
  });

  // Route to get the menu items for a specific restaurant
  app.get("/api/restaurants/:id/menu", async (req, res) => {
    const menuItems = await storage.getMenuItems(Number(req.params.id)); // Get menu by restaurant ID
    res.json(menuItems); // Return as JSON
  });

  // Route to create a Stripe payment intent
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount } = req.body; // Get total amount from request
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert amount to cents
        currency: "usd", // Set currency
      });
      res.json({ clientSecret: paymentIntent.client_secret }); // Return client secret
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message }); // Handle errors
    }
  });

  // Route to create a new order
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body); // Validate input using Zod
      const order = await storage.createOrder(orderData); // Create order in memory
      res.status(201).json(order); // Return created order
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation error
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      throw error; // Rethrow unknown errors
    }
  });

  // Route to fetch an order by its ID
  app.get("/api/orders/:id", async (req, res) => {
    const order = await storage.getOrder(Number(req.params.id)); // Get order by ID
    if (!order) {
      return res.status(404).json({ message: "Order not found" }); // Handle not found
    }
    res.json(order); // Return order
  });

  // Route to update the status of an existing order
  app.patch("/api/orders/:id/status", async (req, res) => {
    const statusSchema = z.object({ status: z.string() }); // Define Zod schema for status

    try {
      const { status } = statusSchema.parse(req.body); // Validate input
      const order = await storage.updateOrderStatus(Number(req.params.id), status); // Update order status
      if (!order) {
        return res.status(404).json({ message: "Order not found" }); // Handle not found
      }
      res.json(order); // Return updated order
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation error
        return res.status(400).json({ message: "Invalid status", errors: error.errors });
      }
      throw error; // Rethrow other errors
    }
  });

  // Create and return the HTTP server from the Express app
  const httpServer = createServer(app);
  return httpServer;
}
