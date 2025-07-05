import React from 'react'
import ApperIcon from '@/components/ApperIcon'

const Input = ({ 
  label, 
  type = 'text', 
  icon, 
  error, 
  className = '',
  ...props 
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} className="w-5 h-5 text-gray-400" />
          </div>
        )}
        
        <input
          type={type}
          className={`
            block w-full rounded-2xl border-2 border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400
            focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none
            transition-colors duration-200
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-error focus:border-error focus:ring-error/20' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      
      {error && (
        <p className="text-sm text-error flex items-center">
          <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  )
}

export default Input