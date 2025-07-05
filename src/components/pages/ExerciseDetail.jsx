import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '@/components/molecules/Header'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { ExerciseService } from '@/services/api/ExerciseService'
import { toast } from 'react-toastify'

const ExerciseDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [exercise, setExercise] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    loadExercise()
  }, [id])

  useEffect(() => {
    let interval = null
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false)
      handleStepComplete()
    }
    return () => clearInterval(interval)
  }, [isRunning, timeLeft])

  const loadExercise = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await ExerciseService.getById(parseInt(id))
      setExercise(data)
      
      // Check if exercise is completed
      const completedExercises = JSON.parse(localStorage.getItem('completedExercises') || '[]')
      setIsCompleted(completedExercises.includes(data.Id))
    } catch (err) {
      setError('Failed to load exercise details. Please try again.')
      console.error('Error loading exercise:', err)
    } finally {
      setLoading(false)
    }
  }

  const startExercise = () => {
    setCurrentStep(0)
    setTimeLeft(30) // 30 seconds per step
    setIsRunning(true)
  }

  const handleStepComplete = () => {
    if (currentStep < exercise.steps.length - 1) {
      setCurrentStep(currentStep + 1)
      setTimeLeft(30)
      setIsRunning(true)
    } else {
      // Exercise completed
      handleExerciseComplete()
    }
  }

  const handleExerciseComplete = () => {
    const completedExercises = JSON.parse(localStorage.getItem('completedExercises') || '[]')
    if (!completedExercises.includes(exercise.Id)) {
      completedExercises.push(exercise.Id)
      localStorage.setItem('completedExercises', JSON.stringify(completedExercises))
      setIsCompleted(true)
      toast.success('🎉 Exercise completed! Great job!')
    }
  }

  const pauseExercise = () => {
    setIsRunning(false)
  }

  const resumeExercise = () => {
    setIsRunning(true)
  }

  const resetExercise = () => {
    setIsRunning(false)
    setTimeLeft(0)
    setCurrentStep(0)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
      case 'beginner': return 'text-success'
      case 'medium': 
      case 'intermediate': return 'text-warning'
      case 'hard':
      case 'advanced': return 'text-error'
      default: return 'text-gray-600'
    }
  }

  const getDifficultyDisplayName = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'Beginner'
      case 'medium': return 'Intermediate'
      case 'hard': return 'Advanced'
      default: return difficulty
    }
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Exercise Details" />
        <Error message={error} onRetry={loadExercise} />
      </div>
    )
  }

  if (!exercise) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Exercise Details" />
        <Error message="Exercise not found" showRetry={false} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title={exercise.name} />
      
      <div className="px-6 py-6 space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          icon="ArrowLeft"
          className="mb-4"
        >
          Back to Exercises
        </Button>

        {/* Exercise Overview */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-600">
                <ApperIcon name="Clock" className="w-5 h-5 mr-2" />
                {exercise.duration} minutes
              </div>
<div className={`font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                {getDifficultyDisplayName(exercise.difficulty)}
              </div>
            </div>
            
            {isCompleted && (
              <div className="flex items-center space-x-2 text-success">
                <ApperIcon name="CheckCircle" className="w-6 h-6" />
                <span className="font-medium">Completed</span>
              </div>
            )}
          </div>
          
          <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mb-6">
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
              <ApperIcon name="Play" className="w-24 h-24 text-primary" />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {exercise.benefits?.map((benefit, index) => (
              <span 
                key={index}
                className="px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary rounded-full text-sm font-medium"
              >
                {benefit}
              </span>
            ))}
          </div>
        </Card>

        {/* Timer & Controls */}
        <Card>
          <div className="text-center">
            <div className="text-6xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              {formatTime(timeLeft)}
            </div>
            
            <div className="mb-6">
              <div className="text-lg font-medium text-gray-800 mb-2">
                Step {currentStep + 1} of {exercise.steps?.length || 0}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / exercise.steps?.length) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              {!isRunning && timeLeft === 0 && (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={startExercise}
                  icon="Play"
                >
                  Start Exercise
                </Button>
              )}
              
              {isRunning && (
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={pauseExercise}
                  icon="Pause"
                >
                  Pause
                </Button>
              )}
              
              {!isRunning && timeLeft > 0 && (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={resumeExercise}
                  icon="Play"
                >
                  Resume
                </Button>
              )}
              
              {timeLeft > 0 && (
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={resetExercise}
                  icon="RotateCcw"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Current Step */}
        {exercise.steps && exercise.steps.length > 0 && (
          <Card>
            <h3 className="text-xl font-display font-semibold text-gray-800 mb-4">
              Current Step
            </h3>
            
            <div className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl">
              <div className="text-lg font-medium text-gray-800">
                {exercise.steps[currentStep]}
              </div>
            </div>
          </Card>
        )}

        {/* All Steps */}
        <Card>
          <h3 className="text-xl font-display font-semibold text-gray-800 mb-4">
            Exercise Steps
          </h3>
          
          <div className="space-y-4">
            {exercise.steps?.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  flex items-start space-x-4 p-4 rounded-2xl transition-all duration-300
                  ${index === currentStep 
                    ? 'bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-primary/20' 
                    : index < currentStep 
                      ? 'bg-success/10 border-2 border-success/20' 
                      : 'bg-gray-50 border-2 border-gray-200'
                  }
                `}
              >
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                  ${index === currentStep 
                    ? 'bg-primary text-white' 
                    : index < currentStep 
                      ? 'bg-success text-white' 
                      : 'bg-gray-300 text-gray-600'
                  }
                `}>
                  {index < currentStep ? (
                    <ApperIcon name="Check" className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                
                <div className="flex-1">
                  <p className="text-gray-800">{step}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ExerciseDetail