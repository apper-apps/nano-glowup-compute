import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Header from '@/components/molecules/Header'
import ProductCard from '@/components/molecules/ProductCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { FavoritesService } from '@/services/api/FavoritesService'
import { ProductService } from '@/services/api/ProductService'

const Favorites = () => {
  const [favorites, setFavorites] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Get favorite product IDs
      const favoriteIds = await FavoritesService.getAll()
      setFavorites(favoriteIds)
      
      if (favoriteIds.length > 0) {
        // Get all products and filter favorites
        const allProducts = await ProductService.getAll()
        const favoriteProducts = allProducts.filter(product => 
          favoriteIds.includes(product.Id)
        )
        setProducts(favoriteProducts)
      } else {
        setProducts([])
      }
    } catch (err) {
      setError('Failed to load favorite products. Please try again.')
      console.error('Error loading favorites:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFavoriteUpdate = () => {
    // Reload favorites when a product is unfavorited
    loadFavorites()
    toast.success('Favorites updated')
  }

  if (loading) {
    return <Loading type="cards" />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="My Favorites" subtitle="Your saved products" />
        <Error message={error} onRetry={loadFavorites} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="My Favorites" subtitle="Your saved products" />
      
      <div className="px-6 py-6 space-y-6">
        {/* Stats */}
        <div className="glass-effect rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-display font-bold text-gray-800">
                Favorite Products
              </h2>
              <p className="text-gray-600 mt-1">
                {products.length} {products.length === 1 ? 'product' : 'products'} saved
              </p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center">
              <span className="text-2xl font-display font-bold text-white">
                {products.length}
              </span>
            </div>
          </div>
        </div>

        {/* Favorites Grid */}
        {products.length === 0 ? (
          <Empty 
            title="No favorites yet"
            description="Start favoriting products to see them here. Tap the heart icon on any product!"
            icon="Heart"
          />
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {products.map((product) => (
              <ProductCard 
                key={product.Id} 
                product={product} 
                onFavoriteUpdate={handleFavoriteUpdate}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Favorites