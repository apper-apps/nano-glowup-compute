import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ message = "Something went wrong", onRetry, showRetry = true }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className="w-24 h-24 bg-gradient-to-br from-error to-accent rounded-full flex items-center justify-center mb-6">
        <ApperIcon name="AlertCircle" className="w-12 h-12 text-white" />
      </div>
      
      <h3 className="text-2xl font-display font-semibold text-gray-800 mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {message}
      </p>
      
      {showRetry && onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-full font-medium transition-all duration-200 hover:shadow-lg"
        >
          Try Again
        </motion.button>
      )}
    </motion.div>
  )
}

export default Error