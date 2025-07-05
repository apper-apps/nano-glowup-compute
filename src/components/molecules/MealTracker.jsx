import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import { toast } from 'react-toastify'

const MealTracker = ({ onUpdate }) => {
  const [healthyMeals, setHealthyMeals] = useState(0)
  const [unhealthyMeals, setUnhealthyMeals] = useState(0)

  useEffect(() => {
    const savedHealthy = localStorage.getItem('healthyMeals')
    const savedUnhealthy = localStorage.getItem('unhealthyMeals')
    
    if (savedHealthy) setHealthyMeals(parseInt(savedHealthy))
    if (savedUnhealthy) setUnhealthyMeals(parseInt(savedUnhealthy))
  }, [])

  const updateMeals = (type, value) => {
    if (type === 'healthy') {
      setHealthyMeals(value)
      localStorage.setItem('healthyMeals', value.toString())
    } else {
      setUnhealthyMeals(value)
      localStorage.setItem('unhealthyMeals', value.toString())
    }
    
    if (onUpdate) {
      onUpdate({ healthy: healthyMeals, unhealthy: unhealthyMeals })
    }
  }

  const resetMeals = () => {
    setHealthyMeals(0)
    setUnhealthyMeals(0)
    localStorage.setItem('healthyMeals', '0')
    localStorage.setItem('unhealthyMeals', '0')
    if (onUpdate) {
      onUpdate({ healthy: 0, unhealthy: 0 })
    }
  }

  return (
    <div className="glass-effect rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-display font-semibold text-gray-800">
          Meal Tracking
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetMeals}
          className="p-2 text-gray-500 hover:text-primary transition-colors"
        >
          <ApperIcon name="RotateCcw" className="w-5 h-5" />
        </motion.button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="w-16 h-16 bg-gradient-to-br from-success to-info rounded-full flex items-center justify-center">
              <ApperIcon name="Apple" className="w-8 h-8 text-white" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-2">Healthy Meals</p>
          <div className="text-2xl font-display font-bold text-success mb-3">
            {healthyMeals}
          </div>
          <div className="flex items-center justify-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => updateMeals('healthy', Math.max(0, healthyMeals - 1))}
              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
            >
              <ApperIcon name="Minus" className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => updateMeals('healthy', healthyMeals + 1)}
              className="w-8 h-8 bg-success rounded-full flex items-center justify-center hover:bg-success/80 transition-colors"
            >
              <ApperIcon name="Plus" className="w-4 h-4 text-white" />
            </motion.button>
          </div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="w-16 h-16 bg-gradient-to-br from-warning to-error rounded-full flex items-center justify-center">
              <ApperIcon name="Cookie" className="w-8 h-8 text-white" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-2">Unhealthy Meals</p>
          <div className="text-2xl font-display font-bold text-warning mb-3">
            {unhealthyMeals}
          </div>
          <div className="flex items-center justify-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => updateMeals('unhealthy', Math.max(0, unhealthyMeals - 1))}
              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
            >
              <ApperIcon name="Minus" className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => updateMeals('unhealthy', unhealthyMeals + 1)}
              className="w-8 h-8 bg-warning rounded-full flex items-center justify-center hover:bg-warning/80 transition-colors"
            >
              <ApperIcon name="Plus" className="w-4 h-4 text-white" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MealTracker