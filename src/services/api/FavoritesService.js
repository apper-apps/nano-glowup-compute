const FAVORITES_KEY = 'glowup_favorites'

export const FavoritesService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const favorites = localStorage.getItem(FAVORITES_KEY)
    return favorites ? JSON.parse(favorites) : []
  },

  add: async (productId) => {
    await new Promise(resolve => setTimeout(resolve, 250))
    const favorites = await FavoritesService.getAll()
    if (!favorites.includes(productId)) {
      const updatedFavorites = [...favorites, productId]
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites))
      return true
    }
    return false
  },

  remove: async (productId) => {
    await new Promise(resolve => setTimeout(resolve, 250))
    const favorites = await FavoritesService.getAll()
    const updatedFavorites = favorites.filter(id => id !== productId)
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites))
    return true
  },

  isFavorite: async (productId) => {
    const favorites = await FavoritesService.getAll()
    return favorites.includes(productId)
  }
}