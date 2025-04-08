import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FiClock, FiStar } from "react-icons/fi";
import { PiDrone } from "react-icons/pi";
import type { Restaurant } from "@shared/schema";
import { Link } from "wouter";

export default function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <Link href={`/restaurant/${restaurant.id}`}>
      <a className="block hover:opacity-80 transition-opacity">
        <Card className="overflow-hidden">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-48 object-cover"
          />
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl">{restaurant.name}</CardTitle>
              <Badge variant="secondary" className="flex items-center gap-1">
                <FiStar className="text-yellow-500" />
                {restaurant.rating}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{restaurant.description}</p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-sm">
                <FiClock />
                {restaurant.deliveryTime} mins
              </span>
              {restaurant.droneDeliveryAvailable && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <PiDrone />
                  Drone Delivery
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </a>
    </Link>
  );
}
