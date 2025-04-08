import { Link, useLocation } from "wouter";
import { FiHome, FiShoppingBag, FiUser, FiPhone, FiShoppingCart, FiX } from "react-icons/fi";
import { useEffect, useState } from "react";

type CartItem = {
  item: string;
  price: number;
  quantity: number;
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [total, setTotal] = useState(0);

  // Handle section navigation similar to the original template
  const showSection = (sectionId: string) => {
    document.querySelectorAll(".section").forEach(s => 
      s.classList.remove("active"));
    const section = document.getElementById(sectionId);
    if (section) section.classList.add("active");
  };
  
  // Load cart from localStorage and listen for cart updates
  useEffect(() => {
    // Function to load cart data
    const loadCartData = () => {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          setCartItems(parsedCart);
          calculateTotal(parsedCart);
        } catch (e) {
          console.error("Error parsing cart data", e);
        }
      }
    };
    
    // Load initial cart data
    loadCartData();
    
    // Set up listener for cart updates
    const handleCartUpdate = () => {
      loadCartData();
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);
  
  // Update total when cart changes
  const calculateTotal = (items: CartItem[]) => {
    const newTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(newTotal);
  };
  
  // Toggle cart sidebar
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
    const cartSidebar = document.querySelector(".cart-sidebar");
    if (cartSidebar) {
      cartSidebar.classList.toggle("active");
    }
  };
  
  // Remove item from cart
  const removeFromCart = (itemName: string) => {
    // Use the cartUtils function which will dispatch the proper event
    import('@/lib/cartUtils').then(cartUtils => {
      cartUtils.removeFromCart(itemName);
    });
  };
  
  // Redirect to checkout
  const redirectToCheckout = () => {
    // Use the cartUtils function to save cart
    import('@/lib/cartUtils').then(cartUtils => {
      cartUtils.saveCart(cartItems);
    });
    
    localStorage.setItem("total", total.toFixed(2));
    window.location.href = "/checkout";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <nav className="bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="text-2xl font-bold text-primary flex items-center gap-2 cursor-pointer"
            onClick={() => {
              showSection('home');
              window.history.pushState(null, '', '/');
            }}
          >
            <FiShoppingBag />
            QuickEats
          </div>
          <div className="flex gap-6">
            <div 
              className={`flex items-center gap-2 hover:text-primary cursor-pointer ${location === '/' ? 'text-primary' : ''}`}
              onClick={() => {
                showSection('home');
                window.history.pushState(null, '', '/');
              }}
            >
              <FiHome />
              Home
            </div>
            <div 
              className={`flex items-center gap-2 hover:text-primary cursor-pointer ${location === '/restaurants' ? 'text-primary' : ''}`}
              onClick={() => {
                showSection('restaurants');
                window.history.pushState(null, '', '/restaurants');
              }}
            >
              <FiShoppingBag />
              Restaurants
            </div>
            <div 
              className={`flex items-center gap-2 hover:text-primary cursor-pointer ${location === '/profile' ? 'text-primary' : ''}`}
              onClick={() => {
                showSection('profile');
                window.history.pushState(null, '', '/profile');
              }}
            >
              <FiUser />
              Profile
            </div>
            <div 
              className={`flex items-center gap-2 hover:text-primary cursor-pointer ${location === '/contact' ? 'text-primary' : ''}`}
              onClick={() => {
                showSection('contact');
                window.history.pushState(null, '', '/contact');
              }}
            >
              <FiPhone />
              Contact
            </div>
            <button 
              className="flex items-center gap-2 hover:text-primary relative"
              onClick={toggleCart}>
              <FiShoppingCart />
              Cart
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>
      
      <main className="flex-grow">
        <div className="page-container">
          <div className="main-content">
            {children}
          </div>
          
          <div className="cart-sidebar">
            <button className="close-cart" onClick={toggleCart}>
              <FiX />
            </button>
            <h2 className="text-xl font-semibold mb-4">Cart</h2>
            
            {cartItems.length === 0 ? (
              <p className="text-muted-foreground">Your cart is empty</p>
            ) : (
              <>
                <ul id="cart-items" className="space-y-2 mb-4">
                  {cartItems.map((item, idx) => (
                    <li key={idx} className="border-b pb-2 flex justify-between items-center">
                      <div>
                        {item.item} - ${item.price.toFixed(2)}
                        <span className="block text-sm text-muted-foreground">Qty: {item.quantity}</span>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.item)}
                        className="text-sm text-red-500 hover:text-red-700">
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
                <p className="text-lg font-semibold border-t pt-2">Total: $<span id="total">{total.toFixed(2)}</span></p>
                <button 
                  className="checkout"
                  onClick={redirectToCheckout}>
                  Proceed to Checkout
                </button>
              </>
            )}
          </div>
        </div>
      </main>
      
      <footer className="border-t py-6 text-center text-muted-foreground">
        QuickEats © 2025
      </footer>
    </div>
  );
}