import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/molecules/Header'
import ExerciseCard from '@/components/molecules/ExerciseCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { ExerciseService } from '@/services/api/ExerciseService'
import { toast } from 'react-toastify'

const Exercises = () => {
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [completedExercises, setCompletedExercises] = useState([])
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')

  useEffect(() => {
    loadExercises()
    loadCompletedExercises()
  }, [])

  const loadExercises = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await ExerciseService.getAll()
      setExercises(data)
    } catch (err) {
      setError('Failed to load exercises. Please try again.')
      console.error('Error loading exercises:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadCompletedExercises = () => {
    const completed = JSON.parse(localStorage.getItem('completedExercises') || '[]')
    setCompletedExercises(completed)
  }

  const handleToggleComplete = (exerciseId) => {
    const isCompleted = completedExercises.includes(exerciseId)
    let newCompleted

    if (isCompleted) {
      newCompleted = completedExercises.filter(id => id !== exerciseId)
      toast.info('Exercise unmarked as completed')
    } else {
      newCompleted = [...completedExercises, exerciseId]
      toast.success('🎉 Exercise completed!')
    }

    setCompletedExercises(newCompleted)
    localStorage.setItem('completedExercises', JSON.stringify(newCompleted))
  }

  const filteredExercises = exercises.filter(exercise => {
    if (selectedDifficulty === 'all') return true
    return exercise.difficulty?.toLowerCase() === selectedDifficulty.toLowerCase()
  })

  const difficultyOptions = [
    { value: 'all', label: 'All Levels' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ]

  if (loading) {
    return <Loading type="cards" />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Facial Exercises" subtitle="Improve your skin with guided routines" />
        <Error message={error} onRetry={loadExercises} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="Facial Exercises" subtitle="Improve your skin with guided routines" />
      
      <div className="px-6 py-6 space-y-6">
        {/* Stats Bar */}
        <div className="glass-effect rounded-3xl p-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {completedExercises.length}
              </div>
              <div className="text-sm text-gray-600">Completed Today</div>
            </div>
            <div>
              <div className="text-2xl font-display font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                {exercises.length}
              </div>
              <div className="text-sm text-gray-600">Total Exercises</div>
            </div>
            <div>
              <div className="text-2xl font-display font-bold bg-gradient-to-r from-success to-info bg-clip-text text-transparent">
                {completedExercises.length > 0 ? Math.round((completedExercises.length / exercises.length) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-600">Progress</div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-display font-bold text-gray-800">
            Choose Your Routine
          </h2>
          
          <div className="flex items-center space-x-2">
            <ApperIcon name="Filter" className="w-5 h-5 text-gray-600" />
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {difficultyOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Exercises Grid */}
        {filteredExercises.length === 0 ? (
          <Empty 
            title="No exercises found"
            description="Try adjusting your filter or check back later for new routines"
            icon="Search"
          />
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {filteredExercises.map((exercise) => (
              <ExerciseCard
                key={exercise.Id}
                exercise={exercise}
                completed={completedExercises.includes(exercise.Id)}
                onToggleComplete={handleToggleComplete}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Exercises