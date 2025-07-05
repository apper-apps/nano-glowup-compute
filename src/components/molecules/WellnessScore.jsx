import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const WellnessScore = ({ score = 0 }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success'
    if (score >= 60) return 'text-warning'
    return 'text-error'
  }

  const getScoreMessage = (score) => {
    if (score >= 80) return 'Excellent! Keep it up!'
    if (score >= 60) return 'Good progress!'
    if (score >= 40) return 'Getting there!'
    return 'Let\'s improve together!'
  }

  return (
    <div className="glass-effect rounded-3xl p-6 text-center">
      <h3 className="text-lg font-display font-semibold text-gray-800 mb-4">
        Today's Wellness Score
      </h3>
      
      <div className="relative w-32 h-32 mx-auto mb-4">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 40}`}
            strokeDashoffset={`${2 * Math.PI * 40 * (1 - score / 100)}`}
            className="text-primary"
            initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - score / 100) }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`text-3xl font-display font-bold ${getScoreColor(score)}`}>
              {score}
            </div>
            <div className="text-sm text-gray-600">out of 100</div>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        {getScoreMessage(score)}
      </p>
      
      <div className="flex items-center justify-center space-x-2">
        <ApperIcon name="TrendingUp" className="w-5 h-5 text-primary" />
        <span className="text-sm text-primary font-medium">
          Track daily to improve
        </span>
      </div>
    </div>
  )
}

export default WellnessScore