import { useEffect } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout";
import DeliveryMap from "@/components/delivery-map";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import type { Order } from "@shared/schema";
import { PiDrone } from "react-icons/pi";
import { FiPackage, FiTruck, FiCheck } from "react-icons/fi";

const OrderStatus = {
  pending: { icon: FiPackage, color: "text-yellow-500", progress: 25 },
  preparing: { icon: FiPackage, color: "text-blue-500", progress: 50 },
  delivering: { icon: FiTruck, color: "text-purple-500", progress: 75 },
  delivered: { icon: FiCheck, color: "text-green-500", progress: 100 },
};

export default function TrackingPage() {
  const { id } = useParams();

  const { data: order, isLoading } = useQuery<Order>({
    queryKey: [`/api/orders/${id}`],
    refetchInterval: (data) => (data?.status === "delivered" ? false : 5000),
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto">
          <Skeleton className="h-[400px] mb-8" />
          <Skeleton className="h-[200px]" />
        </div>
      </Layout>
    );
  }

  if (!order) return null;

  const status = OrderStatus[order.status as keyof typeof OrderStatus];
  const StatusIcon = status.icon;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Order Tracking</h1>
          <p className="text-muted-foreground">Order #{order.id}</p>
        </div>

        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Order Status
                {order.droneDelivery && (
                  <span className="text-primary">
                    <PiDrone />
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <StatusIcon className={`h-6 w-6 ${status.color}`} />
                <div className="flex-1">
                  <Progress value={status.progress} className="h-2" />
                </div>
              </div>
              <p className="text-lg font-medium capitalize">{order.status}</p>
              {order.droneDelivery && (
                <p className="text-sm text-muted-foreground">
                  Your order is being delivered by drone for faster delivery
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Live Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <DeliveryMap order={order} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>Item #{item.id}</span>
                    <span>Quantity: {item.quantity}</span>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total Amount</span>
                    <span>${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
