import React from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const BottomNav = () => {
const navItems = [
    { path: '/', icon: 'Home', label: 'Dashboard' },
    { path: '/exercises', icon: 'Dumbbell', label: 'Exercises' },
    { path: '/products', icon: 'ShoppingBag', label: 'Products' },
    { path: '/favorites', icon: 'Heart', label: 'Favorites' },
    { path: '/track', icon: 'Activity', label: 'Track' },
    { path: '/profile', icon: 'User', label: 'Profile' }
  ]
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-200 z-50">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-200 ${
                isActive 
                  ? 'text-primary bg-primary/10' 
                  : 'text-gray-500 hover:text-primary hover:bg-primary/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative"
                >
                  <ApperIcon name={item.icon} className="w-6 h-6" />
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"
                    />
                  )}
                </motion.div>
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default BottomNav