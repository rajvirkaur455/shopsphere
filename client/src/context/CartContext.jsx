import { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext();

const STORAGE_KEY = "shopsphere_cart";

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const existing = state.find((item) => item.id === action.product.id);
      if (existing) {
        return state.map((item) =>
          item.id === action.product.id
            ? { ...item, quantity: item.quantity + (action.quantity || 1) }
            : item
        );
      }
      return [...state, { ...action.product, quantity: action.quantity || 1 }];
    }
    case "REMOVE":
      return state.filter((item) => item.id !== action.id);
    case "UPDATE_QTY":
      return state.map((item) =>
        item.id === action.id
          ? { ...item, quantity: Math.max(1, action.quantity) }
          : item
      );
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, undefined, loadCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product, quantity = 1) =>
    dispatch({ type: "ADD", product, quantity });
  const removeFromCart = (id) => dispatch({ type: "REMOVE", id });
  const updateQuantity = (id, quantity) =>
    dispatch({ type: "UPDATE_QTY", id, quantity });
  const clearCart = () => dispatch({ type: "CLEAR" });

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const savings = items.reduce(
    (sum, item) =>
      sum + (item.originalPrice - item.price) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        savings,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
