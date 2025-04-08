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