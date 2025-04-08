import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";
import type { MenuItem } from "@shared/schema";

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export default function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  return (
    <Card>
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-40 object-cover"
      />
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          {item.name}
          <span className="text-primary">${item.price.toFixed(2)}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
        <Button
          onClick={() => onAddToCart(item)}
          className="w-full"
          variant="secondary"
        >
          <FiPlus className="mr-2" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
}
