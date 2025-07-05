import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'

const ProductCard = ({ product }) => {
  const navigate = useNavigate()
  
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