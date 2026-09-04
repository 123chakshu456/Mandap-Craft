import { useState } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  type: 'events' | 'boutique';
  quantity: number;
}

export function useCart(showToast: (msg: string) => void) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [shortlist, setShortlist] = useState<string[]>([]);

  const handleAddToCart = (
    item: { id: string; name: string; price: number; image: string },
    type: 'events' | 'boutique' = 'events'
  ) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        showToast(`Increased quantity of "${item.name}" to ${existing.quantity + 1}! 📥`);
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      showToast(`"${item.name}" added to booking cart! ✨`);
      return [...prev, { ...item, type, quantity: 1 }];
    });
  };

  const handleDecrementCart = (id: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === id);
      if (!existing) return prev;
      if (existing.quantity > 1) {
        showToast(`Decreased quantity of "${existing.name}" to ${existing.quantity - 1}.`);
        return prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i);
      }
      showToast(`Removed "${existing.name}" from your cart.`);
      return prev.filter(i => i.id !== id);
    });
  };

  const handleRemoveFromCart = (id: string) => {
    const existing = cart.find(i => i.id === id);
    if (existing) {
      setCart(prev => prev.filter(i => i.id !== id));
      showToast(`Removed "${existing.name}" from your cart.`);
    }
  };

  const handleToggleShortlist = (id: string, name: string) => {
    setShortlist(prev => {
      if (prev.includes(id)) {
        showToast(`Removed "${name}" from favorites.`);
        return prev.filter(itemId => itemId !== id);
      } else {
        showToast(`Added "${name}" to your favorites! ❤️`);
        return [...prev, id];
      }
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  return {
    cart,
    setCart,
    shortlist,
    handleAddToCart,
    handleDecrementCart,
    handleRemoveFromCart,
    handleToggleShortlist,
    clearCart,
  };
}

export default useCart;
