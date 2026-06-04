import { createContext, useEffect, useState } from "react";
import { getLocal, setLocal } from "../utils/localStorage";

export const FavoritesContext = createContext();

export default function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => getLocal("favorites", []));

  useEffect(() => {
    setLocal("favorites", favorites);
  }, [favorites]);

  const addFavorite = (movie) => {
    setFavorites((prev) => {
      const exists = prev.find((m) => m.imdbID === movie.imdbID);
      if (exists) return prev;
      return [...prev, movie];
    });
  };

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((m) => m.imdbID !== id));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}