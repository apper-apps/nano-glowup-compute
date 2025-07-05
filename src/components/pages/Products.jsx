import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/molecules/Header'
import ProductCard from '@/components/molecules/ProductCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { ProductService } from '@/services/api/ProductService'

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPriceRange, setSelectedPriceRange] = useState('all')

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await ProductService.getAll()
      setProducts(data)
    } catch (err) {
      setError('Failed to load products. Please try again.')
      console.error('Error loading products:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory
    
    let priceMatch = true
    if (selectedPriceRange !== 'all') {
      const [min, max] = selectedPriceRange.split('-').map(Number)
      priceMatch = product.price >= min && (max ? product.price <= max : true)
    }
    
    return categoryMatch && priceMatch
  })

  const categories = ['all', ...new Set(products.map(p => p.category))]
  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-25', label: 'Under $25' },
    { value: '25-50', label: '$25 - $50' },
    { value: '50-100', label: '$50 - $100' },
    { value: '100-999', label: '$100+' }
  ]

  if (loading) {
    return <Loading type="cards" />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Skincare Products" subtitle="Discover the best products for your skin" />
        <Error message={error} onRetry={loadProducts} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="Skincare Products" subtitle="Discover the best products for your skin" />
      
      <div className="px-6 py-6 space-y-6">
        {/* Filter Bar */}
        <div className="glass-effect rounded-3xl p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-xl font-display font-bold text-gray-800">
              Shop Premium Skincare
            </h2>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Tag" className="w-5 h-5 text-gray-600" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <ApperIcon name="DollarSign" className="w-5 h-5 text-gray-600" />
                <select
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  {priceRanges.map(range => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <Empty 
            title="No products found"
            description="Try adjusting your filters or check back later for new products"
            icon="ShoppingBag"
          />
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.Id} product={product} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Products