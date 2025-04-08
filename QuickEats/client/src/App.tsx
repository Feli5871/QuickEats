import { Route, Switch } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Restaurant from "@/pages/restaurant";
import Checkout from "@/pages/checkout";
import Tracking from "@/pages/tracking";
import DroneDeliveryPage from "@/pages/info-drone-delivery";
import FreshOrganicPage from "@/pages/info-fresh-organic";
import EasyPaymentsPage from "@/pages/info-easy-payments";
import Profile from "@/pages/profile";
import ConfirmationPage from "@/pages/confirmation"; // import

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/restaurants" component={Home} /> {/* We'll show the restaurants section in Home */}
      <Route path="/profile" component={Profile} />
      <Route path="/contact" component={Home} /> {/* We'll show the contact section in Home */}
      <Route path="/restaurant/:id" component={Restaurant} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/tracking/:id" component={Tracking} />
      <Route path="/confirmation" component={ConfirmationPage} /> {/* Added confirmation route */}

      {/* Information pages */}
      <Route path="/info/drone-delivery" component={DroneDeliveryPage} />
      <Route path="/info/fresh-organic" component={FreshOrganicPage} />
      <Route path="/info/easy-payments" component={EasyPaymentsPage} />

      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}
