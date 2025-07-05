import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import { FavoritesService } from '@/services/api/FavoritesService'
const ProductCard = ({ product, onFavoriteUpdate }) => {
  const navigate = useNavigate()
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)

  useEffect(() => {
    checkFavoriteStatus()
  }, [product.Id])

  const checkFavoriteStatus = async () => {
    try {
      const favorite = await FavoritesService.isFavorite(product.Id)
      setIsFavorite(favorite)
    } catch (error) {
      console.error('Error checking favorite status:', error)
    }
  }

  const handleFavoriteToggle = async (e) => {
    e.stopPropagation()
    
    try {
      setFavoriteLoading(true)
      
      if (isFavorite) {
        await FavoritesService.remove(product.Id)
        setIsFavorite(false)
        toast.success('Removed from favorites')
      } else {
        await FavoritesService.add(product.Id)
        setIsFavorite(true)
        toast.success('Added to favorites')
      }
      
      // Notify parent component if callback provided
      if (onFavoriteUpdate) {
        onFavoriteUpdate()
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      toast.error('Failed to update favorites')
    } finally {
      setFavoriteLoading(false)
    }
  }
  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <ApperIcon
        key={index}
        name="Star"
        className={`w-4 h-4 ${
          index < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
    >
<Card className="cursor-pointer h-full flex flex-col">
        <div className="relative">
          <button
            onClick={handleFavoriteToggle}
            disabled={favoriteLoading}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 disabled:opacity-50"
          >
            <ApperIcon 
              name="Heart" 
              className={`w-5 h-5 transition-colors duration-200 ${
                isFavorite 
                  ? 'text-red-500 fill-current' 
                  : 'text-gray-400 hover:text-red-500'
              }`}
            />
          </button>
        </div>
        
        <div 
          className="space-y-4 flex-1"
          onClick={() => navigate(`/products/${product.Id}`)}
        >
          <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center overflow-hidden">
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full h-full object-cover rounded-2xl"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }}
            />
            <div className="w-full h-full hidden items-center justify-center">
              <ApperIcon name="Package" className="w-16 h-16 text-primary" />
            </div>
          </div>
          
          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{product.brand}</span>
              <div className="flex items-center space-x-1">
                {renderStars(product.rating)}
                <span className="text-sm text-gray-600 ml-1">({product.rating})</span>
              </div>
            </div>
            
            <h3 className="text-lg font-display font-semibold text-gray-800 line-clamp-2">
              {product.name}
            </h3>
            
            <div className="flex items-center justify-between">
              <div className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                ${product.price}
              </div>
              <span className="px-3 py-1 bg-accent/10 text-accent text-sm rounded-full">
                {product.category}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Button
            variant="primary"
            className="w-full"
            icon="ExternalLink"
            onClick={(e) => {
              e.stopPropagation()
              window.open(product.shopUrl, '_blank')
            }}
          >
            Shop Now
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}

export default ProductCard