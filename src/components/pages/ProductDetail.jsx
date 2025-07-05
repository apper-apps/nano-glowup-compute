import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Header from '@/components/molecules/Header'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { ProductService } from '@/services/api/ProductService'
import { FavoritesService } from '@/services/api/FavoritesService'
const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [relatedProducts, setRelatedProducts] = useState([])
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)
useEffect(() => {
    loadProduct()
  }, [id])

  useEffect(() => {
    if (product) {
      checkFavoriteStatus()
    }
  }, [product])

  const checkFavoriteStatus = async () => {
    try {
      const favorite = await FavoritesService.isFavorite(product.Id)
      setIsFavorite(favorite)
    } catch (error) {
      console.error('Error checking favorite status:', error)
    }
  }

  const handleFavoriteToggle = async () => {
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
    } catch (error) {
      console.error('Error toggling favorite:', error)
      toast.error('Failed to update favorites')
    } finally {
      setFavoriteLoading(false)
    }
  }
  const loadProduct = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await ProductService.getById(parseInt(id))
      setProduct(data)
      
      // Load related products
      const allProducts = await ProductService.getAll()
      const related = allProducts
        .filter(p => p.Id !== data.Id && p.category === data.category)
        .slice(0, 3)
      setRelatedProducts(related)
    } catch (err) {
      setError('Failed to load product details. Please try again.')
      console.error('Error loading product:', err)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <ApperIcon
        key={index}
        name="Star"
        className={`w-5 h-5 ${
          index < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ))
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Product Details" />
        <Error message={error} onRetry={loadProduct} />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Product Details" />
        <Error message="Product not found" showRetry={false} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title={product.name} />
      
      <div className="px-6 py-6 space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          icon="ArrowLeft"
          className="mb-4"
        >
          Back to Products
        </Button>

        {/* Product Overview */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                <ApperIcon name="Package" className="w-24 h-24 text-primary" />
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="text-sm text-gray-500 mb-1">{product.brand}</div>
                <h1 className="text-3xl font-display font-bold text-gray-800 mb-4">
                  {product.name}
                </h1>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    {renderStars(product.rating)}
                    <span className="text-lg font-medium text-gray-600 ml-2">
                      ({product.rating})
                    </span>
                  </div>
                  <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
                    {product.category}
                  </span>
                </div>
                
                <div className="text-4xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
                  ${product.price}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-display font-semibold text-gray-800 mb-3">
                  Suitable For
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.skinType?.map((type, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                    >
                      {type} Skin
                    </span>
                  ))}
                </div>
              </div>
              
<div className="pt-4 space-y-3">
                <div className="flex gap-3">
                  <Button
                    variant="primary"
                    size="lg"
                    className="flex-1"
                    icon="ExternalLink"
                    onClick={() => window.open(product.shopUrl, '_blank')}
                  >
                    Shop Now - ${product.price}
                  </Button>
                  <Button
                    variant={isFavorite ? "secondary" : "outline"}
                    size="lg"
                    className="px-4"
                    onClick={handleFavoriteToggle}
                    disabled={favoriteLoading}
                  >
                    <ApperIcon 
                      name="Heart" 
                      className={`w-5 h-5 ${
                        isFavorite 
                          ? 'text-red-500 fill-current' 
                          : 'text-gray-500'
                      }`}
                    />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Product Features */}
        <Card>
          <h3 className="text-xl font-display font-semibold text-gray-800 mb-6">
            Product Features
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <ApperIcon name="Droplets" className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-gray-800">Hydrating Formula</h4>
                  <p className="text-sm text-gray-600">Deeply moisturizes and nourishes your skin</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-success to-info rounded-full flex items-center justify-center">
                  <ApperIcon name="Leaf" className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-gray-800">Natural Ingredients</h4>
                  <p className="text-sm text-gray-600">Made with premium natural and organic ingredients</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center">
                  <ApperIcon name="Shield" className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-gray-800">Gentle & Safe</h4>
                  <p className="text-sm text-gray-600">Suitable for sensitive skin, dermatologist tested</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-warning to-error rounded-full flex items-center justify-center">
                  <ApperIcon name="Sun" className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-gray-800">UV Protection</h4>
                  <p className="text-sm text-gray-600">Provides protection against harmful UV rays</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-info to-secondary rounded-full flex items-center justify-center">
                  <ApperIcon name="Clock" className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-gray-800">Long-lasting</h4>
                  <p className="text-sm text-gray-600">All-day protection and hydration</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center">
                  <ApperIcon name="Heart" className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-gray-800">Cruelty-Free</h4>
                  <p className="text-sm text-gray-600">Not tested on animals, ethically produced</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* How to Use */}
        <Card>
          <h3 className="text-xl font-display font-semibold text-gray-800 mb-6">
            How to Use
          </h3>
          
          <div className="space-y-4">
            {[
              'Cleanse your face with a gentle cleanser',
              'Apply a small amount to your fingertips',
              'Gently massage into skin in upward circular motions',
              'Allow to absorb for 2-3 minutes',
              'Follow with sunscreen during the day'
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-4 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <p className="text-gray-800 flex-1">{step}</p>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <Card>
            <h3 className="text-xl font-display font-semibold text-gray-800 mb-6">
              Similar Products
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <motion.div
                  key={relatedProduct.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  onClick={() => navigate(`/products/${relatedProduct.Id}`)}
                  className="cursor-pointer"
                >
                  <div className="glass-effect rounded-2xl p-4 hover:shadow-lg transition-all duration-300">
                    <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center overflow-hidden mb-4">
                      <img 
                        src={relatedProduct.imageUrl} 
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover rounded-xl"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                      <div className="w-full h-full hidden items-center justify-center">
                        <ApperIcon name="Package" className="w-12 h-12 text-primary" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-display font-semibold text-gray-800 line-clamp-2">
                        {relatedProduct.name}
                      </h4>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">
                          ${relatedProduct.price}
                        </span>
                        <div className="flex items-center space-x-1">
                          {renderStars(relatedProduct.rating)}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

export default ProductDetail