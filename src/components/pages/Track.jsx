import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/molecules/Header'
import WaterTracker from '@/components/molecules/WaterTracker'
import MealTracker from '@/components/molecules/MealTracker'
import WellnessScore from '@/components/molecules/WellnessScore'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'

const Track = () => {
  const [todayStats, setTodayStats] = useState({
    waterGlasses: 0,
    healthyMeals: 0,
    unhealthyMeals: 0,
    wellnessScore: 0
  })
  const [weeklyStats, setWeeklyStats] = useState([])

  useEffect(() => {
    loadTrackingData()
  }, [])

  const loadTrackingData = () => {
    const waterGlasses = parseInt(localStorage.getItem('waterGlasses') || '0')
    const healthyMeals = parseInt(localStorage.getItem('healthyMeals') || '0')
    const unhealthyMeals = parseInt(localStorage.getItem('unhealthyMeals') || '0')
    
    // Calculate wellness score
    const waterScore = Math.min((waterGlasses / 8) * 30, 30)
    const mealScore = Math.min((healthyMeals / 3) * 25, 25) - Math.min(unhealthyMeals * 5, 15)
    const exerciseScore = Math.min((JSON.parse(localStorage.getItem('completedExercises') || '[]').length / 3) * 45, 45)
    const wellnessScore = Math.max(0, Math.round(waterScore + mealScore + exerciseScore))
    
    setTodayStats({
      waterGlasses,
      healthyMeals,
      unhealthyMeals,
      wellnessScore
    })
    
    // Generate mock weekly data
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const weekly = days.map((day, index) => ({
      day,
      water: Math.floor(Math.random() * 8) + 1,
      meals: Math.floor(Math.random() * 4) + 1,
      score: Math.floor(Math.random() * 40) + 60
    }))
    setWeeklyStats(weekly)
  }

  const handleWaterUpdate = (glasses) => {
    setTodayStats(prev => ({
      ...prev,
      waterGlasses: glasses
    }))
    updateWellnessScore()
  }

  const handleMealUpdate = (meals) => {
    setTodayStats(prev => ({
      ...prev,
      healthyMeals: meals.healthy,
      unhealthyMeals: meals.unhealthy
    }))
    updateWellnessScore()
  }

  const updateWellnessScore = () => {
    setTimeout(() => {
      const waterGlasses = parseInt(localStorage.getItem('waterGlasses') || '0')
      const healthyMeals = parseInt(localStorage.getItem('healthyMeals') || '0')
      const unhealthyMeals = parseInt(localStorage.getItem('unhealthyMeals') || '0')
      
      const waterScore = Math.min((waterGlasses / 8) * 30, 30)
      const mealScore = Math.min((healthyMeals / 3) * 25, 25) - Math.min(unhealthyMeals * 5, 15)
      const exerciseScore = Math.min((JSON.parse(localStorage.getItem('completedExercises') || '[]').length / 3) * 45, 45)
      const wellnessScore = Math.max(0, Math.round(waterScore + mealScore + exerciseScore))
      
      setTodayStats(prev => ({
        ...prev,
        wellnessScore
      }))
    }, 100)
  }

  const achievements = [
    { 
      title: 'Hydration Hero', 
      description: 'Drink 8 glasses of water daily',
      completed: todayStats.waterGlasses >= 8,
      icon: 'Droplets'
    },
    { 
      title: 'Nutrition Champion', 
      description: 'Eat 3 healthy meals daily',
      completed: todayStats.healthyMeals >= 3,
      icon: 'Apple'
    },
    { 
      title: 'Wellness Warrior', 
      description: 'Score 80+ on wellness tracker',
      completed: todayStats.wellnessScore >= 80,
      icon: 'Trophy'
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header title="Daily Tracking" subtitle="Monitor your wellness journey" />
      
      <div className="px-6 py-6 space-y-6">
        {/* Today's Tracking */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <WaterTracker onUpdate={handleWaterUpdate} />
          <MealTracker onUpdate={handleMealUpdate} />
        </div>

        {/* Wellness Score */}
        <WellnessScore score={todayStats.wellnessScore} />

        {/* Weekly Progress */}
        <Card>
          <h3 className="text-xl font-display font-semibold text-gray-800 mb-6">
            Weekly Progress
          </h3>
          
          <div className="grid grid-cols-7 gap-2">
            {weeklyStats.map((day, index) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-sm font-medium text-gray-600 mb-2">
                  {day.day}
                </div>
                
                <div className="space-y-2">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-info to-secondary rounded-full"
                      style={{ width: `${(day.water / 8) * 100}%` }}
                    />
                  </div>
                  
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-success to-info rounded-full"
                      style={{ width: `${(day.meals / 4) * 100}%` }}
                    />
                  </div>
                  
                  <div className="text-xs text-gray-600">
                    {day.score}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="flex items-center justify-center space-x-6 mt-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-info to-secondary rounded-full"></div>
              <span className="text-gray-600">Water</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-success to-info rounded-full"></div>
              <span className="text-gray-600">Meals</span>
            </div>
          </div>
        </Card>

        {/* Achievements */}
        <Card>
          <h3 className="text-xl font-display font-semibold text-gray-800 mb-6">
            Today's Achievements
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  p-4 rounded-2xl border-2 transition-all duration-300
                  ${achievement.completed 
                    ? 'bg-gradient-to-br from-success/10 to-info/10 border-success' 
                    : 'bg-gray-50 border-gray-200'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${achievement.completed 
                      ? 'bg-gradient-to-br from-success to-info' 
                      : 'bg-gray-200'
                    }
                  `}>
                    <ApperIcon 
                      name={achievement.icon} 
                      className={`w-5 h-5 ${achievement.completed ? 'text-white' : 'text-gray-400'}`}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-display font-semibold text-gray-800">
                      {achievement.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {achievement.description}
                    </p>
                  </div>
                  
                  {achievement.completed && (
                    <ApperIcon name="CheckCircle" className="w-6 h-6 text-success" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Track