import React from 'react'
import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  className = '', 
  hover = true,
  glass = true,
  ...props 
}) => {
  const baseStyles = glass ? "glass-effect" : "bg-white border border-gray-200"
  const cardStyles = `
    ${baseStyles}
    rounded-3xl p-6 shadow-lg transition-all duration-300
    ${hover ? 'hover:shadow-xl hover:scale-[1.02]' : ''}
    ${className}
  `
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cardStyles}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card