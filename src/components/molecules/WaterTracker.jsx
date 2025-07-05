import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import { toast } from 'react-toastify'

const WaterTracker = ({ onUpdate }) => {
  const [glasses, setGlasses] = useState(0)
  const targetGlasses = 8

  useEffect(() => {
    const saved = localStorage.getItem('waterGlasses')
    if (saved) {
      setGlasses(parseInt(saved))
    }
  }, [])

  const handleGlassClick = (index) => {
    const newGlasses = index + 1
    setGlasses(newGlasses)
    localStorage.setItem('waterGlasses', newGlasses.toString())
    
    if (onUpdate) {
      onUpdate(newGlasses)
    }
    
    if (newGlasses === targetGlasses) {
      toast.success('🎉 Daily water goal achieved!')
    }
  }

  const resetGlasses = () => {
    setGlasses(0)
    localStorage.setItem('waterGlasses', '0')
    if (onUpdate) {
      onUpdate(0)
    }
  }

  return (
    <div className="glass-effect rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-display font-semibold text-gray-800">
          Water Intake
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetGlasses}
          className="p-2 text-gray-500 hover:text-primary transition-colors"
        >
          <ApperIcon name="RotateCcw" className="w-5 h-5" />
        </motion.button>
      </div>
      
      <div className="text-center mb-6">
        <div className="text-3xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {glasses}/{targetGlasses}
        </div>
        <p className="text-sm text-gray-600">glasses today</p>
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: targetGlasses }).map((_, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleGlassClick(index)}
            className={`
              aspect-square rounded-2xl flex items-center justify-center transition-all duration-300
              ${index < glasses 
                ? 'bg-gradient-to-br from-info to-secondary shadow-lg' 
                : 'bg-gray-100 hover:bg-gray-200'
              }
            `}
          >
            <ApperIcon 
              name="Droplets" 
              className={`w-6 h-6 ${index < glasses ? 'text-white' : 'text-gray-400'}`}
            />
          </motion.button>
        ))}
      </div>
      
      <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(glasses / targetGlasses) * 100}%` }}
          className="h-full bg-gradient-to-r from-info to-secondary"
        />
      </div>
    </div>
  )
}

export default WaterTracker