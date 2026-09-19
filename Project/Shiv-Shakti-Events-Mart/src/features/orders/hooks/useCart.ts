import { useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  type: 'events' | 'boutique';
  quantity: number;
  pricingUnit?: 'FIXED' | 'PER_SQFT';
  selectedSqFt?: number;
  dimensionsNote?: string;
  unitPrice?: number;
}

const CART_STORAGE_KEY = 'shiv_shakti_cart';
const SHORTLIST_STORAGE_KEY = 'shiv_shakti_shortlist';

export function useCart(showToast: (msg: string) => void) {
  // Hydrate cart from localStorage on mount
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Hydrate shortlist from localStorage on mount
  const [shortlist, setShortlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(SHORTLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Automatically synchronize cart with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
      console.warn('Failed to save cart to localStorage:', err);
    }
  }, [cart]);

  // Automatically synchronize shortlist with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SHORTLIST_STORAGE_KEY, JSON.stringify(shortlist));
    } catch (err) {
      console.warn('Failed to save shortlist to localStorage:', err);
    }
  }, [shortlist]);

  const handleAddToCart = (
    item: { id: string; name: string; price: number; image: string; [key: string]: any },
    type: 'events' | 'boutique' = 'events',
    customArea?: { selectedSqFt: number; dimensionsNote?: string; calculatedPrice: number }
  ) => {
    setCart(prev => {
      // If customArea is provided (per sq.ft), item key is unique to that size
      const targetId = customArea ? `${item.id}-${customArea.selectedSqFt}sqft` : item.id;
      const targetPrice = customArea ? customArea.calculatedPrice : item.price;
      const dimensionsNote = customArea
        ? `${customArea.selectedSqFt} sq.ft${customArea.dimensionsNote ? ` (${customArea.dimensionsNote})` : ''}`
        : undefined;

      const existing = prev.find(i => i.id === targetId);
      if (existing) {
        showToast(`Increased quantity of "${existing.name}" to ${existing.quantity + 1}! 📥`);
        return prev.map(i => i.id === targetId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      const displayName = customArea ? `${item.name} (${customArea.selectedSqFt} sq.ft)` : item.name;
      showToast(`"${displayName}" added to booking cart! ✨`);
      return [
        ...prev,
        {
          ...item,
          id: targetId,
          name: displayName,
          price: targetPrice,
          type,
          quantity: 1,
          pricingUnit: item.pricingUnit || (customArea ? 'PER_SQFT' : 'FIXED'),
          selectedSqFt: customArea?.selectedSqFt,
          dimensionsNote,
          unitPrice: item.price,
        },
      ];
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
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {
      // Non-blocking
    }
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
