import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'

const ExerciseCard = ({ exercise, completed = false, onToggleComplete }) => {
  const navigate = useNavigate()
  
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-success'
      case 'medium': return 'text-warning'
      case 'hard': return 'text-error'
      default: return 'text-gray-600'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
    >
      <Card className="relative overflow-hidden cursor-pointer">
        <div className="absolute top-4 right-4 z-10">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              onToggleComplete?.(exercise.Id)
            }}
            className={`
              w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200
              ${completed 
                ? 'bg-success text-white shadow-lg' 
                : 'bg-white/50 text-gray-400 hover:bg-white/80'
              }
            `}
          >
            <ApperIcon name="Check" className="w-5 h-5" />
          </motion.button>
        </div>
        
        <div 
          className="space-y-4"
          onClick={() => navigate(`/exercises/${exercise.Id}`)}
        >
          <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center">
            <img 
              src={exercise.imageUrl} 
              alt={exercise.name}
              className="w-full h-full object-cover rounded-2xl"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }}
            />
            <div className="w-full h-full hidden items-center justify-center">
              <ApperIcon name="Play" className="w-16 h-16 text-primary" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-display font-semibold text-gray-800">
              {exercise.name}
            </h3>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm text-gray-600">
                  <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
                  {exercise.duration} min
                </div>
                <div className={`text-sm font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                  {exercise.difficulty}
                </div>
              </div>
              
              <ApperIcon name="ArrowRight" className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {exercise.benefits?.slice(0, 2).map((benefit, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full"
                >
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default ExerciseCard