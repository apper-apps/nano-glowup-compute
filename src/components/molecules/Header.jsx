import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Header = ({ title, subtitle, showNotification = true }) => {
  const currentHour = new Date().getHours()
  const getGreeting = () => {
    if (currentHour < 12) return 'Good morning'
    if (currentHour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-primary/10 to-secondary/10 px-6 py-8"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {title || `${getGreeting()}!`}
          </h1>
          {subtitle && (
            <p className="text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
        
        {showNotification && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 bg-white/50 backdrop-blur-sm rounded-full shadow-lg"
          >
            <ApperIcon name="Bell" className="w-6 h-6 text-gray-700" />
          </motion.button>
        )}
      </div>
    </motion.header>
  )
}

export default Header