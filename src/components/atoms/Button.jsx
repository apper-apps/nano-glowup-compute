import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl focus:ring-primary",
    secondary: "bg-white text-gray-700 border-2 border-gray-200 hover:border-primary hover:text-primary focus:ring-primary",
    accent: "bg-gradient-to-r from-accent to-primary text-white shadow-lg hover:shadow-xl focus:ring-accent",
    neumorphic: "neumorphic text-gray-700 hover:shadow-lg active:neumorphic-inset focus:ring-primary",
    ghost: "text-gray-600 hover:text-primary hover:bg-primary/10 focus:ring-primary"
  }
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  }
  
  const buttonStyles = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `
  
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={buttonStyles}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <ApperIcon name={icon} className="w-5 h-5 mr-2" />
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <ApperIcon name={icon} className="w-5 h-5 ml-2" />
      )}
    </motion.button>
  )
}

export default Button