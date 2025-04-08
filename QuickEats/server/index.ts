import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes"; // Import route registration logic
import { setupVite, serveStatic, log } from "./vite"; // Import dev/build tools and logger
import { storage } from "./memory-storage"; // Import in-memory DB setup

const app = express(); // Create an Express app instance

// Parse incoming JSON requests
app.use(express.json());
// Parse URL-encoded data with querystring library
app.use(express.urlencoded({ extended: false }));

// Add CORS headers for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH'); // Allowed methods
  res.header('Access-Control-Allow-Headers', 'Content-Type'); // Allowed headers
  next(); // Continue to next middleware
});

// Add logging middleware
app.use((req, res, next) => {
  const start = Date.now(); // Start time of the request
  const path = req.path; // Request path
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  // Intercept and store JSON responses
  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  // After response is sent
  res.on("finish", () => {
    const duration = Date.now() - start; // Calculate request duration
    if (path.startsWith("/api")) { // Only log API requests
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`; // Include response body in log
      }

      // Truncate if log line is too long
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine); // Log the request
    }
  });

  next(); // Continue to next middleware
});

(async () => {
  try {
    log('Starting server initialization...');
    
    // Set up in-memory database
    log('Setting up in-memory database...');
    await storage.setupDB(); // Initialize in-memory DB
    log('In-memory database setup complete.');
    
    const server = await registerRoutes(app); // Register all routes and get server instance

    // Error handling middleware
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      console.error('Server error:', err); // Log error to console
      const status = err.status || err.statusCode || 500; // Determine status code
      const message = err.message || "Internal Server Error"; // Fallback error message
      res.status(status).json({ message }); // Send JSON error response
    });

    if (app.get("env") === "development") {
      await setupVite(app, server); // Use Vite dev server in development mode
    } else {
      serveStatic(app); // Serve built static assets in production
    }

    // ALWAYS serve the app on port 5000
    const port = 5000;
    server.listen({
      port,
      host: "0.0.0.0", // Listen on all interfaces
      reusePort: true, // Allow port reuse
    }, () => {
      log(`Server running at http://0.0.0.0:${port}`); // Log successful startup
    });
  } catch (error) {
    console.error('Failed to start server:', error); // Log any startup errors
    process.exit(1); // Exit process with failure
  }
})();
