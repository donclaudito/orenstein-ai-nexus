import { useState, useCallback } from 'react';

const STORAGE_KEY = 'orenstein_app_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  const toggleFavorite = useCallback((appId) => {
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(appId) ? next.delete(appId) : next.add(appId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  const isFavorite = useCallback((appId) => favorites.has(appId), [favorites]);

  return { favorites, toggleFavorite, isFavorite };
}