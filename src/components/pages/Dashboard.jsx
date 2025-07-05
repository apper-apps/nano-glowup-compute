import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/molecules/Header'
import WellnessScore from '@/components/molecules/WellnessScore'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import Loading from '@/components/ui/Loading'
import { ExerciseService } from '@/services/api/ExerciseService'

const Dashboard = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [todayStats, setTodayStats] = useState({
    waterGlasses: 0,
    healthyMeals: 0,
    unhealthyMeals: 0,
    exercisesCompleted: 0,
    wellnessScore: 0
  })
  const [recentExercises, setRecentExercises] = useState([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load today's stats from localStorage
      const waterGlasses = parseInt(localStorage.getItem('waterGlasses') || '0')
      const healthyMeals = parseInt(localStorage.getItem('healthyMeals') || '0')
      const unhealthyMeals = parseInt(localStorage.getItem('unhealthyMeals') || '0')
      const completedExercises = JSON.parse(localStorage.getItem('completedExercises') || '[]')
      
      // Calculate wellness score
      const waterScore = Math.min((waterGlasses / 8) * 30, 30)
      const mealScore = Math.min((healthyMeals / 3) * 25, 25) - Math.min(unhealthyMeals * 5, 15)
      const exerciseScore = Math.min((completedExercises.length / 3) * 45, 45)
      const wellnessScore = Math.max(0, Math.round(waterScore + mealScore + exerciseScore))
      
      setTodayStats({
        waterGlasses,
        healthyMeals,
        unhealthyMeals,
        exercisesCompleted: completedExercises.length,
        wellnessScore
      })
      
      // Load recent exercises
      const exercises = await ExerciseService.getAll()
      setRecentExercises(exercises.slice(0, 3))
      
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    {
      title: 'Start Exercise',
      icon: 'Dumbbell',
      color: 'from-primary to-secondary',
      action: () => navigate('/exercises')
    },
    {
      title: 'Track Water',
      icon: 'Droplets',
      color: 'from-info to-secondary',
      action: () => navigate('/track')
    },
    {
      title: 'Shop Products',
      icon: 'ShoppingBag',
      color: 'from-accent to-primary',
      action: () => navigate('/products')
    },
    {
      title: 'View Profile',
      icon: 'User',
      color: 'from-secondary to-accent',
      action: () => navigate('/profile')
    }
  ]

  if (loading) {
    return <Loading type="dashboard" />
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="px-6 py-6 space-y-6">
        {/* Today's Overview */}
        <Card>
          <h2 className="text-2xl font-display font-bold text-gray-800 mb-6">
            Today's Overview
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-info to-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Droplets" className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-display font-bold text-gray-800">
                {todayStats.waterGlasses}/8
              </div>
              <div className="text-sm text-gray-600">Water Glasses</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-success to-info rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Apple" className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-display font-bold text-gray-800">
                {todayStats.healthyMeals}
              </div>
              <div className="text-sm text-gray-600">Healthy Meals</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Dumbbell" className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-display font-bold text-gray-800">
                {todayStats.exercisesCompleted}
              </div>
              <div className="text-sm text-gray-600">Exercises Done</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="TrendingUp" className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-display font-bold text-gray-800">
                {todayStats.wellnessScore}
              </div>
              <div className="text-sm text-gray-600">Wellness Score</div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card>
          <h2 className="text-2xl font-display font-bold text-gray-800 mb-6">
            Quick Actions
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={action.action}
                className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-200"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <ApperIcon name={action.icon} className="w-6 h-6 text-white" />
                </div>
                <div className="text-sm font-medium text-gray-800">
                  {action.title}
                </div>
              </motion.button>
            ))}
          </div>
        </Card>

        {/* Recent Exercises */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold text-gray-800">
              Today's Exercises
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/exercises')}
              icon="ArrowRight"
              iconPosition="right"
            >
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {recentExercises.map((exercise) => (
              <motion.div
                key={exercise.Id}
                whileHover={{ x: 5 }}
                onClick={() => navigate(`/exercises/${exercise.Id}`)}
                className="flex items-center space-x-4 p-4 bg-gradient-to-r from-white to-gray-50 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <ApperIcon name="Play" className="w-6 h-6 text-white" />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-gray-800">
                    {exercise.name}
                  </h3>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <span className="flex items-center">
                      <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
                      {exercise.duration} min
                    </span>
                    <span className="text-primary font-medium">
                      {exercise.difficulty}
                    </span>
                  </div>
                </div>
                
                <ApperIcon name="ArrowRight" className="w-5 h-5 text-gray-400" />
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Wellness Score */}
        <WellnessScore score={todayStats.wellnessScore} />
      </div>
    </div>
  )
}

export default Dashboard