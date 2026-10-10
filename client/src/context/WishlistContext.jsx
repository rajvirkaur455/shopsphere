import { createContext, useContext, useReducer, useEffect } from "react";

const WishlistContext = createContext();

const STORAGE_KEY = "shopsphere_wishlist";

function loadWishlist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function wishlistReducer(state, action) {
  switch (action.type) {
    case "TOGGLE": {
      const exists = state.find((item) => item.id === action.product.id);
      if (exists) {
        return state.filter((item) => item.id !== action.product.id);
      }
      return [...state, action.product];
    }
    case "REMOVE":
      return state.filter((item) => item.id !== action.id);
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

export function WishlistProvider({ children }) {
  const [items, dispatch] = useReducer(wishlistReducer, undefined, loadWishlist);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const toggleWishlist = (product) =>
    dispatch({ type: "TOGGLE", product });
  const removeFromWishlist = (id) => dispatch({ type: "REMOVE", id });
  const clearWishlist = () => dispatch({ type: "CLEAR" });

  const isInWishlist = (id) => items.some((item) => item.id === id);
  const count = items.length;

  return (
    <WishlistContext.Provider
      value={{
        items,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
        count,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
