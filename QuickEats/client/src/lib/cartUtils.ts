/**
 * Cart utility functions for QuickEats
 */

export type CartItem = {
  item: string;
  price: number;
  quantity: number;
};

export function addToCart(item: string, price: number): CartItem[] {
  let cart: CartItem[] = getCart();
  
  const existingItem = cart.find(c => c.item === item);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ item, price, quantity: 1 });
  }
  
  saveCart(cart);
  return cart;
}

export function removeFromCart(item: string): CartItem[] {
  let cart = getCart();
  cart = cart.filter(c => c.item !== item);
  saveCart(cart);
  return cart;
}

export function getCart(): CartItem[] {
  try {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error('Error loading cart from local storage', error);
    return [];
  }
}

export function saveCart(cart: CartItem[]): void {
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Dispatch a custom event to notify listeners that cart has been updated
  const event = new CustomEvent('cartUpdated', { detail: cart });
  window.dispatchEvent(event);
}

export function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

export function clearCart(): void {
  localStorage.removeItem('cart');
  
  // Dispatch a custom event to notify listeners that cart has been cleared
  const event = new CustomEvent('cartUpdated', { detail: [] });
  window.dispatchEvent(event);
}